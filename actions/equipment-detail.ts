"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { EquipmentDetailSchema } from "@/schemas";
import {
  createEquipmentDetail,
  deleteEquipmentDetail,
  updateEquipmentDetail,
} from "@/services/equipment-details";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof EquipmentDetailSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("equipmentDetails.schema");
  const tStatus = await getTranslations("equipmentDetails.status");
  const paramsSchema = EquipmentDetailSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const equipmentDetails = await createEquipmentDetail(validatedFields.data);

    revalidatePath(`/admin/equipments/detail/${equipmentDetails.equipmentId}`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof EquipmentDetailSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("equipmentDetails.schema");
  const tStatus = await getTranslations("equipmentDetails.status");
  const paramsSchema = EquipmentDetailSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const equipmentDetails = await updateEquipmentDetail(
      id,
      validatedFields.data
    );

    revalidatePath(`/admin/equipments/detail/${equipmentDetails.equipmentId}`);

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("equipmentDetails.status");
  try {
    const equipmentDetails = await deleteEquipmentDetail(id);

    revalidatePath(`/admin/equipments/detail/${equipmentDetails.equipmentId}`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
