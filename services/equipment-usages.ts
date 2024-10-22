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
};
export const revalidatePathEquipmentUsage = ({
  equipmentDetailId,
}: RevalidateEquipmentUsageParam) => {
  revalidatePath(`/admin/equipments/detail/${equipmentDetailId}`);
  revalidatePath(`/admin/equipments/detail/${equipmentDetailId}/details`);
  revalidatePath(`/admin/equipments/detail/${equipmentDetailId}/usages`);
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
      },
    });
    if (!activity) {
      throw new ActivityExistError();
    }
    if (!canUpdateActivityStatus(activity.status)) {
      throw new ActivityUpdateStatusError();
    }
  }

  const [updatedEquipmentDetail, equipmentUsage] = await db.$transaction([
    db.equipmentDetail.update({
      where: {
        id: equipmentDetailId,
      },
      data: {
        status: activityId ? "WORKING" : "AVAILABLE",
      },
    }),
    db.equipmentUsage.create({
      data: { ...params },
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
  const equipmentUsage = await db.equipmentUsage.findUnique({
    where: { id },
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
  const updatedEquipmentUsage = await db.equipmentUsage.update({
    where: {
      id,
    },
    data: {
      ...params,
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
  const [updatedEquipmentDetail, deletedEquipmentUsage] = await db.$transaction(
    [
      db.equipmentDetail.update({
        where: {
          id: equipmentUsage.equipmentDetailId,
        },
        data: {
          status: "AVAILABLE",
        },
      }),
      db.equipmentUsage.delete({
        where: {
          id,
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
