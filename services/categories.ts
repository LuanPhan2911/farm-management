import { db } from "@/lib/db";
import { CategoryType } from "@prisma/client";
type CategoryParams = {
  name: string;
  slug: string;
  description?: string | null;
  type?: CategoryType | null;
};
export const createCategory = async (params: CategoryParams) => {
  return await db.category.create({
    data: {
      ...params,
    },
  });
};
export const updateCategory = async (id: string, params: CategoryParams) => {
  return await db.category.update({
    data: {
      ...params,
    },
    where: { id },
  });
};
export const deleteCategory = async (id: string) => {
  return await db.category.delete({ where: { id } });
};
export const deleteManyCategory = async (ids: string[]) => {
  return await db.category.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
export const getCategoriesTable = async () => {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    return [];
  }
};
export const getCategoryBySlug = async (slug: string) => {
  try {
    const category = await db.category.findUnique({
      where: {
        slug,
      },
    });
    return category;
  } catch (error) {
    return null;
  }
};
export const getCategoryById = async (id: string) => {
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });
    return category;
  } catch (error) {
    return null;
  }
};
export const getCategoriesByType = async (type: CategoryType) => {
  try {
    return await db.category.findMany({
      where: {
        type,
      },
      select: {
        name: true,
        id: true,
      },
    });
  } catch (error) {
    return [];
  }
};
