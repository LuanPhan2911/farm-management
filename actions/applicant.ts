"use server";
import { db } from "@/lib/db";
import { sendApplicantApply, sendApplicantCreateUser } from "@/lib/mail";
import {
  errorResponse,
  generateEmail,
  generatePassword,
  successResponse,
} from "@/lib/utils";
import { ApplicantSchema, ApplicantUpdateRoleSchema } from "@/schemas";
import {
  getApplicantByEmailAndJobId,
  getApplicantById,
} from "@/services/applicants";
import { getJobById } from "@/services/jobs";
import { ActionResponse, Roles } from "@/types";
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
    revalidatePath("/dashboard/applicants");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
export const deleteMany = async (ids: string[]): Promise<ActionResponse> => {
  const tStatus = await getTranslations("applicants.status");
  try {
    await db.applicant.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    revalidatePath("/dashboard/applicants");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const updateRole = async (
  values: z.infer<ReturnType<typeof ApplicantUpdateRoleSchema>>,
  applicantId: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("applicants.schema");
  const tApplicantStatus = await getTranslations("applicants.status");
  const tApplicantError = await getTranslations("applicants.schema.errors");
  const tUserStatus = await getTranslations("users.status");

  const paramsSchema = ApplicantUpdateRoleSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const applicant = await getApplicantById(applicantId);
    if (!applicant) {
      return {
        message: tApplicantError("noExist"),
        ok: false,
      };
    }
    const name = validatedFields.data.name;
    const role = validatedFields.data.role as Roles;
    const email = await generateEmail(name);
    const password = generatePassword(8);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        message: "Existing email",
        ok: false,
      };
    }

    const user = await createUser(name, email, password, role);
    if (!user) {
      return {
        message: tUserStatus("failure.create"),
        ok: false,
      };
    }
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
    return successResponse(tApplicantStatus("success.updateRole"));
  } catch (error) {
    return errorResponse(tApplicantStatus("failure.updateRole"));
  }
};
