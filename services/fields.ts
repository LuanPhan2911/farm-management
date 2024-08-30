import { db } from "@/lib/db";

export const createField = async (params: {
  name: string;
  location: string;
  orgId: string;
  height: number;
  width: number;
  area: number;
  unitId: string;
  shape?: string;
}) => {
  const field = await db.field.create({
    data: {
      ...params,
    },
  });
  return field;
};

export const updateField = async (
  id: string,
  params: {
    name: string;
    location: string;
    orgId: string;
    height: number;
    width: number;
    area: number;
    unitId: string;
    shape?: string;
  }
) => {
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

export const getFieldByOrganizationId = async (orgId: string) => {
  try {
    const field = await db.field.findUnique({ where: { orgId } });
    return field;
  } catch (error) {
    return null;
  }
};
