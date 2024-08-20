import { PaginatedResourceResponse, Roles } from "@/types";
import { clerkClient, User } from "@clerk/nextjs/server";
export const LIMIT = 5;
export const getUsersTable = async (
  query: string,
  currentPage: number
): Promise<PaginatedResourceResponse<User>> => {
  try {
    const users = await clerkClient().users.getUserList({
      limit: LIMIT,
      offset: (currentPage - 1) * LIMIT,
      query,
    });
    return users;
  } catch (error) {
    return {
      data: [],
      totalCount: 0,
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
  role: Roles
) => {
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
  params: {
    publicMetadata?: UserPublicMetadata;
  }
) => {
  try {
    const user = await clerkClient().users.updateUserMetadata(userId, params);
    return user;
  } catch (error) {
    return null;
  }
};
export const updateUser = async (
  userId: string,
  firstName: string,
  lastName: string,
  address: string,
  phone: string
) => {
  try {
    const user = await clerkClient().users.updateUser(userId, {
      firstName,
      lastName,
    });
    await updateUserMetadata(userId, {
      publicMetadata: {
        address,
        phone,
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
