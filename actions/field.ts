"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { FieldSchema } from "@/schemas";
import {
  createField,
  deleteField,
  getFieldByOrgId,
  updateField,
} from "@/services/fields";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof FieldSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("fields.schema");
  const tStatus = await getTranslations("fields.status");
  const paramsSchema = FieldSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const { orgId } = validatedFields.data;
    const fieldOrg = await getFieldByOrgId(orgId);
    if (fieldOrg) {
      return errorResponse(tSchema("errors.orgExist"));
    }
    const field = await createField({ ...validatedFields.data });
    revalidatePath("/admin/fields");
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof FieldSchema>>,
  fieldId: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("fields.schema");
  const tStatus = await getTranslations("fields.status");
  const paramsSchema = FieldSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const { orgId } = validatedFields.data;
    const fieldOrg = await getFieldByOrgId(orgId);
    if (fieldOrg && fieldOrg.id !== fieldId) {
      return errorResponse(tSchema("errors.orgExist"));
    }
    const field = await updateField(fieldId, validatedFields.data);
    revalidatePath(`/admin/fields/detail/${field.id}`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("fields.status");
  try {
    const field = await deleteField(id);

    revalidatePath(`/admin/fields/detail/${field.id}`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
