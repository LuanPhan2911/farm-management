import { db } from "@/lib/db";
import { FieldSelect } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";
import { SoilType } from "@prisma/client";
import { getCurrentStaff } from "./staffs";

type FieldParams = {
  name: string;
  location?: string | null;
  orgId?: string | null;
  height?: number | null;
  width?: number | null;
  area?: number | null;
  unitId?: string | null;
  shape?: string | null;
  soilType?: SoilType | null;
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

export const updateFieldOrgWhenOrgDeleted = async (orgId: string) => {
  return await db.field.updateMany({
    where: {
      orgId,
    },
    data: {
      orgId: null,
    },
  });
};
export const deleteField = async (id: string) => {
  const field = await db.field.delete({
    where: { id },
  });
  return field;
};

type FieldQuery = {
  orgId: string | null;
};
export const getFields = async ({ orgId }: FieldQuery) => {
  try {
    // check user in org
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      return [];
    }

    if (orgId === null && currentStaff.role !== "superadmin") {
      return [];
    }
    if (orgId !== null && currentStaff.role !== "superadmin") {
      const { data } =
        await clerkClient().organizations.getOrganizationMembershipList({
          organizationId: orgId,
          limit: 100,
        });
      const currentStaffInOrg = data.find(
        (item) => item.publicUserData?.userId === currentStaff.externalId
      );
      if (!currentStaffInOrg) {
        return [];
      }
    }

    //if is superadmin return field with null orgId

    // if admin, farmer return field just field on org
    const fields = await db.field.findMany({
      where: {
        orgId,
      },
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
export const getFieldsSelect = async (): Promise<FieldSelect[]> => {
  try {
    const fields = await db.field.findMany({
      select: {
        id: true,
        name: true,
        location: true,
      },
    });
    return fields;
  } catch (error) {
    return [];
  }
};
