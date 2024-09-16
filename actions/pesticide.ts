"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { PesticideSchema } from "@/schemas";
import {
  createPesticide,
  deletePesticide,
  updatePesticide,
} from "@/services/pesticides";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof PesticideSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("pesticides.schema");
  const tStatus = await getTranslations("pesticides.status");
  const paramsSchema = PesticideSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const pesticide = await createPesticide(validatedFields.data);

    revalidatePath(`/admin/pesticides`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof PesticideSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("pesticides.schema");
  const tStatus = await getTranslations("pesticides.status");
  const paramsSchema = PesticideSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const pesticide = await updatePesticide(id, validatedFields.data);

    revalidatePath(`/admin/pesticides`);

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("pesticides.status");
  try {
    const pesticide = await deletePesticide(id);

    revalidatePath(`/admin/pesticides`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
