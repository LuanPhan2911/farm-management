import { db } from "@/lib/db";
import { unitInclude, UnitValue, upsertFloatUnit } from "./units";
import { PlantPesticideTable } from "@/types";
import { pesticideSelect } from "./pesticides";

type PlantPesticideParam = {
  plantId: string;
  pesticideId: string;
  stage: string;
  dosage?: Partial<UnitValue> | null;
  note?: string | null;
};

export const createPlantPesticide = async (params: PlantPesticideParam) => {
  const { dosage: dosageParam, ...other } = params;

  return await db.$transaction(async (ctx) => {
    const dosage = await upsertFloatUnit({ ctx, data: dosageParam });
    const plantPesticide = await ctx.plantPesticide.create({
      data: {
        ...other,
        dosageId: dosage?.id,
      },
    });
    return plantPesticide;
  });
};
export const updatePlantPesticide = async (
  id: string,
  params: PlantPesticideParam
) => {
  const { dosage: dosageParam, ...other } = params;

  return await db.$transaction(async (ctx) => {
    const plantPesticide = await ctx.plantPesticide.update({
      data: {
        ...other,
      },
      where: { id },
    });
    const dosage = await upsertFloatUnit({
      ctx,
      data: dosageParam,
      id: plantPesticide.dosageId,
    });
    return plantPesticide;
  });
};

export const deletePlantPesticide = async (id: string) => {
  return await db.plantPesticide.delete({ where: { id } });
};

type PlantPesticideQuery = {
  plantId: string;
};
export const getPlantPesticides = async ({
  plantId,
}: PlantPesticideQuery): Promise<PlantPesticideTable[]> => {
  try {
    return await db.plantPesticide.findMany({
      where: {
        plantId,
      },
      include: {
        pesticide: {
          select: {
            ...pesticideSelect,
          },
        },
        dosage: {
          include: {
            ...unitInclude,
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};
