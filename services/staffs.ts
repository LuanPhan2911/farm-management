import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import { Staff, StaffRole } from "@prisma/client";
import { NextApiRequest } from "next";
import { getOrganizationMembership } from "./organizations";
import { getObjectSortOrder } from "@/lib/utils";
import { PaginatedResponse } from "@/types";
import { checkRole } from "@/lib/role";

type StaffParams = {
  email: string;
  name: string;
  role: StaffRole;
  imageUrl?: string | null;
  baseHourlyWage?: number | null;
  address?: string | null;
  phone?: string | null;
};
export const createStaff = async (externalId: string, params: StaffParams) => {
  const staff = await db.staff.create({
    data: {
      ...params,
      externalId,
    },
  });
  return staff;
};

export const upsertStaff = async (externalId: string, params: StaffParams) => {
  return await db.staff.upsert({
    where: { externalId },
    update: {
      ...params,
    },
    create: {
      ...params,
      externalId,
    },
  });
};
export const updateStaff = async (id: string, params: StaffParams) => {
  const { email, ...other } = params;
  return await db.staff.update({
    where: {
      id,
    },
    data: {
      ...other,
    },
  });
};
export const deleteStaff = async (externalId: string) => {
  const staff = await db.staff.delete({
    where: {
      externalId,
    },
  });
  return staff;
};
export const getStaffByEmail = async (email: string) => {
  return await db.staff.findUnique({
    where: { email },
  });
};
export const getStaffByExternalId = async (externalId: string) => {
  return await db.staff.findUnique({
    where: { externalId },
  });
};

export const getStaffExternalIds = async (): Promise<string[]> => {
  try {
    const staffs = await db.staff.findMany({
      select: {
        externalId: true,
      },
    });
    return staffs.map((staff) => staff.externalId);
  } catch (error) {
    return [];
  }
};

type StaffQuery = {
  page?: number;
  query?: string;
  orderBy?: string;
};
export const getStaffs = async ({
  orderBy,
  page = 1,
  query,
}: StaffQuery): Promise<PaginatedResponse<Staff>> => {
  try {
    const [data, count] = await db.$transaction([
      db.staff.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          ...(query && {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }),
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
      }),
      db.staff.count({
        where: {
          ...(query && {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }),
        },
      }),
    ]);

    const totalPage = Math.ceil(count / LIMIT);
    return {
      data,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

type StaffSelectQuery = {
  adminOnly?: boolean;
  farmerOnly?: boolean;
  orgId?: string | null;
  superAdminOnly?: boolean;
};
export const getStaffsSelect = async (params?: StaffSelectQuery) => {
  try {
    let staffExternalIds;
    const isSuperAdmin = checkRole("superadmin");
    if (!isSuperAdmin && !params?.orgId) {
      throw new Error("Only SuperAdmin get staff without org id");
    }
    if (params?.orgId) {
      const staffInOrg = await getOrganizationMembership({
        orgId: params.orgId,
      });

      staffExternalIds = staffInOrg
        .map((item) => item.publicUserData?.userId)
        .filter((item) => item !== undefined);
    }

    const staffs = await db.staff.findMany({
      where: {
        ...(staffExternalIds && {
          externalId: {
            in: staffExternalIds,
          },
        }),
        ...(params?.adminOnly && {
          role: {
            in: ["superadmin", "admin"],
          },
        }),
        ...(params?.farmerOnly && {
          role: "farmer",
        }),
        ...(params?.superAdminOnly && {
          role: "superadmin",
        }),
      },
    });
    return staffs;
  } catch (error) {
    return [];
  }
};

export const getStaffById = async (id: string) => {
  return await db.staff.findUnique({
    where: { id },
    cacheStrategy: {
      swr: 60,
      ttl: 60,
    },
  });
};
export const getCurrentStaff = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const staff = await db.staff.findUnique({
    where: {
      externalId: user.id,
    },
    cacheStrategy: {
      swr: 60,
      ttl: 60,
    },
  });

  return staff;
};
export const getCurrentStaffPages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }
  const staff = await db.staff.findUnique({
    where: {
      externalId: userId,
    },
    cacheStrategy: {
      swr: 60,
      ttl: 60,
    },
  });

  return staff;
};
