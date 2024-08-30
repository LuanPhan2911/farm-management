import { LIMIT } from "@/configs/paginationConfig";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";

export const createStaff = async (
  externalId: string,
  params: {
    email: string;
    name: string;
    role: StaffRole;
    imageUrl: string | null;
  }
) => {
  try {
    const staff = await db.staff.create({
      data: {
        ...params,
        externalId,
      },
    });
    return staff;
  } catch (error) {
    return null;
  }
};
export const getStaffByEmail = async (email: string) => {
  try {
    return await db.staff.findUnique({
      where: { email },
    });
  } catch (error) {
    return null;
  }
};
export const getStaffByExternalId = async (externalId: string) => {
  try {
    return await db.staff.findUnique({
      where: { externalId },
    });
  } catch (error) {
    return null;
  }
};
export const updateStaffRole = async (externalId: string, role: StaffRole) => {
  try {
    return await db.staff.update({
      where: { externalId },
      data: {
        role,
      },
    });
  } catch (error) {
    return null;
  }
};
export const updateStaff = async (
  externalId: string,
  params: { imageUrl: string; name: string }
) => {
  try {
    return await db.staff.update({
      where: { externalId },
      data: {
        ...params,
      },
    });
  } catch (error) {
    return null;
  }
};
export const deleteStaff = async (externalId: string) => {
  try {
    const staff = await db.staff.delete({
      where: {
        externalId,
      },
    });
    return staff;
  } catch (error) {
    return null;
  }
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

export const getStaffsTable = async (query: string, currentPage: number) => {
  try {
    const staffIds = await getStaffExternalIds();

    const { data, totalCount } = await clerkClient().users.getUserList({
      limit: LIMIT,
      offset: (currentPage - 1) * LIMIT,
      query,
      userId: staffIds.map((id) => `+${id}`),
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

export const getStaffsForCreatedByOrganization = async () => {
  try {
    const staffs = await db.staff.findMany({
      where: {
        role: {
          in: [StaffRole.admin, StaffRole.superadmin],
        },
      },
    });
    return staffs;
  } catch (error) {
    return [];
  }
};
export const getStaffsForAddMemberOrganization = async () => {
  try {
    const staffs = await db.staff.findMany();
    return staffs;
  } catch (error) {
    return [];
  }
};
