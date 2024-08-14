import { db } from "@/lib/db";

export const getJobBySlug = async (slug: string) => {
  return await db.job.findUnique({
    where: { slug },
  });
};
export const getJobById = async (id: string) => {
  return await db.job.findUnique({
    where: { id },
  });
};

export const getJobsAll = async () => {
  return await db.job.findMany();
};
