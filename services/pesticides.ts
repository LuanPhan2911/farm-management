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
  ingredient?: string | null;
  manufacturer?: string | null;
  withdrawalPeriod?: Partial<UnitValue> | null;
  recommendedDosage?: Partial<UnitValue> | null;
  applicationMethod?: string | null;
  toxicityLevel?: ToxicityLevel | null;
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
    const [pesticides, count] = await db.$transaction([
      db.pesticide.findMany({
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
      }),
      db.pesticide.count({
        where: {
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
      }),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
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

export const getCountPesticideType = async ({}: PesticideQuery): Promise<
  PesticideTypeCount[]
> => {
  try {
    const result = await db.pesticide.groupBy({
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
export const getCountPesticideToxicityLevel =
  async ({}: PesticideQuery): Promise<PesticideToxicityLevelCount[]> => {
    try {
      const result = await db.pesticide.groupBy({
        by: "toxicityLevel",

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
