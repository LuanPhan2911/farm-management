import { db, PrismaTransactionalClient } from "@/lib/db";
import { FloatUnit, IntUnit, Prisma, UnitType } from "@prisma/client";

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

export type UnitValue = {
  unitId: string;
  value: number;
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
  data?: Partial<UnitValue>;
}): Promise<FloatUnit | null> => {
  if (!data || data.unitId === undefined || data.value === undefined) {
    return null;
  }
  if (!id) {
    return await ctx.floatUnit.create({
      data: {
        value: data.value,
        unitId: data.unitId,
      },
    });
  } else {
    return await ctx.floatUnit.update({
      where: { id },
      data,
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
  data?: Partial<UnitValue>;
}): Promise<IntUnit | null> => {
  if (!data || data.unitId === undefined || data.value === undefined) {
    return null;
  }
  if (!id) {
    return await ctx.intUnit.create({
      data: {
        value: data.value,
        unitId: data.unitId,
      },
    });
  } else {
    return await ctx.intUnit.update({
      where: { id },
      data,
    });
  }
};
