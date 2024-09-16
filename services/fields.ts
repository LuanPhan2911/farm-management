import { db } from "@/lib/db";
import { SoilType } from "@prisma/client";

type FieldParams = {
  name: string;
  location: string;
  orgId: string;
  height: number;
  width: number;
  area: number;
  unitId: string;
  shape?: string;
  soilType?: SoilType;
};
export const createField = async (params: FieldParams) => {
  const field = await db.field.create({
    data: {
      ...params,
    },
  });
  return field;
};

export const updateField = async (id: string, params: FieldParams) => {
  const field = await db.field.update({
    where: {
      id,
    },
    data: {
      ...params,
    },
  });
  return field;
};
export const deleteField = async (id: string) => {
  const field = await db.field.delete({
    where: { id },
  });
  return field;
};
export const getFields = async () => {
  try {
    const fields = await db.field.findMany({
      include: {
        unit: true,
      },
    });
    return fields;
  } catch (error) {
    return [];
  }
};

export const getFieldById = async (id: string) => {
  try {
    const field = await db.field.findUnique({
      where: { id },
      include: {
        unit: true,
      },
    });
    return field;
  } catch (error) {
    return null;
  }
};
export const getFieldIds = async () => {
  try {
    const fields = await db.field.findMany({
      select: {
        id: true,
      },
    });
    return fields.map((field) => field.id);
  } catch (error) {
    return [];
  }
};
export const getFieldByOrgId = async (orgId: string) => {
  try {
    const field = await db.field.findUnique({
      where: { orgId },
    });
  } catch (error) {
    return null;
  }
};
