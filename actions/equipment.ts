"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { EquipmentSchema } from "@/schemas";
import {
  createEquipment,
  deleteEquipment,
  updateEquipment,
} from "@/services/equipments";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof EquipmentSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("equipments.schema");
  const tStatus = await getTranslations("equipments.status");
  const paramsSchema = EquipmentSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const equipment = await createEquipment(validatedFields.data);

    revalidatePath(`/admin/equipments`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof EquipmentSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("equipments.schema");
  const tStatus = await getTranslations("equipments.status");
  const paramsSchema = EquipmentSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const equipment = await updateEquipment(id, validatedFields.data);

    revalidatePath(`/admin/equipments`);

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("equipments.status");
  try {
    const equipment = await deleteEquipment(id);

    revalidatePath(`/admin/equipments`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
