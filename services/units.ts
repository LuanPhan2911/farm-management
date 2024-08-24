import { db } from "@/lib/db";

export const createUnit = async (params: {
  name: string;
  description: string;
}) => {
  try {
    return await db.unit.create({
      data: {
        ...params,
      },
    });
  } catch (error) {
    return null;
  }
};

export const updateUnit = async (
  id: string,
  params: {
    name: string;
    description: string;
  }
) => {
  try {
    return await db.unit.update({
      where: {
        id,
      },
      data: {
        ...params,
      },
    });
  } catch (error) {
    return null;
  }
};
export const getUnitsTable = async () => {
  try {
    const units = await db.unit.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return units;
  } catch (error) {
    return [];
  }
};

export const deleteUnit = async (id: string) => {
  try {
    return await db.unit.delete({
      where: { id },
    });
  } catch (error) {
    return null;
  }
};
export const deleteManyUnit = async (ids: string[]) => {
  try {
    const { count } = await db.unit.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return count;
  } catch (error) {
    return 0;
  }
};
