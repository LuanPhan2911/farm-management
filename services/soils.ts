import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import { PaginatedResponse, SoilTable } from "@/types";

type SoilParams = {
  ph: number;
  moisture: {
    value: number;
    unitId: string;
  };
  nutrientNitrogen: number;
  nutrientPhosphorus: number;
  nutrientPotassium: number;
  nutrientUnitId: string;
  fieldId: string;
};

export const createSoil = async (params: SoilParams) => {
  return await db.$transaction(async (ctx) => {
    const { moisture: moistureParam, ...others } = params;
    const moisture = await ctx.intUnit.create({
      data: {
        ...moistureParam,
      },
    });

    const soil = await ctx.soil.create({
      data: {
        ...others,
        moistureId: moisture.id,
      },
    });
    return soil;
  });
};
export const createManySoil = async (params: SoilParams[]) => {
  const soils = params.map((param) => createSoil(param));
  return await Promise.all(soils);
};
export const updateSoil = async (id: string, params: SoilParams) => {
  return await db.$transaction(async (ctx) => {
    const { moisture: moistureParam, ...others } = params;
    const soil = await ctx.soil.update({
      where: { id },
      data: {
        ...others,
      },
    });
    const moisture = await ctx.intUnit.update({
      where: {
        id: soil.moistureId,
      },
      data: {
        ...moistureParam,
      },
    });
    return soil;
  });
};
export const deleteSoil = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const soil = await ctx.soil.delete({
      where: { id },
    });
    const moisture = await ctx.intUnit.delete({
      where: {
        id: soil.moistureId,
      },
    });
    return soil;
  });
};
export const confirmSoil = async (
  id: string,
  params: {
    confirmed: boolean;
    confirmedAt: Date;
    confirmedById: string;
  }
) => {
  const soil = await db.soil.update({
    where: { id },
    data: {
      ...params,
    },
  });
  return soil;
};

type SoilQuery = {
  fieldId: string;
  page?: number;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
  begin?: Date;
  end?: Date;
};
export const getSoilsOnField = async ({
  fieldId,
  begin,
  end,
  filterNumber,
  filterString,
  orderBy,
  page = 1,
}: SoilQuery): Promise<PaginatedResponse<SoilTable>> => {
  try {
    const soils = await db.soil.findMany({
      where: {
        fieldId,
        createdAt: {
          ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
          ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
        },
        ...(filterString && getObjectFilterString(filterString)),
        ...(filterNumber && getObjectFilterNumber(filterNumber)),
      },
      orderBy: {
        ...(orderBy && getObjectSortOrder(orderBy)),
      },
      include: {
        confirmedBy: true,
        moisture: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        nutrientUnit: {
          select: {
            name: true,
          },
        },
      },
      take: LIMIT,
      skip: (page - 1) * LIMIT,
    });
    const totalPage = Math.ceil(soils.length / LIMIT);
    return {
      data: soils,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};
export const getSoilById = async (id: string) => {
  try {
    return await db.soil.findMany({ where: { id } });
  } catch (error) {
    return null;
  }
};

export const getSoilUnitForGenerateSoil = async () => {
  return await db.$transaction(async (ctx) => {
    const moistureUnit = await ctx.unit.findFirst({
      where: {
        type: "PERCENT",
      },
      select: {
        id: true,
      },
    });
    const nutrientUnit = await ctx.unit.findFirst({
      where: {
        type: "NUTRIENT",
      },
      select: {
        id: true,
      },
    });
    const soilUnits = {
      moistureUnitId: moistureUnit?.id,
      nutrientUnitId: nutrientUnit?.id,
    };
    return soilUnits;
  });
};
