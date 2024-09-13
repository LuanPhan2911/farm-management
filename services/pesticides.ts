import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import {
  PaginatedResponse,
  PesticideTable,
  PesticideToxicityLevelCount,
  PesticideTypeCount,
} from "@/types";
import { PesticideType, ToxicityLevel } from "@prisma/client";

type PesticideParams = {
  name: string;
  type: PesticideType;
  ingredient?: string;
  manufacturer?: string;
  withdrawalPeriod?: {
    unitId: string;
    value: number;
  };
  recommendedDosage?: {
    unitId: string;
    value: number;
  };
  applicationMethod?: string;
  toxicityLevel?: ToxicityLevel;
};
export const createPesticide = async (params: PesticideParams) => {
  const {
    recommendedDosage: recommendedDosageParam,
    withdrawalPeriod: withdrawalPeriodParam,
    ...otherParams
  } = params;
  return await db.$transaction(async (ctx) => {
    const recommendedDosage = recommendedDosageParam
      ? await ctx.floatUnit.create({
          data: {
            ...recommendedDosageParam,
          },
        })
      : null;
    const withdrawalPeriod = withdrawalPeriodParam
      ? await ctx.intUnit.create({
          data: {
            ...withdrawalPeriodParam,
          },
        })
      : null;
    const pesticide = await ctx.pesticide.create({
      data: {
        ...otherParams,
        recommendedDosageId: recommendedDosage?.id,
        withdrawalPeriodId: withdrawalPeriod?.id,
      },
    });
    return pesticide;
  });
};
export const updatePesticide = async (id: string, params: PesticideParams) => {
  const {
    recommendedDosage: recommendedDosageParam,
    withdrawalPeriod: withdrawalPeriodParam,
    ...otherParams
  } = params;
  return await db.$transaction(async (ctx) => {
    const pesticide = await ctx.pesticide.update({
      where: { id },
      data: {
        ...otherParams,
      },
    });
    if (recommendedDosageParam) {
      if (pesticide.recommendedDosageId) {
        await ctx.floatUnit.update({
          data: {
            ...recommendedDosageParam,
          },
          where: {
            id: pesticide.recommendedDosageId,
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
    if (withdrawalPeriodParam) {
      if (pesticide.withdrawalPeriodId) {
        await ctx.intUnit.update({
          data: {
            ...withdrawalPeriodParam,
          },
          where: {
            id: pesticide.withdrawalPeriodId,
          },
        });
      } else {
        ctx.intUnit.create({
          data: {
            ...withdrawalPeriodParam,
          },
        });
      }
    }
    return pesticide;
  });
};
export const deletePesticide = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const pesticide = await ctx.pesticide.delete({
      where: { id },
    });
    if (pesticide.recommendedDosageId) {
      await ctx.floatUnit.delete({
        where: { id: pesticide.recommendedDosageId },
      });
    }
    if (pesticide.withdrawalPeriodId) {
      await ctx.intUnit.delete({
        where: { id: pesticide.withdrawalPeriodId },
      });
    }
  });
};
type PesticideQuery = {
  page?: number;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
};
export const getPesticides = async ({
  filterNumber,
  filterString,
  orderBy,
  page = 1,
}: PesticideQuery): Promise<PaginatedResponse<PesticideTable>> => {
  try {
    const pesticides = await db.pesticide.findMany({
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
        withdrawalPeriod: {
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
    const totalPage = Math.ceil(pesticides.length / LIMIT);
    return {
      data: pesticides,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

export const getCountPesticideType = async ({
  filterString,
}: PesticideQuery): Promise<PesticideTypeCount[]> => {
  try {
    const result = await db.pesticide.groupBy({
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
export const getCountPesticideToxicityLevel = async ({
  filterString,
}: PesticideQuery): Promise<PesticideToxicityLevelCount[]> => {
  try {
    const result = await db.pesticide.groupBy({
      by: "toxicityLevel",
      where: {
        toxicityLevel: {
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
        toxicityLevel: item.toxicityLevel!,
        _count: item._count._all,
      };
    });
  } catch (error) {
    return [];
  }
};
