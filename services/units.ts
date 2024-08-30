import { db } from "@/lib/db";

export const createUnit = async (params: {
  name: string;
  description: string;
}) => {
  return await db.unit.create({
    data: {
      ...params,
    },
  });
};

export const updateUnit = async (
  id: string,
  params: {
    name: string;
    description: string;
  }
) => {
  return await db.unit.update({
    where: {
      id,
    },
    data: {
      ...params,
    },
  });
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
  return await db.unit.delete({
    where: { id },
  });
};
export const deleteManyUnit = async (ids: string[]) => {
  const { count } = await db.unit.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return count;
};

export const getUnitsSelect = async () => {
  try {
    const units = await db.unit.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return units;
  } catch (error) {
    return [];
  }
};
