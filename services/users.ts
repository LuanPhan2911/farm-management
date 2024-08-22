import { LIMIT } from "@/configs/paginationConfig";

import { clerkClient } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";
import {
  createOrUpdateStaff,
  createStaff,
  deleteStaff,
  getStaffByEmail,
} from "./staffs";

export const getUsersTable = async (query: string, currentPage: number) => {
  try {
    const { data, totalCount } = await clerkClient().users.getUserList({
      limit: LIMIT,
      offset: (currentPage - 1) * LIMIT,
      query,
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
export const getUserByEmail = async (email: string) => {
  try {
    const { data } = await clerkClient().users.getUserList({
      emailAddress: [email],
      limit: 1,
    });
    if (!data.length) {
      return null;
    }
    return data[0];
  } catch (error) {
    return null;
  }
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: StaffRole
) => {
  try {
    const existingStaff = await getStaffByEmail(email);
    if (existingStaff) {
      return null;
    }
    const staff = await createStaff(email, role);
    const user = await clerkClient().users.createUser({
      firstName: name,
      emailAddress: [email],
      password,
      externalId: staff?.id,
      publicMetadata: {
        role,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};
export const updateUserMetadata = async (
  userId: string,
  {
    role,
  }: {
    role: StaffRole;
  }
) => {
  try {
    const user = await clerkClient().users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};
export const updateUser = async (
  userId: string,
  params: {
    firstName?: string;
    lastName?: string;
    externalId?: string;
  },
  publicMetadata: UserPublicMetadata
) => {
  try {
    await clerkClient().users.updateUser(userId, {
      ...params,
    });
    const user = await clerkClient().users.updateUserMetadata(userId, {
      publicMetadata: {
        ...publicMetadata,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};
export const deleteUser = async (userId: string) => {
  try {
    const user = await clerkClient().users.deleteUser(userId);
    if (user.externalId) {
      await deleteStaff(user.externalId);
    }
    return user;
  } catch (error) {
    return null;
  }
};
export const getUserById = async (id: string) => {
  try {
    const user = await clerkClient().users.getUser(id);
    return user;
  } catch (error) {
    return null;
  }
};

export const getUsersToAddOrganization = async () => {
  try {
    const {} = await clerkClient().users.getUserList({});
  } catch (error) {}
};
