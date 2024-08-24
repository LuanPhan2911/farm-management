"use server";
import { db } from "@/lib/db";
import { sendApplicantApply, sendApplicantCreateUser } from "@/lib/mail";
import {
  errorResponse,
  generateEmail,
  generatePassword,
  successResponse,
} from "@/lib/utils";
import { ApplicantSchema, StaffSchema } from "@/schemas";
import {
  getApplicantByEmailAndJobId,
  getApplicantById,
} from "@/services/applicants";
import { getJobById } from "@/services/jobs";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createUser, getUserByEmail } from "@/services/users";
import { ApplicantStatus } from "@prisma/client";

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
    const applicant = await db.applicant.create({
      data: {
        ...validatedFields.data,
        jobId: job.id,
      },
      include: {
        job: {
          select: {
            name: true,
          },
        },
      },
    });
    sendApplicantApply(applicant);

    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("applicants.status");
  try {
    await db.applicant.delete({
      where: {
        id,
      },
    });
    revalidatePath("/admin/applicants");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
export const destroyMany = async (ids: string[]): Promise<ActionResponse> => {
  const tStatus = await getTranslations("applicants.status");
  try {
    await db.applicant.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
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
  const tSchema = await getTranslations("applicants.schema");
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

    const { email, name, password, role } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return errorResponse(tSchema("errors.emailExist"));
    }

    const user = await createUser({ ...validatedFields.data });
    if (!user) {
      return errorResponse(tStatus("failure.createStaff"));
    }

    // TODO: use webhook to create staff

    sendApplicantCreateUser(applicant, email, password);

    // send mail notification

    await db.applicant.updateMany({
      where: {
        email: applicant.email,
      },
      data: {
        status: ApplicantStatus.CONFIRM,
      },
    });
    revalidatePath("/admin/applicants");
    return successResponse(tStatus("success.createStaff"));
  } catch (error) {
    return errorResponse(tStatus("failure.createStaff"));
  }
};
