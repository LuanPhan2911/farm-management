"use server";
import { db } from "@/lib/db";
import {
  sendApplicantApply,
  sendApplicantCreateUser,
  sendApplicantUpdateRole,
} from "@/lib/mail";
import { errorResponse, generatePassword, successResponse } from "@/lib/utils";
import { ApplicantSchema } from "@/schemas";
import {
  getApplicantByEmailAndJobId,
  getApplicantById,
} from "@/services/applicants";
import { getJobById } from "@/services/jobs";
import { ActionResponse, Roles } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { Applicant } from "@prisma/client";

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
  applicantId: string,
  role: Roles
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("applicants.status");
  const tError = await getTranslations("applicants.schema.errors");
  try {
    const applicant = await getApplicantById(applicantId);
    if (!applicant) {
      return {
        message: tError("noExist"),
        ok: false,
      };
    }

    const { data: users, totalCount } = await clerkClient().users.getUserList({
      emailAddress: [applicant.email],

      limit: 1,
    });
    if (totalCount === 1) {
      const existingUser = users[0];

      await clerkClient.users.updateUser(existingUser.id, {
        firstName: applicant.name,
        publicMetadata: {
          role: role,
        },
      });
      sendApplicantUpdateRole(applicant);
    } else {
      const password = generatePassword(8);
      await clerkClient().users.createUser({
        firstName: applicant.name,
        emailAddress: [applicant.email],
        password,
        publicMetadata: {
          role: role,
        },
      });
      sendApplicantCreateUser(applicant, password);

      //send mail notification
    }

    await db.applicant.deleteMany({
      where: {
        email: applicant.email,
      },
    });
    revalidatePath("/admin/applicants");
    return successResponse(tStatus("success.updateRole"));
  } catch (error) {
    return errorResponse(tStatus("failure.updateRole"));
  }
};
