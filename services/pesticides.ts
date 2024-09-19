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
import {
  deleteFloatUnit,
  deleteIntUnit,
  UnitValue,
  upsertFloatUnit,
  upsertIntUnit,
} from "./units";

type PesticideParams = {
  name: string;
  type: PesticideType;
  ingredient?: string;
  manufacturer?: string;
  withdrawalPeriod?: Partial<UnitValue>;
  recommendedDosage?: Partial<UnitValue>;
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
    const recommendedDosage = await upsertFloatUnit({
      ctx,
      data: recommendedDosageParam,
    });
    const withdrawalPeriod = await upsertIntUnit({
      ctx,
      data: withdrawalPeriodParam,
    });
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
    await upsertFloatUnit({
      ctx,
      data: recommendedDosageParam,
      id: pesticide.recommendedDosageId,
    });
    await upsertIntUnit({
      ctx,
      data: withdrawalPeriodParam,
      id: pesticide.withdrawalPeriodId,
    });
    return pesticide;
  });
};
export const deletePesticide = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const pesticide = await ctx.pesticide.delete({
      where: { id },
    });
    await deleteFloatUnit(ctx, pesticide.recommendedDosageId);
    await deleteIntUnit(ctx, pesticide.withdrawalPeriodId);
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
