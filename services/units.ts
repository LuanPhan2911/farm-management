import { db, PrismaTransactionalClient } from "@/lib/db";
import { UnitSelect, UnitTable, UnitUnusedCount } from "@/types";
import { FloatUnit, IntUnit, UnitType } from "@prisma/client";

type UnitParams = {
  name: string;
  description?: string | null;
  type?: UnitType | null;
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
export const getUnitsTable = async (): Promise<UnitTable[]> => {
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

export const getUnitsByType = async (type: UnitType): Promise<UnitSelect[]> => {
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

export type UnitValue = {
  unitId?: string | null;
  value?: number | null;
};

export const deleteFloatUnit = async (
  ctx: PrismaTransactionalClient,
  id: string | null | undefined
) => {
  if (!id) {
    return null;
  }
  return await ctx.floatUnit.delete({ where: { id } });
};
export const deleteManyFloatUnit = async (
  ctx: PrismaTransactionalClient,
  ids: (string | null)[] | null | undefined
) => {
  if (!ids?.length) {
    return null;
  }
  return await ctx.floatUnit.deleteMany({
    where: {
      id: {
        in: ids.filter((id) => id !== null),
      },
    },
  });
};
export const upsertFloatUnit = async ({
  ctx,
  data,
  id,
}: {
  ctx: PrismaTransactionalClient;
  id?: string | null | undefined;
  data?: Partial<UnitValue> | null;
}): Promise<FloatUnit | null> => {
  if (!id) {
    return await ctx.floatUnit.create({
      data: {
        value: data?.value,
        unitId: data?.unitId,
      },
    });
  } else {
    return await ctx.floatUnit.update({
      where: { id },
      data: {
        value: data?.value,
        unitId: data?.unitId,
      },
    });
  }
};

export const deleteIntUnit = async (
  ctx: PrismaTransactionalClient,
  id: string | null | undefined
) => {
  if (!id) {
    return null;
  }
  return await ctx.intUnit.delete({ where: { id } });
};
export const deleteManyIntUnit = async (
  ctx: PrismaTransactionalClient,
  ids: (string | null)[] | null | undefined
) => {
  if (!ids?.length) {
    return null;
  }
  return await ctx.intUnit.deleteMany({
    where: {
      id: {
        in: ids.filter((id) => id !== null),
      },
    },
  });
};
export const upsertIntUnit = async ({
  ctx,
  data,
  id,
}: {
  ctx: PrismaTransactionalClient;
  id?: string | null | undefined;
  data?: Partial<UnitValue> | null;
}): Promise<IntUnit | null> => {
  if (!id) {
    return await ctx.intUnit.create({
      data: {
        value: data?.value,
        unitId: data?.unitId,
      },
    });
  } else {
    return await ctx.intUnit.update({
      where: { id },
      data: {
        value: data?.value,
        unitId: data?.unitId,
      },
    });
  }
};
const floatUnitRelations = {
  temperatures: { none: {} },
  atmosphericPressures: { none: {} },
  idealTemperatures: { none: {} },
  waterRequirements: { none: {} },
  fertilizerDosages: { none: {} },
  pesticideDosages: { none: {} },
  purchasePrices: { none: {} },
  estimatedYields: { none: {} },
  actualYields: { none: {} },
};
const intUnitRelations = {
  humidities: { none: {} },
  idealHumidities: { none: {} },
  moistures: { none: {} },
  rainfalls: { none: {} },
  withdrawalPeriods: { none: {} },
};
export const deleteUnusedFloatUnits = async () => {
  // Find all FloatUnits that are not referenced by any of the relations
  const unusedFloatUnits = await db.floatUnit.findMany({
    where: {
      // Check for absence of relations
      ...floatUnitRelations,
    },
  });

  // Delete the unused FloatUnits
  const deletePromises = unusedFloatUnits.map((floatUnit) =>
    db.floatUnit.delete({
      where: {
        id: floatUnit.id,
      },
    })
  );

  await Promise.all(deletePromises);
};

export const deleteUnusedIntegerUnits = async () => {
  const unusedIntUnits = await db.intUnit.findMany({
    where: {
      ...intUnitRelations,
    },
  });
  const deletePromises = unusedIntUnits.map((intUnit) => {
    return db.intUnit.delete({
      where: { id: intUnit.id },
    });
  });
  await Promise.all(deletePromises);
};

export const getCountUnusedUnit = async (): Promise<UnitUnusedCount> => {
  try {
    const floatUnitCount = await db.floatUnit.count({
      where: {
        ...floatUnitRelations,
      },
    });
    const intUnitCount = await db.intUnit.count({
      where: {
        ...intUnitRelations,
      },
    });
    return {
      floatUnit: floatUnitCount,
      intUnit: intUnitCount,
    };
  } catch (error) {
    return {
      floatUnit: 0,
      intUnit: 0,
    };
  }
};
