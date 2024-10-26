import {
  ActivityExistError,
  ActivityUpdateStatusError,
  EquipmentDetailExistError,
  EquipmentUsageExistError,
  StaffExistError,
} from "@/errors";
import { canUpdateActivityStatus } from "@/lib/permission";
import { db } from "@/lib/db";
import { getStaffById } from "./staffs";
import { LIMIT } from "@/configs/paginationConfig";
import { getObjectSortOrder } from "@/lib/utils";
import { EquipmentUsageTable, PaginatedResponse } from "@/types";
import { revalidatePath } from "next/cache";

type RevalidateEquipmentUsageParam = {
  equipmentDetailId: string;
  equipmentId: string;
  activityId: string | null;
};
export const revalidatePathEquipmentUsage = ({
  equipmentId,
  equipmentDetailId,
  activityId,
}: RevalidateEquipmentUsageParam) => {
  revalidatePath(`/admin/equipments/detail/${equipmentId}`);
  revalidatePath(`/admin/equipments/detail/${equipmentId}/details`);
  revalidatePath(
    `/admin/equipments/detail/${equipmentId}/details/${equipmentDetailId}/usages`
  );
  if (activityId) {
    revalidatePath(`/admin/activities/detail/${activityId}/equipment-usages`);
  }
};
const checkCreateEquipmentUsage = async ({
  equipmentDetailId,
  operatorId,
  activityId,
}: {
  equipmentDetailId: string;
  operatorId?: string | null;
  activityId?: string | null;
}) => {
  const equipmentDetail = await db.equipmentDetail.findUnique({
    where: {
      id: equipmentDetailId,
    },
  });
  if (!equipmentDetail) {
    throw new EquipmentDetailExistError();
  }
  if (operatorId) {
    const operator = await getStaffById(operatorId);
    if (!operator) {
      throw new StaffExistError();
    }
  }
  if (activityId) {
    const activity = await db.activity.findUnique({
      where: { id: activityId },
      select: {
        status: true,
        field: {
          select: {
            location: true,
          },
        },
      },
    });
    if (!activity) {
      throw new ActivityExistError();
    }
    if (!canUpdateActivityStatus(activity.status)) {
      throw new ActivityUpdateStatusError();
    }
  }
  return true;
};
const checkUpdateEquipmentUsage = async ({
  equipmentUsageId,
}: {
  equipmentUsageId: string;
}) => {
  const equipmentUsage = await db.equipmentUsage.findUnique({
    where: { id: equipmentUsageId },
    select: {
      activity: {
        select: {
          status: true,
        },
      },
    },
  });
  if (!equipmentUsage) {
    throw new EquipmentUsageExistError();
  }
  if (equipmentUsage.activity) {
    if (!canUpdateActivityStatus(equipmentUsage.activity.status)) {
      throw new ActivityUpdateStatusError();
    }
  }
  return true;
};
type EquipmentUsageParams = {
  activityId?: string | null;
  equipmentDetailId: string;
  usageStartTime: Date;
  duration: string;
  operatorId?: string | null;
  note?: string | null;
};

export const createEquipmentUsage = async (params: EquipmentUsageParams) => {
  const { activityId, operatorId, equipmentDetailId } = params;
  await checkCreateEquipmentUsage({
    equipmentDetailId,
    activityId,
    operatorId,
  });

  const [updatedEquipmentDetail, equipmentUsage] = await db.$transaction([
    db.equipmentDetail.update({
      where: {
        id: equipmentDetailId,
      },
      data: {
        status: "WORKING",
      },
    }),
    db.equipmentUsage.create({
      data: { ...params },
      include: {
        equipmentDetail: {
          select: {
            equipmentId: true,
          },
        },
      },
    }),
  ]);
  return { updatedEquipmentDetail, equipmentUsage };
};
type EquipmentUsageUpdateParams = {
  duration: string;
  note?: string | null;
  usageStartTime: Date;
};
export const updateEquipmentUsage = async (
  id: string,
  params: EquipmentUsageUpdateParams
) => {
  await checkUpdateEquipmentUsage({ equipmentUsageId: id });
  const updatedEquipmentUsage = await db.equipmentUsage.update({
    where: {
      id,
    },
    data: {
      ...params,
    },
    include: {
      equipmentDetail: {
        select: {
          equipmentId: true,
        },
      },
    },
  });
  return updatedEquipmentUsage;
};

