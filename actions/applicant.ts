"use server";

import { sendApplicantApply, sendApplicantCreateUser } from "@/lib/mail";
import { errorResponse, successResponse } from "@/lib/utils";
import { ApplicantSchema, StaffSchema } from "@/schemas";
import {
  createApplicant,
  deleteApplicant,
  deleteManyApplicant,
  getApplicantByEmailAndJobId,
  getApplicantById,
  updateApplicantStatus,
} from "@/services/applicants";
import { getJobById } from "@/services/jobs";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createUser, getUserByEmail } from "@/services/users";
import { createStaff } from "@/services/staffs";

export const create = async (
  values: z.infer<ReturnType<typeof ApplicantSchema>>,
  jobId: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("applicants.schema");
  const tStatus = await getTranslations("applicants.status");
  const paramsSchema = ApplicantSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  const job = await getJobById(jobId);
  if (!job) {
    return errorResponse(tSchema("errors.jobInvalid"));
  }
  const existingApplicant = await getApplicantByEmailAndJobId(
    validatedFields.data.email,
    job.id
  );
  if (existingApplicant) {
    return errorResponse(tSchema("errors.existingApplicant"));
  }
  try {
    const applicant = await createApplicant({
      ...validatedFields.data,
      jobId,
    });
    sendApplicantApply(applicant.email, {
      jobName: applicant.job.name,
      name: applicant.name,
    });

    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("applicants.status");
  try {
    await deleteApplicant(id);
    revalidatePath("/admin/applicants");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
export const destroyMany = async (ids: string[]): Promise<ActionResponse> => {
  const tStatus = await getTranslations("applicants.status");
  try {
    await deleteManyApplicant(ids);
    revalidatePath("/admin/applicants");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const createApplicantStaff = async (
  values: z.infer<ReturnType<typeof StaffSchema>>,
  applicantId: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("staffs.schema");
  const tStatus = await getTranslations("applicants.status");

  const paramsSchema = StaffSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const applicant = await getApplicantById(applicantId);
    if (!applicant) {
      return errorResponse(tSchema("errors.exist"));
    }

    const {
      email,
      password,
      name,
      role,
      address,
      phone,
      startToWorkDate,
      baseHourlyWage,
    } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return errorResponse(tSchema("errors.emailExist"));
    }

    const user = await createUser({
      email,
      name,
      password,
      role,
      address,
      phone,
    });

    const staff = await createStaff(user.id, {
      email,
      name,
      role,
      address,
      baseHourlyWage,
      phone,
      startToWorkDate,
    });
    // TODO: use webhook to create staff

    sendApplicantCreateUser(applicant.email, {
      email,
      name,
      password,
      startToWorkDate,
      jobName: applicant.job.name,
    });

    // send mail notification

    // update this applicant status to confirmed
    await updateApplicantStatus(applicant.email);

    revalidatePath("/admin/applicants");
    return successResponse(tStatus("success.createStaff"));
  } catch (error) {
    return errorResponse(tStatus("failure.createStaff"));
  }
};
