"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { CropSchema } from "@/schemas";
import { createCrop, deleteCrop, updateCrop } from "@/services/crops";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof CropSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("crops.schema");
  const tStatus = await getTranslations("crops.status");
  const paramsSchema = CropSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const crop = await createCrop(validatedFields.data);

    revalidatePath(`/admin/crops`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof CropSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("crops.schema");
  const tStatus = await getTranslations("crops.status");
  const paramsSchema = CropSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const crop = await updateCrop(id, validatedFields.data);

    revalidatePath(`/admin/crops`);

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("crops.status");
  try {
    const crop = await deleteCrop(id);

    revalidatePath(`/admin/crops`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
