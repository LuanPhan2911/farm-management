"use server";
import { db } from "@/lib/db";
import { sendApplicantApply } from "@/lib/mail";
import { ApplicantSchema } from "@/schemas";
import { getApplicantByEmailAndJobId } from "@/services/applicants";
import { getJobById } from "@/services/jobs";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof ApplicantSchema>>,
  jobId: string
) => {
  const tSchema = await getTranslations("applicants.schema");
  const tStatus = await getTranslations("applicants.status");
  const paramsSchema = ApplicantSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(tSchema("errors.parse"));
  }
  const job = await getJobById(jobId);
  if (!job) {
    throw new Error(tSchema("errors.jobInvalid"));
  }
  const existingApplicant = await getApplicantByEmailAndJobId(
    validatedFields.data.email,
    job.id
  );
  if (existingApplicant) {
    throw new Error(tSchema("errors.existingApplicant"));
  }
  try {
    const applicant = await db.applicant.create({
      data: {
        ...validatedFields.data,
        jobId: job.id,
      },
    });
    sendApplicantApply(applicant);

    return { message: tStatus("success.create") };
  } catch (error) {
    throw new Error(tStatus("failure.create"));
  }
};
export const destroy = async (id: string) => {
  const tStatus = await getTranslations("applicants.status");
  try {
    await db.applicant.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/applicants");
    return { message: tStatus("success.destroy") };
  } catch (error) {
    throw new Error(tStatus("failure.destroy"));
  }
};
export const deleteMany = async (ids: string[]) => {
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
    return { message: tStatus("success.destroy") };
  } catch (error) {
    throw new Error(tStatus("failure.destroy"));
  }
};