export const assignEquipmentUsage = async (
  id: string,
  { activityId }: { activityId: string }
) => {
  const equipmentUsage = await db.equipmentUsage.findUnique({
    where: {
      id,
      activityId: null,
    },
  });
  if (!equipmentUsage) {
    throw new EquipmentUsageExistError();
  }
  const activity = await db.activity.findUnique({
    where: { id: activityId },
  });
  if (!activity) {
    throw new ActivityExistError();
  }
  if (!canUpdateActivityStatus(activity.status)) {
    throw new ActivityUpdateStatusError();
  }
  const updatedEquipmentUsage = await db.equipmentUsage.update({
    where: {
      id,
    },
    data: {
      activityId,
    },
    include: {
      equipmentDetail: {
        select: {
          equipmentId: true,
        },
      },
    },
  });
  return updatedEquipmentUsage;
};
export const revokeEquipmentUsage = async (
  id: string,
  { activityId }: { activityId: string }
) => {
  const equipmentUsage = await db.equipmentUsage.findUnique({
    where: { id, activityId },
  });
  if (!equipmentUsage) {
    throw new EquipmentUsageExistError();
  }
  const activity = await db.activity.findUnique({ where: { id: activityId } });
  if (!activity) {
    throw new ActivityExistError();
  }
  if (!canUpdateActivityStatus(activity.status)) {
    throw new ActivityUpdateStatusError();
  }
  const updatedEquipmentUsage = await db.equipmentUsage.update({
    where: { id },
    data: {
      activityId: null,
    },
    include: {
      equipmentDetail: {
        select: {
          equipmentId: true,
        },
      },
    },
  });
  return updatedEquipmentUsage;
};
export const deleteEquipmentUsage = async (id: string) => {
  const equipmentUsage = await db.equipmentUsage.findUnique({
    where: { id },
    select: {
      activity: {
        select: {
          status: true,
        },
      },
      equipmentDetailId: true,
    },
  });
  if (!equipmentUsage) {
    throw new EquipmentUsageExistError();
  }
  if (equipmentUsage.activity) {
    if (!canUpdateActivityStatus(equipmentUsage.activity.status)) {
      throw new ActivityUpdateStatusError();
    }
  }

  //1: update equipment detail status to available
  //2: delete equipment usage
  const [deletedEquipmentUsage, updatedEquipmentDetail] = await db.$transaction(
    [
      db.equipmentUsage.delete({
        where: {
          id,
        },
        include: {
          equipmentDetail: {
            select: {
              equipmentId: true,
            },
          },
        },
      }),
      db.equipmentDetail.update({
        where: {
          id: equipmentUsage.equipmentDetailId,
        },
        data: {
          status: "AVAILABLE",
        },
      }),
    ]
  );
  return { updatedEquipmentDetail, deletedEquipmentUsage };
};
type EquipmentUsageQuery = {
  equipmentDetailId: string;
  page?: number;
  query?: string;
  orderBy?: string;
};
export const getEquipmentUsages = async ({
  equipmentDetailId,
  orderBy,
  page = 1,
  query,
}: EquipmentUsageQuery): Promise<PaginatedResponse<EquipmentUsageTable>> => {
  try {
    const [data, count] = await db.$transaction([
      db.equipmentUsage.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          equipmentDetailId,
          equipmentDetail: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },

        include: {
          equipmentDetail: {
            select: {
              id: true,
              name: true,
              equipmentId: true,
              status: true,
              location: true,
              equipment: {
                select: {
                  name: true,
                  type: true,
                  imageUrl: true,
                },
              },
            },
          },
          activity: {
            select: {
              id: true,
              name: true,
              status: true,
              priority: true,
              createdBy: true,
              assignedTo: true,
              activityDate: true,
              note: true,
            },
          },
          operator: true,
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
      }),
      db.equipmentUsage.count({
        where: {
          equipmentDetailId,
          equipmentDetail: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(count / LIMIT);
    return {
      data,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

type ActivityEquipmentUsageQuery = {
  activityId: string;
  query?: string;
  orderBy?: string;
};
export const getEquipmentUsagesByActivityId = async ({
  activityId,
  orderBy,
  query,
}: ActivityEquipmentUsageQuery): Promise<EquipmentUsageTable[]> => {
  try {
    return await db.equipmentUsage.findMany({
      where: {
        OR: [
          {
            activityId: null,
          },
          {
            activityId,
          },
        ],
        equipmentDetail: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },

      include: {
        equipmentDetail: {
          select: {
            id: true,
            name: true,
            equipmentId: true,
            status: true,
            location: true,
            equipment: {
              select: {
                name: true,
                type: true,
                imageUrl: true,
              },
            },
          },
        },
        activity: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            createdBy: true,
            assignedTo: true,
            activityDate: true,
            note: true,
          },
        },
        operator: true,
      },
      orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
    });
  } catch (error) {
    return [];
  }
};
