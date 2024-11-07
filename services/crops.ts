import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { getObjectFilterNumber, getObjectSortOrder } from "@/lib/utils";
import {
  CropSelect,
  CropSelectWithField,
  CropTable,
  PaginatedResponse,
} from "@/types";
import { unitInclude, UnitValue, upsertFloatUnit } from "./units";
import { getCurrentStaff } from "./staffs";
import { isFarmer, isOnlyAdmin } from "@/lib/permission";
import { fieldSelect } from "./fields";
import { plantSelect } from "./plants";

type CropParams = {
  name: string;
  dateRange: {
    startDate: Date;
    endDate?: Date | null;
  };
  fieldId: string;
  plantId: string;
  estimatedYield?: Partial<UnitValue> | null;
  actualYield?: Partial<UnitValue> | null;
  status?: string | null;
};

export const createCrop = async (params: CropParams) => {
  return await db.$transaction(async (ctx) => {
    const {
      actualYield: actualYieldParam,
      estimatedYield: estimatedYieldParam,
      dateRange: { startDate, endDate },
      ...other
    } = params;
    const estimatedYield = await upsertFloatUnit({
      ctx,
      data: estimatedYieldParam,
    });
    const actualYield = await upsertFloatUnit({
      ctx,
      data: actualYieldParam,
    });
    const crop = await ctx.crop.create({
      data: {
        ...other,
        startDate,
        endDate,
        actualYieldId: actualYield?.id,
        estimatedYieldId: estimatedYield?.id,
      },
    });
    return crop;
  });
};
export const updateCrop = async (id: string, params: CropParams) => {
  return await db.$transaction(async (ctx) => {
    const {
      actualYield: actualYieldParam,
      estimatedYield: estimatedYieldParam,
      dateRange: { startDate, endDate },
      ...other
    } = params;

    let crop = await ctx.crop.update({
      where: { id },
      data: {
        ...other,
      },
    });

    const estimatedYield = await upsertFloatUnit({
      ctx,
      data: estimatedYieldParam,
      id: crop?.estimatedYieldId,
    });
    const actualYield = await upsertFloatUnit({
      ctx,
      data: actualYieldParam,
      id: crop?.actualYieldId,
    });

    return crop;
  });
};
export const deleteCrop = async (id: string) => {
  const crop = await db.crop.delete({ where: { id } });
  return crop;
};
type CropQuery = {
  orgId?: string | null;
  plantId?: string;
  fieldId?: string;
  name?: string;
  page?: number;
  orderBy?: string;
  startDate?: Date;
  endDate?: Date;
  filterNumber?: string;
};
export const getCrops = async ({
  orgId,
  endDate,
  filterNumber,
  name,
  orderBy,
  page = 1,
  plantId,
  startDate,
  fieldId,
}: CropQuery): Promise<PaginatedResponse<CropTable>> => {
  try {
    let fields;
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    if (!orgId && isOnlyAdmin(currentStaff.role)) {
      fields = await db.field.findMany({
        select: {
          id: true,
        },
      });
    }
    if (!orgId && isFarmer(currentStaff.role)) {
      throw new Error("No field id to get crops");
    }
    if (orgId) {
      fields = await db.field.findMany({
        where: {
          orgId,
        },
        select: {
          id: true,
        },
      });
    }

    const [crops, count] = await db.$transaction([
      db.crop.findMany({
        where: {
          ...(fieldId
            ? {
                fieldId,
              }
            : {
                fieldId: {
                  in: fields?.map((item) => item.id),
                },
              }),
          AND: [
            {
              startDate: {
                ...(startDate && {
                  gte: startDate,
                }),
              },
              endDate: {
                ...(endDate && {
                  lte: endDate,
                }),
              },
            },
          ],
          ...(plantId && { plantId }),
          ...(name && {
            name: {
              contains: name,
              mode: "insensitive",
            },

            ...(filterNumber && getObjectFilterNumber(filterNumber)),
          }),
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        include: {
          actualYield: {
            include: {
              ...unitInclude,
            },
          },
          estimatedYield: {
            include: {
              ...unitInclude,
            },
          },
          plant: {
            select: {
              ...plantSelect,
            },
          },
          field: {
            select: {
              ...fieldSelect,
            },
          },
          _count: {
            select: {
              activities: true,
            },
          },
        },
      }),
      db.crop.count({
        where: {
          ...(fieldId
            ? {
                fieldId,
              }
            : {
                fieldId: {
                  in: fields?.map((item) => item.id),
                },
              }),
          AND: [
            {
              startDate: {
                ...(startDate && {
                  gte: startDate,
                }),
              },
              endDate: {
                ...(endDate && {
                  lte: endDate,
                }),
              },
            },
          ],
          ...(plantId && { plantId }),
          ...(name && {
            name: {
              contains: name,
              mode: "insensitive",
            },

            ...(filterNumber && getObjectFilterNumber(filterNumber)),
          }),
        },
      }),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
    return {
      data: crops,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

export const getCropById = async (id: string): Promise<CropTable | null> => {
  try {
    return await db.crop.findUnique({
      where: { id },
      include: {
        actualYield: {
          include: {
            ...unitInclude,
          },
        },
        estimatedYield: {
          include: {
            ...unitInclude,
          },
        },
        plant: {
          select: {
            ...plantSelect,
          },
        },
        field: {
          select: {
            ...fieldSelect,
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const cropSelect = {
  id: true,
  name: true,
  startDate: true,
  endDate: true,
};
export const getCropsSelect = async (): Promise<CropSelectWithField[]> => {
  try {
    return await db.crop.findMany({
      select: {
        ...cropSelect,
        field: {
          select: {
            ...fieldSelect,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    return [];
  }
};
