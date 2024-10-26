"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { PlantPesticideSchema } from "@/schemas";
import {
  createPlantPesticide,
  deletePlantPesticide,
  updatePlantPesticide,
} from "@/services/plant-pesticides";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof PlantPesticideSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("plantPesticides.schema");
  const tStatus = await getTranslations("plantPesticides.status");
  const paramsSchema = PlantPesticideSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const plantPesticide = await createPlantPesticide({
      ...validatedFields.data,
    });

    revalidatePath(`/admin/plants/detail/${plantPesticide.plantId}/pesticides`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof PlantPesticideSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("plantPesticides.schema");
  const tStatus = await getTranslations("plantPesticides.status");
  const paramsSchema = PlantPesticideSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const plantPesticide = await updatePlantPesticide(id, {
      ...validatedFields.data,
    });
    revalidatePath(`/admin/plants/detail/${plantPesticide.plantId}/pesticides`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("plantPesticides.status");
  try {
    const plantPesticide = await deletePlantPesticide(id);
    revalidatePath(`/admin/plants/detail/${plantPesticide.plantId}/pesticides`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
