import { db } from "@/lib/db";
import { UnitType } from "@prisma/client";
import { strict } from "assert";

export const createUnit = async (params: {
  name: string;
  description?: string | undefined;
  type?: UnitType | undefined;
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
    description?: string | undefined;
    type?: UnitType | undefined;
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

export const getUnitsSelect = async (type: UnitType) => {
  try {
    const units = await db.unit.findMany({
      where: {
        type,
      },
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

export const createFloatUnit = async (params: {
  unitId: string;
  value: number;
}) => {
  return await db.floatUnit.create({
    data: {
      ...params,
    },
  });
};
export const deleteFloatUnit = async (id: string) => {
  return await db.floatUnit.delete({ where: { id } });
};
export const updateFloatUnit = async (
  id: string,
  params: {
    value: number;
    unitId: string;
  }
) => {
  return await db.floatUnit.update({
    where: { id },
    data: {
      ...params,
    },
  });
};
export const createIntegerUnit = async (params: {
  value: number;
  unitId: string;
}) => {
  return await db.intUnit.create({
    data: {
      ...params,
    },
  });
};
export const deleteIntegerUnit = async (id: string) => {
  return await db.intUnit.delete({ where: { id } });
};
export const updateIntegerUnit = async (
  id: string,
  params: {
    value: number;
    unitId: string;
  }
) => {
  return await db.intUnit.update({
    where: { id },
    data: {
      ...params,
    },
  });
};
