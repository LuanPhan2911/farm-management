"use server";

import { db } from "@/lib/db";
import { CategorySchema } from "@/schemas";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";
import { getCategoryBySlug } from "@/services/categories";

export const create = async (
  values: z.infer<ReturnType<typeof CategorySchema>>
) => {
  const tSchema = await getTranslations("categories.schema");
  const tStatus = await getTranslations("categories.status");
  const paramsSchema = CategorySchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(tSchema("errors.parse"));
  }
  try {
    let slug = slugify(validatedFields.data.name, {
      lower: true,
    });
    const existingCategorySlug = await getCategoryBySlug(slug);
    if (existingCategorySlug) {
      slug = slugify(
        `${validatedFields.data.name}-${Math.floor(Math.random() * 1000)}`,
        { lower: true }
      );
    }
    const category = await db.category.create({
      data: {
        ...validatedFields.data,
        slug,
      },
    });
    revalidatePath("/dashboard/categories");
    return { message: tStatus("success.create") };
  } catch (error) {
    throw new Error(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof CategorySchema>>,
  id: string
) => {
  const tSchema = await getTranslations("categories.schema");
  const tStatus = await getTranslations("categories.status");
  const paramsSchema = CategorySchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(tSchema("errors.parse"));
  }
  try {
    let slug = slugify(validatedFields.data.name, {
      lower: true,
    });
    const existingCategorySlug = await getCategoryBySlug(slug);

    if (existingCategorySlug && id !== existingCategorySlug.id) {
      slug = slugify(
        `${validatedFields.data.name}-${Math.floor(Math.random() * 1000)}`,
        {
          lower: true,
        }
      );
    }
    const category = await db.category.update({
      where: {
        id,
      },
      data: {
        ...validatedFields.data,
        slug,
      },
    });
    revalidatePath("/dashboard/categories");
    return { message: tStatus("success.edit") };
  } catch (error) {
    throw new Error(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string) => {
  const tStatus = await getTranslations("categories.status");
  try {
    const category = await db.category.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/categories");
    return { message: tStatus("success.destroy") };
  } catch (error) {
    throw new Error(tStatus("failure.destroy"));
  }
};
export const deleteMany = async (ids: string[]) => {
  const tStatus = await getTranslations("categories.status");
  try {
    const categories = await db.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    revalidatePath("/dashboard/categories");
    return { message: tStatus("success.destroy") };
  } catch (error) {
    throw new Error(tStatus("failure.destroy"));
  }
};
