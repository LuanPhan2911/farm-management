import { db } from "@/lib/db";
import { UnitType } from "@prisma/client";

type UnitParams = {
  name: string;
  description?: string | undefined;
  type?: UnitType | undefined;
};

export const createUnit = async (params: UnitParams) => {
  return await db.unit.create({
    data: {
      ...params,
    },
  });
};

export const updateUnit = async (id: string, params: UnitParams) => {
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

export const getUnitsByType = async (type: UnitType) => {
  try {
    const units = await db.unit.findMany({
      where: {
        type,
      },
      select: {
        id: true,
        name: true,
      },
      cacheStrategy: {
        ttl: 60,
        swr: 60,
      },
    });
    return units;
  } catch (error) {
    return [];
  }
};
