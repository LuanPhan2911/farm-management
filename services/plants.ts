import { db } from "@/lib/db";

import { FertilizerType, Season } from "@prisma/client";
import {
  deleteFloatUnit,
  deleteIntUnit,
  UnitValue,
  upsertFloatUnit,
  upsertIntUnit,
} from "./units";
import { PlantSelect } from "@/types";

type PlantParams = {
  name: string;
  imageUrl?: string;
  categoryId: string;
  growthDuration: number;
  season?: Season;
  idealTemperature?: Partial<UnitValue>;
  idealHumidity?: Partial<UnitValue>;
  waterRequirement?: Partial<UnitValue>;
  fertilizerType: FertilizerType;
};
export const createPlant = async (params: PlantParams) => {
  return await db.$transaction(async (ctx) => {
    const {
      idealHumidity: idealHumidityParam,
      idealTemperature: idealTemperatureParam,
      waterRequirement: waterRequirementParam,
      ...otherParams
    } = params;
    const idealTemperature = await upsertFloatUnit({
      ctx,
      data: idealTemperatureParam,
    });
    const idealHumidity = await upsertIntUnit({
      ctx,
      data: idealHumidityParam,
    });
    const waterRequirement = await upsertFloatUnit({
      ctx,
      data: waterRequirementParam,
    });

    const plant = await ctx.plant.create({
      data: {
        ...otherParams,
        idealTemperatureId: idealTemperature?.id,
        idealHumidityId: idealHumidity?.id,
        waterRequirementId: waterRequirement?.id,
      },
    });
    return plant;
  });
};
export const updatePlant = async (id: string, params: PlantParams) => {
  return await db.$transaction(async (ctx) => {
    const {
      idealHumidity: idealHumidityParam,
      idealTemperature: idealTemperatureParam,
      waterRequirement: waterRequirementParam,
      ...otherParams
    } = params;
    const plant = await ctx.plant.update({
      where: {
        id,
      },
      data: {
        ...otherParams,
      },
    });
    await upsertFloatUnit({
      ctx,
      data: idealTemperatureParam,
      id: plant.idealTemperatureId,
    });
    await upsertIntUnit({
      ctx,
      data: idealHumidityParam,
      id: plant.idealHumidityId,
    });
    await upsertFloatUnit({
      ctx,
      data: waterRequirementParam,
      id: plant.waterRequirementId,
    });
    return plant;
  });
};
export const deletePlant = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const plant = await ctx.plant.delete({ where: { id } });
    await deleteFloatUnit(ctx, plant.idealTemperatureId);
    await deleteIntUnit(ctx, plant.idealHumidityId);
    await deleteFloatUnit(ctx, plant.waterRequirementId);

    return plant;
  });
};
export const getPlants = async () => {
  try {
    const plants = await db.plant.findMany({
      include: {
        idealTemperature: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        idealHumidity: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        waterRequirement: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
      },
    });
    return plants;
  } catch (error) {
    return [];
  }
};
export const getPlantById = async (id: string) => {
  try {
    const plant = await db.plant.findUnique({
      where: {
        id,
      },
      include: {
        idealTemperature: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        idealHumidity: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        waterRequirement: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
      },
    });

    return plant;
  } catch (error) {
    return null;
  }
};

export const getPlantsSelect = async (): Promise<PlantSelect[]> => {
  try {
    return await db.plant.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    return [];
  }
};
