import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import {
  chunkArray,
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import { PaginatedResponse, SoilChart, SoilTable } from "@/types";
import { deleteIntUnit, UnitValue, upsertIntUnit } from "./units";

type SoilParams = {
  ph?: number;
  moisture?: Partial<UnitValue>;
  nutrientNitrogen?: number;
  nutrientPhosphorus?: number;
  nutrientPotassium?: number;
  nutrientUnitId?: string;
  createdAt?: Date;
  note?: string;
  fieldId: string;
};

export const createSoil = async (params: SoilParams) => {
  return await db.$transaction(async (ctx) => {
    const { moisture: moistureParam, ...others } = params;
    const moisture = await upsertIntUnit({
      ctx,
      data: moistureParam,
    });

    const soil = await ctx.soil.create({
      data: {
        ...others,
        moistureId: moisture?.id,
      },
    });
    return soil;
  });
};
export const createManySoil = async (soilDataArray: SoilParams[]) => {
  return Promise.all(
    soilDataArray.map(async (soilData) => {
      const { moisture: moistureParam, ...others } = soilData;
      try {
        return db.$transaction(async (ctx) => {
          const moisture = await upsertIntUnit({
            ctx,
            data: moistureParam,
          });

          const soil = await ctx.soil.create({
            data: {
              ...others,
              moistureId: moisture?.id,
            },
          });
          return soil;
        });
      } catch (error) {
        return null;
      }
    })
  );
};

export const createManySoilInChunk = async (
  soilDataArray: SoilParams[],
  chunkSize = 10
) => {
  const chunks = chunkArray(soilDataArray, chunkSize);

  for (const chunk of chunks) {
    await createManySoil(chunk);
  }
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
    const moisture = await upsertIntUnit({
      ctx,
      data: moistureParam,
      id: soil.moistureId,
    });
    return soil;
  });
};
type SoilConfirm = {
  confirmed: boolean;
  confirmedAt: Date;
  confirmedById: string;
};
export const updateSoilConfirmed = async (id: string, params: SoilConfirm) => {
  const soil = await db.soil.update({
    where: { id },
    data: {
      ...params,
    },
  });
  return soil;
};
export const updateManySoilConfirmed = async (params: SoilConfirm) => {
  const soils = await db.soil.updateMany({
    where: {
      confirmed: false,
    },
    data: {
      ...params,
    },
  });
  return soils;
};

export const updateSoilPinned = async (id: string, pinned: boolean) => {
  return await db.soil.update({
    where: { id },
    data: {
      pinned,
    },
  });
};
export const deleteSoil = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const soil = await ctx.soil.delete({
      where: { id },
    });
    const moisture = await deleteIntUnit(ctx, soil.moistureId);
    return soil;
  });
};
export const deleteManySoilUnconfirmed = async () => {
  const { count } = await db.soil.deleteMany({
    where: {
      confirmed: false,
    },
  });
  // TODO: after clear unit value no usage
  return count;
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
    const [soils, count] = await db.$transaction([
      db.soil.findMany({
        where: {
          fieldId,
          createdAt: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
        orderBy: [
          {
            pinned: "desc",
          },
          {
            confirmed: "asc",
          },
          {
            ...(orderBy && getObjectSortOrder(orderBy)),
          },
        ],
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
      }),
      db.soil.count({
        where: {
          fieldId,
          createdAt: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
      }),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
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

export const getSoilsForChart = async ({
  fieldId,
  begin,
  end,
}: SoilQuery): Promise<SoilChart[]> => {
  try {
    return await db.soil.findMany({
      where: {
        fieldId,
        confirmed: true,
        createdAt: {
          ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
          ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        createdAt: true,
        confirmedAt: true,
        nutrientNitrogen: true,
        nutrientPhosphorus: true,
        nutrientPotassium: true,
        ph: true,
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
    });
  } catch (error) {
    return [];
  }
};

export const getSoilsForExport = async (fieldId: string) => {
  try {
    return await db.soil.findMany({
      where: {
        fieldId,
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
    });
  } catch (error) {
    return [];
  }
};
