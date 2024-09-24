import { LIMIT } from "@/configs/paginationConfig";
import { OrgRole } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";
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

export const createOrganization = async (params: {
  name: string;
  createdBy: string;
  slug: string;
}) => {
  const org = await clerkClient().organizations.createOrganization({
    ...params,
  });
  return org;
};
export const deleteOrganization = async (orgId: string) => {
  const org = await clerkClient().organizations.deleteOrganization(orgId);
  return org;
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
  currentPage,
  orgId,
  orderBy,
}: {
  orgId: string;
  currentPage: number;
  orderBy?: OrganizationMemberShipSortBy;
}) => {
  try {
    const { data, totalCount } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
        limit: LIMIT,
        offset: (currentPage - 1) * LIMIT,
        orderBy: orderBy,
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
export type OrganizationSortBy =
  | "+created_at"
  | "+name"
  | "+members_count"
  | "-created_at"
  | "-name"
  | "-members_count";
export const getOrganizations = async ({
  currentPage,
  orderBy,
  query,
}: {
  query?: string;
  currentPage: number;
  orderBy?: OrganizationSortBy;
}) => {
  try {
    const { data, totalCount } =
      await clerkClient().organizations.getOrganizationList({
        includeMembersCount: true,
        limit: LIMIT,
        offset: (currentPage - 1) * LIMIT,
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
export const getOrganizationById = async (id: string) => {
  try {
    return await clerkClient().organizations.getOrganization({
      organizationId: id,
    });
  } catch (error) {
    return null;
  }
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
export const updateOrganization = async (
  orgId: string,
  name: string,
  slug: string
) => {
  const org = await clerkClient().organizations.updateOrganization(orgId, {
    name,
    slug,
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
