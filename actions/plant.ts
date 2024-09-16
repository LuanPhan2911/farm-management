"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { PlantSchema } from "@/schemas";
import { createPlant, deletePlant, updatePlant } from "@/services/plants";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof PlantSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("plants.schema");
  const tStatus = await getTranslations("plants.status");
  const paramsSchema = PlantSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const plant = await createPlant(validatedFields.data);

    revalidatePath(`/admin/plants`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof PlantSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("plants.schema");
  const tStatus = await getTranslations("plants.status");
  const paramsSchema = PlantSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const plant = await updatePlant(id, validatedFields.data);

    revalidatePath(`/admin/plants`);
    revalidatePath(`/admin/plants/detail/${plant.id}`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("plants.status");
  try {
    const plant = await deletePlant(id);

    revalidatePath(`/admin/plants`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
