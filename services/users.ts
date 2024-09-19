import { LIMIT } from "@/configs/paginationConfig";
import { clerkClient } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";
import { getStaffExternalIds } from "./staffs";

type UserParams = {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
};
export type UserOrderBy =
  | "created_at"
  | "email_address"
  | "last_sign_in_at"
  | "last_active_at"
  | "-created_at"
  | "-email_address"
  | "-last_sign_in_at"
  | "-last_active_at";
export const getUsersTable = async ({
  query,
  currentPage,
  orderBy,
}: {
  currentPage: number;
  orderBy?: UserOrderBy;
  query?: string;
}) => {
  try {
    const staffIds = await getStaffExternalIds();

    const { data, totalCount } = await clerkClient().users.getUserList({
      limit: LIMIT,
      offset: (currentPage - 1) * LIMIT,
      userId: staffIds.map((id) => `-${id}`),
      query,
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
}: UserParams) => {
  const user = await clerkClient().users.createUser({
    firstName: name,
    emailAddress: [email],
    password,
    publicMetadata: {
      role,
    },
  });

  return user;
};
export const updateUserMetadata = async (
  userId: string,
  {
    role,
  }: {
    role: StaffRole;
  }
) => {
  const user = await clerkClient().users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });

  return user;
};
type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  phone: string;
  address: string;
};
export const updateUser = async (userId: string, params: UpdateUserParams) => {
  await clerkClient().users.updateUser(userId, {
    firstName: params.firstName,
    lastName: params.lastName,
  });
  const user = await clerkClient().users.updateUserMetadata(userId, {
    publicMetadata: {
      phone: params.phone,
      address: params.address,
    },
  });
  return user;
};
export const deleteUser = async (userId: string) => {
  const user = await clerkClient().users.deleteUser(userId);
  return user;
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
