"use server";
import { db } from "@/lib/db";
import { sendApplicantApply } from "@/lib/mail";
import { errorResponse, successResponse } from "@/lib/utils";
import { ApplicantSchema } from "@/schemas";
import { getApplicantByEmailAndJobId } from "@/services/applicants";
import { getJobById } from "@/services/jobs";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
