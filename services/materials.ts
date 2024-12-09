import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import {
  MaterialMostUsedChart,
  MaterialSelect,
  MaterialTable,
  MaterialTypeCount,
  MaterialUsedChart,
  MaterialUsedInCrop,
  MaterialWithCost,
  PaginatedResponse,
} from "@/types";
import { MaterialType } from "@prisma/client";
import { materialSelect } from "./material-usages";
import { activitySelect } from "./activities";
import _ from "lodash";
import {
  addMonths,
  eachMonthOfInterval,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { unitInclude } from "./units";

type MaterialParam = {
  name: string;
  quantityInStock: number;
  unitId: string;
  type: MaterialType;
  description?: string | null;
  imageUrl?: string | null;
  basePrice?: number | null;
  typeId?: string | null;
};
export const createMaterial = async (params: MaterialParam) => {
  return await db.material.create({
    data: {
      ...params,
    },
  });
};

export const updateMaterial = async (id: string, params: MaterialParam) => {
  return await db.material.update({
    where: { id },
    data: {
      ...params,
    },
  });
};
export const deleteMaterial = async (id: string) => {
  return await db.material.delete({
    where: { id },
  });
};

type MaterialQuery = {
  page?: number;
  query?: string;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
};
export const getMaterials = async ({
  page = 1,
  query,
  filterNumber,
  filterString,
  orderBy,
}: MaterialQuery): Promise<PaginatedResponse<MaterialTable>> => {
  try {
    const [data, count] = await db.$transaction([
      db.material.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
        include: {
          unit: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              materialUsages: true,
            },
          },
        },
      }),
      db.material.count({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
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
export const getMaterialById = async (
  id: string
): Promise<MaterialTable | null> => {
  try {
    return await db.material.findUnique({
      where: { id },
      include: {
        unit: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            materialUsages: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
export const getMaterialsSelect = async (): Promise<MaterialSelect[]> => {
  try {
    return await db.material.findMany({
      select: {
        ...materialSelect,
      },
    });
  } catch (error) {
    return [];
  }
};

export const getCountMaterialType = async (): Promise<MaterialTypeCount[]> => {
  try {
    const result = await db.material.groupBy({
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

type MaterialUsageCostQuery = {
  begin?: Date;
  end?: Date;
  query?: string;
};
export const getMaterialUsageCost = async ({
  begin,
  end,
  query,
}: MaterialUsageCostQuery): Promise<MaterialWithCost[]> => {
  try {
    if (!begin || !end) {
      throw new Error("Missing begin and end date");
    }
    const materials = await db.material.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        materialUsages: {
          some: {
            activity: {
              status: "COMPLETED",
              activityDate: {
                gte: begin,
                lte: end,
              },
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            materialUsages: true,
          },
        },
        materialUsages: {
          include: {
            activity: {
              select: {
                ...activitySelect,
              },
            },
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });

    const materialWithCosts: MaterialWithCost[] = materials.map((material) => {
      const { materialUsages } = material;
      return {
        ...material,
        totalQuantityUsed: _.sumBy(
          materialUsages,
          ({ activity, quantityUsed }) => {
            if (!activity || activity.status !== "COMPLETED") {
              return 0;
            }
            return quantityUsed;
          }
        ),
        totalCost: _.sumBy(
          materialUsages,
          ({ activity, actualPrice, quantityUsed }) => {
            if (
              !activity ||
              activity.status !== "COMPLETED" ||
              actualPrice === null
            ) {
              return 0;
            }

            return quantityUsed * actualPrice;
          }
        ),
      };
    });

    return materialWithCosts;
  } catch (error) {
    return [];
  }
};

export const getMaterialUsageCostChart = async (): Promise<
  MaterialUsedChart[]
> => {
  try {
    const months = eachMonthOfInterval({
      start: addMonths(new Date(), -2),
      end: new Date(),
    });
    const materialCostEachMonth = await Promise.all(
      months.map((month) => {
        return getMaterialUsageCost({
          begin: startOfMonth(month),
          end: endOfMonth(month),
        });
      })
    );
    const materialChart: MaterialUsedChart[] = materialCostEachMonth.map(
      (materials, index) => {
        return {
          month: months[index],
          totalCost: _.sumBy(materials, (item) => item.totalCost),
        };
      }
    );
    return materialChart;
  } catch (error) {
    return [];
  }
};

export const getMaterialMostUsages = async (
  limit: number = 10
): Promise<MaterialMostUsedChart[]> => {
  try {
    const begin = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const materials = await getMaterialUsageCost({
      begin,
      end,
    });
    const materialCharts: MaterialMostUsedChart[] = materials.map((item) => {
      return {
        name: item.name,
        quantityUsed: item.totalQuantityUsed,
      };
    });
    const sortedMaterialCharts = _.orderBy(
      materialCharts,
      (item) => item.quantityUsed,
      "desc"
    );
    return _.take(sortedMaterialCharts, limit);
  } catch (error) {
    return [];
  }
};

export const getMaterialUsedInCrop = async (
  cropId: string
): Promise<MaterialUsedInCrop> => {
  try {
    const materials = await db.material.findMany({
      where: {
        type: {
          in: ["FERTILIZER", "PESTICIDE"], // Filter by material type
        },
        materialUsages: {
          some: {
            activity: {
              cropId: cropId, // Filter by cropId
            },
          },
        },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
    const pesticideIds = materials
      .filter((item) => {
        return item.type === "PESTICIDE" && item.typeId !== null;
      })
      .map((item) => item.typeId!);
    const fertilizerIds = materials
      .filter((item) => {
        return item.type === "FERTILIZER" && item.typeId !== null;
      })
      .map((item) => item.typeId!);
    const pesticides = await db.pesticide.findMany({
      where: {
        id: {
          in: pesticideIds,
        },
      },
      include: {
        recommendedDosage: {
          include: {
            ...unitInclude,
          },
        },
        withdrawalPeriod: {
          include: {
            ...unitInclude,
          },
        },
      },
    });
    const fertilizers = await db.fertilizer.findMany({
      where: {
        id: {
          in: fertilizerIds,
        },
      },
      include: {
        recommendedDosage: {
          include: {
            ...unitInclude,
          },
        },
      },
    });
    return {
      fertilizers,
      pesticides,
    };
  } catch (error) {
    return {
      fertilizers: [],
      pesticides: [],
    };
  }
};
