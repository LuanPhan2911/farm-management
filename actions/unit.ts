"use server";

import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/utils";
import { UnitSchema } from "@/schemas";
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
    await db.unit.create({
      data: {
        ...validatedFields.data,
      },
    });
    revalidatePath("/dashboard/units");
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
    await db.unit.update({
      where: {
        id,
      },
      data: {
        ...validatedFields.data,
      },
    });
    revalidatePath("/dashboard/units");
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("units.status");
  try {
    await db.unit.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/units");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
export const destroyMany = async (ids: string[]): Promise<ActionResponse> => {
  const tStatus = await getTranslations("units.status");
  try {
    await db.unit.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    revalidatePath("/dashboard/units");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
