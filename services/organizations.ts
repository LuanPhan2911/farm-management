import { LIMIT } from "@/configs/paginationConfig";
import { OrgRole, PaginatedResponse } from "@/types";
import { clerkClient, currentUser, Organization } from "@clerk/nextjs/server";
import { getCurrentStaff } from "./staffs";
import { getOrganizationMembershipList } from "./users";
import { Staff } from "@prisma/client";
import { db } from "@/lib/db";

type OrganizationParams = {
  name: string;
  createdBy: string;
  slug: string;
};
export const createOrganization = async (params: OrganizationParams) => {
  const org = await clerkClient().organizations.createOrganization({
    ...params,
  });
  return org;
};
export const deleteOrganization = async (id: string) => {
  const org = await clerkClient().organizations.deleteOrganization(id);
  return org;
};
export const updateOrganizationLogo = async (
  orgId: string,
  userId: string,
  file: File
) => {
  const org = await clerkClient().organizations.updateOrganizationLogo(orgId, {
    file,
    uploaderUserId: userId,
  });
  return org;
};
type OrganizationUpdateParams = {
  name: string;
  slug: string;
};
export const updateOrganization = async (
  orgId: string,
  params: OrganizationUpdateParams
) => {
  const org = await clerkClient().organizations.updateOrganization(orgId, {
    ...params,
  });
  return org;
};

export const createMemberOrganization = async (
  orgId: string,
  userId: string,
  role: string
) => {
  const member = await clerkClient().organizations.createOrganizationMembership(
    {
      organizationId: orgId,
      userId,
      role,
    }
  );
  return member;
};

export const deleteMemberOrganization = async (
  userId: string,
  orgId: string
) => {
  const orgMember =
    await clerkClient().organizations.deleteOrganizationMembership({
      organizationId: orgId,
      userId,
    });
  return orgMember;
};
export const updateMemberRoleOrganization = async (
  userId: string,
  orgId: string,
  role: OrgRole
) => {
  const orgMember =
    await clerkClient().organizations.updateOrganizationMembership({
      organizationId: orgId,
      role,
      userId,
    });
  return orgMember;
};

export type OrganizationMemberShipSortBy =
  | "+email_address"
  | "+created_at"
  | "+first_name"
  | "+last_name"
  | "-email_address"
  | "-created_at"
  | "-first_name"
  | "-last_name";
export const getOrganizationMembership = async ({
  orgId,
}: {
  orgId: string;
}) => {
  try {
    const user = await currentUser();
    if (!user) {
      return [];
    }
    const { data } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
        limit: 100,
      });
    const currentUserInOrg = data.find(
      (item) => item.publicUserData?.userId === user.id
    );
    if (!currentUserInOrg) {
      return [];
    }

    return data;
  } catch (error) {
    return [];
  }
};
export type OrganizationSortBy =
  | "+created_at"
  | "+name"
  | "+members_count"
  | "-created_at"
  | "-name"
  | "-members_count";
export const getOrganizations = async ({
  page,
  orderBy,
  query,
}: {
  query?: string;
  page: number;
  orderBy?: OrganizationSortBy;
}): Promise<PaginatedResponse<Organization>> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    if (currentStaff.role === "superadmin") {
      const { data, totalCount } =
        await clerkClient().organizations.getOrganizationList({
          includeMembersCount: true,
          limit: LIMIT,
          offset: (page - 1) * LIMIT,
          query,
          orderBy,
        });
      const totalPage = Math.ceil(totalCount / LIMIT);
      return {
        data,
        totalPage,
      };
    }

    const { data, totalPage } = await getOrganizationMembershipList({
      page,
      userId: currentStaff.externalId,
    });
    return {
      data: data.map((item) => item.organization),
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};
export const getOrganizationsSelect = async (): Promise<Organization[]> => {
  try {
    const { data } = await clerkClient().organizations.getOrganizationList({
      includeMembersCount: true,
      limit: 100,
    });
    return data;
  } catch (error) {
    return [];
  }
};
export const getOrganizationBySlug = async (slug: string) => {
  try {
    const org = await clerkClient().organizations.getOrganization({
      slug,
    });
    return org;
  } catch (error) {
    return null;
  }
};
export const getOrganizationById = async (id: string) => {
  try {
    return await clerkClient().organizations.getOrganization({
      organizationId: id,
    });
  } catch (error) {
    return null;
  }
};

export const getOrganizationMemberSelect = async (
  orgId: string
): Promise<Staff[]> => {
  try {
    const organizationMembers = await getOrganizationMembership({ orgId });
    if (!organizationMembers.length) {
      return [];
    }
    const externalStaffId = organizationMembers
      .map((item) => item.publicUserData?.userId)
      .filter((userId) => userId !== undefined);
    const staff = await db.staff.findMany({
      where: {
        externalId: {
          notIn: externalStaffId,
        },
      },
    });
    return staff;
  } catch (error) {
    return [];
  }
};
