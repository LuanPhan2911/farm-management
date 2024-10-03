import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { getObjectFilterNumber, getObjectSortOrder } from "@/lib/utils";
import { CropTable, PaginatedResponse } from "@/types";
import { UnitValue, upsertFloatUnit } from "./units";

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
  return await db.$transaction(async (ctx) => {
    const crop = await ctx.crop.delete({ where: { id } });
    return crop;
  });
};
type CropQuery = {
  fieldId: string;
  plantId?: string;
  name?: string;
  page?: number;
  orderBy?: string;
  startDate?: Date;
  endDate?: Date;
  filterNumber?: string;
};
export const getCropsOnField = async ({
  fieldId,
  endDate,
  filterNumber,
  name,
  orderBy,
  page = 1,
  plantId,
  startDate,
}: CropQuery): Promise<PaginatedResponse<CropTable>> => {
  try {
    const [crops, count] = await db.$transaction([
      db.crop.findMany({
        where: {
          fieldId,
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
        orderBy: {
          ...(orderBy && getObjectSortOrder(orderBy)),
        },
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        include: {
          actualYield: {
            include: {
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },
          estimatedYield: {
            include: {
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },
          plant: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
      db.crop.count({
        where: {
          fieldId,
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
