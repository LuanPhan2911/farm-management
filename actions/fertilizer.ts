"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { FertilizerSchema } from "@/schemas";
import {
  createFertilizer,
  deleteFertilizer,
  updateFertilizer,
} from "@/services/fertilizers";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof FertilizerSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("fertilizers.schema");
  const tStatus = await getTranslations("fertilizers.status");
  const paramsSchema = FertilizerSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const fertilizer = await createFertilizer(validatedFields.data);

    revalidatePath(`/admin/fertilizers`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof FertilizerSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("fertilizers.schema");
  const tStatus = await getTranslations("fertilizers.status");
  const paramsSchema = FertilizerSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const fertilizer = await updateFertilizer(id, validatedFields.data);

    revalidatePath(`/admin/fertilizers`);

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("fertilizers.status");
  try {
    const fertilizer = await deleteFertilizer(id);

    revalidatePath(`/admin/fertilizers`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
