import { db } from "@/lib/db";

export const getAll = async () => {
  const units = await db.unit.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return units;
};
