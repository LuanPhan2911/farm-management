"use server";

import { CategorySchema } from "@/schemas";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";
import {
  createCategory,
  deleteCategory,
  deleteManyCategory,
  getCategoryBySlug,
  updateCategory,
} from "@/services/categories";
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
    let { slug, name, description, type } = validatedFields.data;
    const existingCategorySlug = await getCategoryBySlug(slug);
    if (existingCategorySlug) {
      slug = slugify(
        `${validatedFields.data.name}-${Math.floor(Math.random() * 1000)}`,
        { lower: true }
      );
    }
    await createCategory({
      name,
      description,
      type,
      slug,
    });
    revalidatePath("/admin/categories");
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
    let { slug, name, description, type } = validatedFields.data;
    const existingCategorySlug = await getCategoryBySlug(slug);

    if (existingCategorySlug && id !== existingCategorySlug.id) {
      slug = slugify(
        `${validatedFields.data.name}-${Math.floor(Math.random() * 1000)}`,
        {
          lower: true,
        }
      );
    }
    await updateCategory(id, { name, slug, description, type });
    revalidatePath("/admin/categories");

    return successResponse(t("success.edit"));
  } catch (error) {
    return errorResponse(t("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const t = await getTranslations("categories.status");
  try {
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    return successResponse(t("success.destroy"));
  } catch (error) {
    return errorResponse(t("failure.destroy"));
  }
};
export const destroyMany = async (ids: string[]): Promise<ActionResponse> => {
  const t = await getTranslations("categories.status");
  try {
    await deleteManyCategory(ids);
    revalidatePath("/admin/categories");
    return successResponse(t("success.destroy"));
  } catch (error) {
    return errorResponse(t("failure.destroy"));
  }
};
