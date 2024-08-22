"use server";

import { db } from "@/lib/db";
import { CategorySchema } from "@/schemas";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";
import { getCategoryBySlug } from "@/services/categories";
import { ActionResponse } from "@/types";
import { errorResponse, successResponse } from "@/lib/utils";

export const create = async (
  values: z.infer<ReturnType<typeof CategorySchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("categories.schema");
  const t = await getTranslations("categories.status");
  const paramsSchema = CategorySchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
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
    await db.category.create({
      data: {
        ...validatedFields.data,
        slug,
      },
    });
    revalidatePath("/dashboard/categories");
    return successResponse(t("success.create"));
  } catch (error) {
    return errorResponse(t("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof CategorySchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("categories.schema");
  const t = await getTranslations("categories.status");
  const paramsSchema = CategorySchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
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
    await db.category.update({
      where: {
        id,
      },
      data: {
        ...validatedFields.data,
        slug,
      },
    });
    revalidatePath("/dashboard/categories");

    return successResponse(t("success.edit"));
  } catch (error) {
    return errorResponse(t("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const t = await getTranslations("categories.status");
  try {
    await db.category.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/categories");
    return successResponse(t("success.destroy"));
  } catch (error) {
    return errorResponse(t("failure.destroy"));
  }
};
export const destroyMany = async (ids: string[]): Promise<ActionResponse> => {
  const t = await getTranslations("categories.status");
  try {
    await db.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    revalidatePath("/dashboard/categories");
    return successResponse(t("success.destroy"));
  } catch (error) {
    return errorResponse(t("failure.destroy"));
  }
};
