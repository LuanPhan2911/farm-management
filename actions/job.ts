"use server";

import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/utils";
import { JobSchema } from "@/schemas";
import { getJobBySlug } from "@/services/jobs";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof JobSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("jobs.schema");
  const tStatus = await getTranslations("jobs.status");
  const paramsSchema = JobSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    let slug = slugify(validatedFields.data.name, {
      lower: true,
    });
    const existingJob = await getJobBySlug(slug);
    if (existingJob) {
      slug = slugify(
        `${validatedFields.data.name}-${Math.floor(Math.random() * 1000)}`,
        {
          lower: true,
        }
      );
    }
    await db.job.create({
      data: {
        ...validatedFields.data,
        slug,
      },
    });
    revalidatePath("/dashboard/jobs");
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof JobSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("jobs.schema");
  const tStatus = await getTranslations("jobs.status");
  const paramsSchema = JobSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    let slug = slugify(validatedFields.data.name, {
      lower: true,
    });
    const existingJob = await getJobBySlug(slug);

    if (existingJob && id !== existingJob.id) {
      slug = slugify(
        `${validatedFields.data.name}-${Math.floor(Math.random() * 1000)}`,
        {
          lower: true,
        }
      );
    }
    const job = await db.job.update({
      where: {
        id,
      },
      data: {
        ...validatedFields.data,
        slug,
      },
    });
    revalidatePath(`/dashboard/jobs/edit/${job.id}`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("jobs.status");
  try {
    const job = await db.job.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/jobs");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
export const destroyMany = async (ids: string[]): Promise<ActionResponse> => {
  const tStatus = await getTranslations("jobs.status");
  try {
    await db.job.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    revalidatePath("/dashboard/jobs");
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};
export const editPublished = async (
  id: string,
  published: boolean
): Promise<ActionResponse> => {
  const tStatus = await getTranslations("jobs.status");
  try {
    await db.job.update({
      where: {
        id,
      },
      data: {
        published,
      },
    });
    revalidatePath("/dashboard/jobs");
    return successResponse(tStatus("success.editPublished"));
  } catch (error) {
    return errorResponse(tStatus("failure.editPublished"));
  }
};
