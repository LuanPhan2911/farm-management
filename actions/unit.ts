"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { UnitSchema } from "@/schemas";
import {
  createUnit,
  deleteManyUnit,
  deleteUnit,
  updateUnit,
} from "@/services/units";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof UnitSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("units.schema");
  const tStatus = await getTranslations("units.status");
  const paramsSchema = UnitSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const unit = await createUnit({ ...validatedFields.data });
    if (!unit) {
      return errorResponse("failure.create");
    }
    revalidatePath("/admin/units");
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof UnitSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("units.schema");
  const tStatus = await getTranslations("units.status");
  const paramsSchema = UnitSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const unit = await updateUnit(id, { ...validatedFields.data });
    if (!unit) {
      return errorResponse(tStatus("failure.edit"));
    }
    revalidatePath("/admin/units");
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("units.status");
  try {
    const unit = await deleteUnit(id);
    if (!unit) {
      return errorResponse(tStatus("failure.destroy"));
    }
    revalidatePath("/admin/units");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
export const destroyMany = async (ids: string[]): Promise<ActionResponse> => {
  const tStatus = await getTranslations("units.status");
  try {
    const count = await deleteManyUnit(ids);
    if (!count) {
      return errorResponse(tStatus("failure.destroy"));
    }
    revalidatePath("/admin/units");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
