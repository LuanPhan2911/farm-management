import { db } from "@/lib/db";
import { FieldLocation, FieldSelect, FieldTable } from "@/types";
import { SoilType } from "@prisma/client";
import { isSuperAdmin } from "@/lib/permission";
import {
  getOnlyOrganizations,
  getOrganizationById,
  hasStaffGetDataWithOrgId,
} from "./organizations";
import { unitSelect } from "./units";
import { truncateByDomain } from "recharts/types/util/ChartUtils";
import { cropSelect } from "./crops";
import { plantSelect } from "./plants";
import { getCurrentStaff } from "./staffs";

type FieldParams = {
  name: string;
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

type FieldLocationParams = {
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export const updateFieldLocation = async (
  id: string,
  params: FieldLocationParams
) => {
  return await db.field.update({
    where: { id },
    data: {
      ...params,
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
    const { canAccess, currentStaff } = await hasStaffGetDataWithOrgId(orgId, {
      canAdminGetDataWithNullOrg: true,
    });
    if (!canAccess || !currentStaff) {
      return [];
    }

    //if is superadmin return field with null orgId
    // if admin, farmer return field just field on org

    const organizations = await getOnlyOrganizations();
    const fields = await db.field.findMany({
      where: {
        ...(!isSuperAdmin(currentStaff.role) && {
          orgId,
        }),
      },
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
        {
          createdAt: "desc",
        },
      ],
    });

    const fieldWithOrganization: FieldTable[] = fields.map((field) => {
      return {
        ...field,
        organization:
          structuredClone(
            organizations.find((item) => item.id === field.orgId)
          ) || null,
      };
    });
    return fieldWithOrganization;
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
    if (!field) {
      return null;
    }
    const organization =
      field.orgId !== null ? await getOrganizationById(field.orgId) : null;

    const fieldWithOrg = {
      ...field,
      organization: structuredClone(organization),
    };
    return fieldWithOrg;
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
export const getFieldsSelect = async (
  orgId: string | null
): Promise<FieldSelect[]> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      return [];
    }

    if (!orgId && !isSuperAdmin(currentStaff.role)) {
      throw new Error("No field id to get crops");
    }

    const fields = await db.field.findMany({
      where: {
        ...(!isSuperAdmin(currentStaff.role) && {
          orgId,
        }),
        crops: {
          every: {
            status: "FINISH",
          },
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

export const getFieldLocations = async (): Promise<FieldLocation[]> => {
  try {
    return await db.field.findMany({
      where: {
        NOT: {
          latitude: null,
          longitude: null,
        },
      },
      select: {
        id: true,
        name: true,
        location: true,
        latitude: true,
        longitude: true,
        area: true,
        unit: {
          select: {
            name: true,
          },
        },
        latestCrop: {
          select: {
            ...cropSelect,
            plant: {
              select: {
                ...plantSelect,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};
