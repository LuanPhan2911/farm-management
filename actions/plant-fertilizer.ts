"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { PlantFertilizerSchema } from "@/schemas";
import {
  createPlantFertilizer,
  deletePlantFertilizer,
  updatePlantFertilizer,
} from "@/services/plant-fertilizers";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof PlantFertilizerSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("plantFertilizers.schema");
  const tStatus = await getTranslations("plantFertilizers.status");
  const paramsSchema = PlantFertilizerSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const plantFertilizer = await createPlantFertilizer({
      ...validatedFields.data,
    });

    revalidatePath(
      `/admin/plants/detail/${plantFertilizer.plantId}/fertilizers`
    );
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof PlantFertilizerSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("plantFertilizers.schema");
  const tStatus = await getTranslations("plantFertilizers.status");
  const paramsSchema = PlantFertilizerSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const plantFertilizer = await updatePlantFertilizer(id, {
      ...validatedFields.data,
    });
    revalidatePath(
      `/admin/plants/detail/${plantFertilizer.plantId}/fertilizers`
    );
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("plantFertilizers.status");
  try {
    const plantFertilizer = await deletePlantFertilizer(id);
    revalidatePath(
      `/admin/plants/detail/${plantFertilizer.plantId}/fertilizers`
    );
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
