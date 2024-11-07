import { ActivityUpdateStatusError, EquipmentUsageExistError } from "@/errors";
import { canUpdateActivityStatus } from "@/lib/permission";
import { db } from "@/lib/db";
import { LIMIT } from "@/configs/paginationConfig";
import { getObjectSortOrder } from "@/lib/utils";
import { EquipmentUsageTable, PaginatedResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { equipmentDetailSelect } from "./equipment-details";
import { equipmentSelect } from "./equipments";
import { activitySelect } from "./activities";
import { cropSelect } from "./crops";
import { fieldSelect } from "./fields";

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

type EquipmentUsageParams = {
  activityId?: string | null;
  equipmentDetailId: string;
  usageStartTime: Date;
  duration: number;
  operatorId?: string | null;
  note?: string | null;
  location?: string | null;
};

export const createEquipmentUsage = async (params: EquipmentUsageParams) => {
  const { location, ...other } = params;
  const [updatedEquipmentDetail, equipmentUsage] = await db.$transaction([
    db.equipmentDetail.update({
      where: {
        id: params.equipmentDetailId,
      },
      data: {
        status: "WORKING",
        location,
      },
    }),
    db.equipmentUsage.create({
      data: { ...other },
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
  duration: number;
  note?: string | null;
  usageStartTime: Date;
};
export const updateEquipmentUsage = async (
  id: string,
  params: EquipmentUsageUpdateParams
) => {
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
export const revokeEquipmentUsage = async (id: string) => {
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
          location: null,
        },
      }),
    ]
  );
  return { updatedEquipmentDetail, deletedEquipmentUsage };
};
type EquipmentUsageQuery = {
  equipmentDetailId?: string;
  page?: number;
  query?: string;
  orderBy?: string;
  activityId?: string;
};
export const getEquipmentUsages = async ({
  equipmentDetailId,
  activityId,
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
          ...(equipmentDetailId && {
            equipmentDetailId,
          }),
          ...(activityId && {
            OR: [
              {
                activityId: null,
              },
              {
                activityId,
              },
            ],
          }),
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
              ...equipmentDetailSelect,
              equipment: {
                select: {
                  ...equipmentSelect,
                },
              },
            },
          },
          activity: {
            select: {
              ...activitySelect,
              crop: {
                select: {
                  ...cropSelect,
                  field: {
                    select: {
                      ...fieldSelect,
                    },
                  },
                },
              },
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
