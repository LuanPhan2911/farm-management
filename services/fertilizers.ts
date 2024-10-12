import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import {
  FertilizerFrequencyCount,
  FertilizerSelect,
  FertilizerTable,
  FertilizerTypeCount,
  PaginatedResponse,
} from "@/types";
import { FertilizerType, Frequency } from "@prisma/client";
import { deleteFloatUnit, UnitValue, upsertFloatUnit } from "./units";

type FertilizerParams = {
  name: string;
  type: FertilizerType;
  nutrientOfNPK: string;
  composition?: string | null;
  manufacturer?: string | null;
  recommendedDosage?: Partial<UnitValue> | null;
  applicationMethod?: string | null;
  frequencyOfUse?: Frequency | null;
};
export const createFertilizer = async (params: FertilizerParams) => {
  const { recommendedDosage: recommendedDosageParam, ...otherParams } = params;
  return await db.$transaction(async (ctx) => {
    const recommendedDosage = await upsertFloatUnit({
      ctx,
      data: recommendedDosageParam,
    });
    const fertilizer = await ctx.fertilizer.create({
      data: {
        ...otherParams,
        recommendedDosageId: recommendedDosage?.id,
      },
    });
    return fertilizer;
  });
};
export const updateFertilizer = async (
  id: string,
  params: FertilizerParams
) => {
  const { recommendedDosage: recommendedDosageParam, ...otherParams } = params;
  return await db.$transaction(async (ctx) => {
    const fertilizer = await ctx.fertilizer.update({
      where: { id },
      data: {
        ...otherParams,
      },
    });
    await upsertFloatUnit({
      ctx,
      data: recommendedDosageParam,
      id: fertilizer.recommendedDosageId,
    });
    return fertilizer;
  });
};
export const deleteFertilizer = async (id: string) => {
  const fertilizer = await db.fertilizer.delete({
    where: { id },
  });
  return fertilizer;
};
type FertilizerQuery = {
  page?: number;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
};
export const getFertilizers = async ({
  filterNumber,
  filterString,
  orderBy,
  page = 1,
}: FertilizerQuery): Promise<PaginatedResponse<FertilizerTable>> => {
  try {
    const [fertilizers, count] = await db.$transaction([
      db.fertilizer.findMany({
        where: {
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        include: {
          recommendedDosage: {
            include: {
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      db.fertilizer.count({
        where: {
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
      }),
    ]);

    const totalPage = Math.ceil(count / LIMIT);
    return {
      data: fertilizers,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

export const getCountFertilizerType = async ({}: FertilizerQuery): Promise<
  FertilizerTypeCount[]
> => {
  try {
    const result = await db.fertilizer.groupBy({
      by: "type",

      _count: {
        _all: true,
      },
    });
    return result.map((item) => {
      return {
        type: item.type,
        _count: item._count._all,
      };
    });
  } catch (error) {
    return [];
  }
};
export const getCountFertilizerFrequencyOfUse =
  async ({}: FertilizerQuery): Promise<FertilizerFrequencyCount[]> => {
    try {
      const result = await db.fertilizer.groupBy({
        by: "frequencyOfUse",

        _count: {
          _all: true,
        },
      });
      return result.map((item) => {
        return {
          frequencyOfUse: item.frequencyOfUse!,
          _count: item._count._all,
        };
      });
    } catch (error) {
      return [];
    }
  };

export const getFertilizersSelect = async (): Promise<FertilizerSelect[]> => {
  try {
    return await db.fertilizer.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        frequencyOfUse: true,
        applicationMethod: true,
        recommendedDosage: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};
