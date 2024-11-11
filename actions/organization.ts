"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { OrganizationMemberSchema, OrganizationSchema } from "@/schemas";
import {
  createMemberOrganization,
  createOrganization,
  deleteMemberOrganization,
  deleteOrganization,
  getOrganizationBySlug,
  updateMemberRoleOrganization,
  updateOrganization,
  updateOrganizationLogo,
} from "@/services/organizations";
import { getStaffById } from "@/services/staffs";
import { ActionResponse, OrgRole } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof OrganizationSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("organizations.schema");
  const tStatus = await getTranslations("organizations.status");
  const paramsSchema = OrganizationSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  const { createdBy, name, slug } = validatedFields.data;

  try {
    const existingOrg = await getOrganizationBySlug(slug);
    if (existingOrg) {
      return errorResponse(tSchema("errors.exist"));
    }

    const staff = await getStaffById(createdBy);
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const org = await createOrganization({
      name,
      createdBy: staff.externalId,
      slug,
    });

    revalidatePath("/admin/organizations");
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof OrganizationSchema>>,
  orgId: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("organizations.schema");
  const tStatus = await getTranslations("organizations.status");
  const paramsSchema = OrganizationSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const { slug, name } = validatedFields.data;
    const existingOrg = await getOrganizationBySlug(slug);
    if (existingOrg && existingOrg.id !== orgId) {
      return errorResponse(tSchema("errors.exist"));
    }
    const org = await updateOrganization(orgId, {
      name,
      slug,
    });

    revalidatePath(`/admin/organizations/detail/${org.id}`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};

export const editLogo = async (
  orgId: string,
  userId: string,
  formData: FormData
): Promise<ActionResponse> => {
  const t = await getTranslations("organizations");
  const file = formData.get("file");
  if (!file) {
    return errorResponse("schema.errors.existLogo");
  }

  try {
    const org = await updateOrganizationLogo(orgId, userId, file as File);

    revalidatePath(`/admin/organizations/detail/${org.id}`);
    return successResponse(t("status.success.editLogo"));
  } catch (error) {
    return errorResponse(t("status.failure.editLogo"));
  }
};
export const destroy = async (orgId: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("organizations.status");

  try {
    await deleteOrganization(orgId);

    revalidatePath("/admin/organizations");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const createMember = async (
  values: z.infer<ReturnType<typeof OrganizationMemberSchema>>,
  orgId: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("organizations.schema.member");
  const tStatus = await getTranslations("organizations.status");
  const paramsSchema = OrganizationMemberSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const { memberId } = validatedFields.data;
    const staff = await getStaffById(memberId);
    if (!staff) {
      return errorResponse(tSchema("error.existMember"));
    }

    const member = await createMemberOrganization(
      orgId,
      staff.externalId,
      validatedFields.data.role
    );

    revalidatePath(`/admin/organizations/detail/${member.organization.id}`);
    return successResponse(tStatus("success.createMember"));
  } catch (error) {
    return errorResponse(tStatus("failure.createMember"));
  }
};

export const destroyMember = async (
  userId: string,
  orgId: string
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("organizations.status");
  try {
    const orgMember = await deleteMemberOrganization(userId, orgId);

    revalidatePath(`/admin/organizations/detail/${orgMember.organization.id}`);
    return successResponse(tStatus("success.destroyMember"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroyMember"));
  }
};

export const editMemberRole = async (
  userId: string,
  orgId: string,
  role: OrgRole
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("organizations.status");
  try {
    const orgMember = await updateMemberRoleOrganization(userId, orgId, role);

    revalidatePath(`/admin/organizations/detail/${orgMember.organization.id}`);
    return successResponse(tStatus("success.editMemberRole"));
  } catch (error) {
    return errorResponse(tStatus("failure.editMemberRole"));
  }
};
