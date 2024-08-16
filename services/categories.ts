import { db } from "@/lib/db";

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
