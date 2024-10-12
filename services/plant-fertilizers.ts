import { db } from "@/lib/db";
import { UnitValue, upsertFloatUnit } from "./units";
import { PlantFertilizerTable } from "@/types";

type PlantFertilizerParam = {
  plantId: string;
  fertilizerId: string;
  stage: string;
  dosage?: Partial<UnitValue> | null;
  note?: string | null;
};

export const createPlantFertilizer = async (params: PlantFertilizerParam) => {
  const { dosage: dosageParam, ...other } = params;

  return await db.$transaction(async (ctx) => {
    const dosage = await upsertFloatUnit({ ctx, data: dosageParam });
    const plantFertilizer = await ctx.plantFertilizer.create({
      data: {
        ...other,
        dosageId: dosage?.id,
      },
    });
    return plantFertilizer;
  });
};
export const updatePlantFertilizer = async (
  id: string,
  params: PlantFertilizerParam
) => {
  const { dosage: dosageParam, ...other } = params;

  return await db.$transaction(async (ctx) => {
    const plantFertilizer = await ctx.plantFertilizer.update({
      data: {
        ...other,
      },
      where: { id },
    });
    const dosage = await upsertFloatUnit({
      ctx,
      data: dosageParam,
      id: plantFertilizer.dosageId,
    });
    return plantFertilizer;
  });
};

export const deletePlantFertilizer = async (id: string) => {
  return await db.plantFertilizer.delete({ where: { id } });
};

type PlantFertilizerQuery = {
  plantId: string;
};
export const getPlantFertilizers = async ({
  plantId,
}: PlantFertilizerQuery): Promise<PlantFertilizerTable[]> => {
  try {
    return await db.plantFertilizer.findMany({
      where: {
        plantId,
      },
      include: {
        fertilizer: {
          select: {
            name: true,

            type: true,
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
        },
        dosage: {
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
