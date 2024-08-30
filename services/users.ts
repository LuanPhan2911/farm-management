import { LIMIT } from "@/configs/paginationConfig";
import { clerkClient } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";
import { getStaffExternalIds } from "./staffs";

export const getUsersTable = async (query: string, currentPage: number) => {
  try {
    const staffIds = await getStaffExternalIds();

    const { data, totalCount } = await clerkClient().users.getUserList({
      limit: LIMIT,
      offset: (currentPage - 1) * LIMIT,
      query,
      userId: staffIds.map((id) => `-${id}`),
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
    const { data, totalCount } = await clerkClient().users.getUserList({
      emailAddress: [email],
      limit: 1,
    });
    if (totalCount === 0) {
      return null;
    }
    return data[0];
  } catch (error) {
    return null;
  }
};

export const createUser = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
}) => {
  try {
    const user = await clerkClient().users.createUser({
      firstName: name,
      emailAddress: [email],
      password,
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
