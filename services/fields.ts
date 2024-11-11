import { db } from "@/lib/db";
import { FieldSelect, FieldTable } from "@/types";
import { SoilType } from "@prisma/client";
import { getCurrentStaff } from "./staffs";
import { isAdmin, isFarmer, isOnlyAdmin, isSuperAdmin } from "@/lib/permission";
import { getUserInOrganization } from "./organizations";
import { unitInclude, unitSelect } from "./units";
import { auth } from "@clerk/nextjs/server";

type FieldParams = {
  name: string;
  location?: string | null;
  orgId?: string | null;
  area?: number | null;
  unitId?: string | null;
  shape?: string | null;
  soilType?: SoilType | null;
  note?: string | null;
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
// superadmin get all
// admin get in org and null org
// farmer get in org
export const getFields = async ({
  orgId,
}: FieldQuery): Promise<FieldTable[]> => {
  try {
    // check user in org
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      return [];
    }
    if (orgId === null && isFarmer(currentStaff.role)) {
      return [];
    }
    if (orgId === null && isSuperAdmin(currentStaff.role)) {
      return await db.field.findMany({
        include: {
          unit: {
            select: {
              ...unitSelect,
            },
          },
        },
        orderBy: [
          {
            orgId: "desc",
          },
        ],
      });
    }
    if (orgId === null && isAdmin(currentStaff.role)) {
      return await db.field.findMany({
        where: {
          orgId: null,
        },
        include: {
          unit: {
            select: {
              ...unitSelect,
            },
          },
        },
      });
    }

    if (
      orgId !== null &&
      (isFarmer(currentStaff.role) || isAdmin(currentStaff.role))
    ) {
      const userInOrg = getUserInOrganization(orgId, currentStaff.externalId);
      if (!userInOrg) {
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
        unit: {
          select: {
            ...unitSelect,
          },
        },
      },
    });
    return fields;
  } catch (error) {
    return [];
  }
};
// superadmin edit
// admin

// field orgid = null just super admin get
export const getFieldById = async (id: string): Promise<FieldTable | null> => {
  try {
    const field = await db.field.findUnique({
      where: { id },
      include: {
        unit: {
          select: {
            ...unitSelect,
          },
        },
      },
    });

    return field;
  } catch (error) {
    return null;
  }
};

export const fieldSelect = {
  id: true,
  name: true,
  location: true,
  area: true,
  orgId: true,
  unit: {
    select: {
      name: true,
    },
  },
};
export const getFieldsSelect = async (): Promise<FieldSelect[]> => {
  try {
    const fields = await db.field.findMany({
      where: {
        orgId: {
          not: null,
        },
      },
      select: {
        ...fieldSelect,
      },
    });
    return fields;
  } catch (error) {
    return [];
  }
};
