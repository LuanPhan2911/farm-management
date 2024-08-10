import { db } from "@/lib/db";

export const getAll = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return categories;
};
export const getBySlug = async (slug: string) => {
  const category = await db.category.findUnique({
    where: {
      slug,
    },
  });
  return category;
};
