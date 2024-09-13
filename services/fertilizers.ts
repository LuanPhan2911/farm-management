import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import {
  FertilizerFrequencyCount,
  FertilizerTable,
  FertilizerTypeCount,
  PaginatedResponse,
} from "@/types";
import { FertilizerType, Frequency } from "@prisma/client";

type FertilizerParams = {
  name: string;
  type: FertilizerType;
  nutrientOfNPK: string;
  composition?: string;
  manufacturer?: string;
  recommendedDosage?: {
    unitId: string;
    value: number;
  };
  applicationMethod?: string;
  frequencyOfUse?: Frequency;
};
export const createFertilizer = async (params: FertilizerParams) => {
  const { recommendedDosage: recommendedDosageParam, ...otherParams } = params;
  return await db.$transaction(async (ctx) => {
    const recommendedDosage = recommendedDosageParam
      ? await ctx.floatUnit.create({
          data: {
            ...recommendedDosageParam,
          },
        })
      : null;
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
    if (recommendedDosageParam) {
      if (fertilizer.recommendedDosageId) {
        await ctx.floatUnit.update({
          data: {
            ...recommendedDosageParam,
          },
          where: {
            id: fertilizer.recommendedDosageId,
          },
        });
      } else {
        ctx.floatUnit.create({
          data: {
            ...recommendedDosageParam,
          },
        });
      }
    }
    return fertilizer;
  });
};
export const deleteFertilizer = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const fertilizer = await ctx.fertilizer.delete({
      where: { id },
    });
    if (fertilizer.recommendedDosageId) {
      await ctx.floatUnit.delete({
        where: { id: fertilizer.recommendedDosageId },
      });
    }
  });
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
    const fertilizers = await db.fertilizer.findMany({
      where: {
        ...(filterString && getObjectFilterString(filterString)),
        ...(filterNumber && getObjectFilterNumber(filterNumber)),
      },
      orderBy: {
        ...(orderBy && getObjectSortOrder(orderBy)),
      },
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
    });
    const totalPage = Math.ceil(fertilizers.length / LIMIT);
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

export const getCountFertilizerType = async ({
  filterString,
}: FertilizerQuery): Promise<FertilizerTypeCount[]> => {
  try {
    const result = await db.fertilizer.groupBy({
      by: "type",
      where: {
        ...(filterString && getObjectFilterString(filterString)),
      },
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
export const getCountFertilizerFrequencyOfUse = async ({
  filterString,
}: FertilizerQuery): Promise<FertilizerFrequencyCount[]> => {
  try {
    const result = await db.fertilizer.groupBy({
      by: "frequencyOfUse",
      where: {
        frequencyOfUse: {
          not: null,
        },
        ...(filterString && getObjectFilterString(filterString)),
      },
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
