"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { SoilSchema } from "@/schemas";
import { currentStaff } from "@/services/staffs";

import {
  confirmSoil,
  createSoil,
  deleteSoil,
  updateSoil,
} from "@/services/soils";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof SoilSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("soils.schema");
  const tStatus = await getTranslations("soils.status");
  const paramsSchema = SoilSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const soil = await createSoil(validatedFields.data);

    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof SoilSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("soils.schema");
  const tStatus = await getTranslations("soils.status");
  const paramsSchema = SoilSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const soil = await updateSoil(id, validatedFields.data);

    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const editConfirmed = async (id: string) => {
  const tStatus = await getTranslations("soils.status");
  const tSchema = await getTranslations("soils.schema");

  try {
    const staff = await currentStaff();
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const soil = await confirmSoil(id, {
      confirmed: true,
      confirmedAt: new Date(),
      confirmedById: staff.id,
    });
    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.editConfirmed"));
  } catch (error) {
    return errorResponse(tStatus("failure.editConfirmed"));
  }
};
export const destroy = async (id: string) => {
  const tStatus = await getTranslations("soils.status");
  try {
    const soil = await deleteSoil(id);
    revalidatePath(`/admin/fields/detail/${soil.fieldId}/soils`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
