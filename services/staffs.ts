import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { clerkClient, currentUser, getAuth } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";
import { UserOrderBy } from "./users";
import { NextApiRequest } from "next";
import { getOrganizationMembership } from "./organizations";

type StaffParams = {
  email: string;
  name: string;
  role: StaffRole;
  imageUrl?: string | null;
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
export const updateStaff = async (
  externalId: string,
  params: {
    name: string;
    imageUrl?: string | null;
  }
) => {
  return await db.staff.update({
    where: {
      externalId,
    },
    data: {
      ...params,
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

export const getStaffsTable = async ({
  query,
  currentPage,
  orderBy,
}: {
  query?: string;
  currentPage: number;
  orderBy?: UserOrderBy;
}) => {
  try {
    const staffIds = await getStaffExternalIds();

    const { data, totalCount } = await clerkClient().users.getUserList({
      limit: LIMIT,
      offset: (currentPage - 1) * LIMIT,
      query,
      userId: staffIds.map((id) => `+${id}`),
      orderBy,
    });

    const totalPage = Math.ceil(totalCount / LIMIT);
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
};
export const getStaffsSelect = async (params?: StaffSelectQuery) => {
  try {
    let staffExternalIds;
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
          role: {
            in: ["farmer"],
          },
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
