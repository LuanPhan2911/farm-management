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
export const createFloatUnit = async (
  ctx: PrismaTransactionalClient,
  data: UnitValue
) => {
  return await ctx.floatUnit.create({ data });
};
export const updateFloatUnit = async (
  ctx: PrismaTransactionalClient,
  id: string,
  data: UnitValue
) => {
  return await ctx.floatUnit.update({
    data,
    where: { id },
  });
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
  ids: string[] | null | undefined
) => {
  if (!ids?.length) {
    return null;
  }
  return await ctx.floatUnit.deleteMany({
    where: {
      id: {
        in: ids,
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
  if (!data || !data.unitId || !data.value) {
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
export const createIntUnit = async (
  ctx: PrismaTransactionalClient,
  data: UnitValue
) => {
  return await ctx.intUnit.create({ data });
};
export const updateIntUnit = async (
  ctx: PrismaTransactionalClient,
  id: string,
  data: UnitValue
) => {
  return await ctx.intUnit.update({
    data,
    where: { id },
  });
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
  ids: string[] | null | undefined
) => {
  if (!ids?.length) {
    return null;
  }
  return await ctx.intUnit.deleteMany({
    where: {
      id: {
        in: ids,
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
  if (!data || !data.unitId || !data.value) {
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
