"use server";

import { db } from "@/lib/db";
import { JobSchema } from "@/schemas";
import { getJobById, getJobBySlug } from "@/services/jobs";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

export const create = async (values: z.infer<ReturnType<typeof JobSchema>>) => {
  const tSchema = await getTranslations("jobs.schema");
  const tStatus = await getTranslations("jobs.status");
  const paramsSchema = JobSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(tSchema("errors.parse"));
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
    const job = await db.job.create({
      data: {
        ...validatedFields.data,
        slug,
      },
    });
    revalidatePath("/dashboard/jobs");
    return { message: tStatus("success.create") };
  } catch (error) {
    throw new Error(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof JobSchema>>,
  id: string
) => {
  const tSchema = await getTranslations("jobs.schema");
  const tStatus = await getTranslations("jobs.status");
  const paramsSchema = JobSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(tSchema("errors.parse"));
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
    return { message: tStatus("success.edit") };
  } catch (error) {
    throw new Error(tStatus("failure.edit"));
  }
};
export const destroy = async (id: string) => {
  const tStatus = await getTranslations("jobs.status");
  try {
    const job = await db.job.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/jobs");
    return { message: tStatus("success.destroy") };
  } catch (error) {
    throw new Error(tStatus("failure.destroy"));
  }
};
export const deleteMany = async (ids: string[]) => {
  const tStatus = await getTranslations("jobs.status");
  try {
    const jobs = await db.job.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    revalidatePath("/dashboard/jobs");
    return { message: tStatus("success.destroy") };
  } catch (error) {
    throw new Error(tStatus("failure.destroy"));
  }
};
export const togglePublished = async (id: string, published: boolean) => {
  const tStatus = await getTranslations("jobs.status");
  try {
    const job = await db.job.update({
      where: {
        id,
      },
      data: {
        published,
      },
    });
    revalidatePath("/dashboard/jobs");
    return {
      message: tStatus("success.updatePublished"),
    };
  } catch (error) {
    throw new Error(tStatus("failure.updatePublished"));
  }
};
