"use server";

import { db } from "@/lib/db";
import { UnitSchema } from "@/schemas";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof UnitSchema>>
) => {
  const tSchema = await getTranslations("units.schema");
  const tStatus = await getTranslations("units.status");
  const paramsSchema = UnitSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(tSchema("errors.parse"));
  }
  try {
    const unit = await db.unit.create({
      data: {
        ...validatedFields.data,
      },
    });
    revalidatePath("/dashboard/units");
    return { message: tStatus("success.create") };
  } catch (error) {
    throw new Error(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof UnitSchema>>,
  id: string
) => {
  const tSchema = await getTranslations("units.schema");
  const tStatus = await getTranslations("units.status");
  const paramsSchema = UnitSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(tSchema("errors.parse"));
  }
  try {
    const unit = await db.unit.update({
      where: {
        id,
      },
      data: {
        ...validatedFields.data,
      },
    });
    revalidatePath("/dashboard/units");
    return { message: tStatus("success.edit") };
  } catch (error) {
    throw new Error(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string) => {
  const tStatus = await getTranslations("units.status");
  try {
    const unit = await db.unit.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/units");
    return { message: tStatus("success.destroy") };
  } catch (error) {
    throw new Error(tStatus("failure.destroy"));
  }
};
export const deleteMany = async (ids: string[]) => {
  const tStatus = await getTranslations("units.status");
  try {
    const units = await db.unit.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    revalidatePath("/dashboard/units");
    return { message: tStatus("success.destroy") };
  } catch (error) {
    throw new Error(tStatus("failure.destroy"));
  }
};
