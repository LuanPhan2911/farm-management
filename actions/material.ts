"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { MaterialSchema } from "@/schemas";
import {
  createMaterial,
  deleteMaterial,
  updateMaterial,
} from "@/services/materials";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof MaterialSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("materials.schema");
  const tStatus = await getTranslations("materials.status");
  const paramsSchema = MaterialSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const material = await createMaterial(validatedFields.data);

    revalidatePath(`/admin/materials`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    console.log(error);

    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof MaterialSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("materials.schema");
  const tStatus = await getTranslations("materials.status");
  const paramsSchema = MaterialSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const material = await updateMaterial(id, validatedFields.data);

    revalidatePath(`/admin/materials`);

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("materials.status");
  try {
    const material = await deleteMaterial(id);

    revalidatePath(`/admin/materials`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
