"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { OrganizationMemberSchema, OrganizationSchema } from "@/schemas";
import {
  createMemberOrganization,
  createOrganization,
  getOrganizationBySlug,
  updateOrganization,
  updateOrganizationLogo,
} from "@/services/organizations";
import { getStaffByEmail } from "@/services/staffs";
import { ActionResponse } from "@/types";
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
  const { name, slug } = validatedFields.data;

  try {
    const existingOrg = await getOrganizationBySlug(validatedFields.data.slug);
    if (existingOrg) {
      return errorResponse(tSchema("errors.exist"));
    }
    const staff = await getStaffByEmail(validatedFields.data.createdBy);
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const org = await createOrganization({
      name,
      slug,
      createdBy: staff.externalId,
    });
    if (!org) {
      return errorResponse(tStatus("failure.create"));
    }

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
    const existingOrg = await getOrganizationBySlug(validatedFields.data.slug);
    if (existingOrg) {
      return errorResponse(tSchema("errors.exist"));
    }
    const org = await updateOrganization(
      orgId,
      validatedFields.data.name,
      validatedFields.data.slug
    );
    if (!org) {
      return errorResponse(tStatus("failure.edit"));
    }
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
  const t = await getTranslations("organizations.status");
  const file = formData.get("file");
  if (!file) {
    return errorResponse("existLogo");
  }

  try {
    const org = await updateOrganizationLogo(orgId, userId, file as File);

    if (!org) {
      return errorResponse(t("failure.editLogo"));
    }

    revalidatePath(`/admin/organizations/detail/${org.id}`);
    return successResponse(t("success.editLogo"));
  } catch (error) {
    return errorResponse(t("failure.editLogo"));
  }
};

export const createMember = async (
  values: z.infer<ReturnType<typeof OrganizationMemberSchema>>,
  orgId: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("organizations.schema");
  const tStatus = await getTranslations("organizations.status");
  const paramsSchema = OrganizationMemberSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const staff = await getStaffByEmail(validatedFields.data.email);
    if (!staff) {
      return errorResponse(tSchema("error.existMember"));
    }

    const member = await createMemberOrganization(orgId, staff.externalId);
    if (!member) {
      return errorResponse(tStatus("failure.createMember"));
    }
    revalidatePath(`/admin/organizations/detail/${member.organization.id}`);
    return successResponse(tStatus("success.createMember"));
  } catch (error) {
    return errorResponse(tStatus("failure.createMember"));
  }
};
