import { db } from "@/lib/db";

export const getCategoriesAll = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return categories;
};
export const getCategoryBySlug = async (slug: string) => {
  const category = await db.category.findUnique({
    where: {
      slug,
    },
  });
  return category;
};
export const getCategoryById = async (id: string) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
  });
  return category;
};
