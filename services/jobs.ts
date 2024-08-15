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

export const getJobsTable = async () => {
  return await db.job.findMany({
    select: {
      id: true,
      name: true,
      quantity: true,
      experience: true,
      gender: true,
      expiredAt: true,
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const getJobsCard = async (queryString: string) => {
  return await db.job.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      gender: true,
      expiredAt: true,
      slug: true,
      wage: true,
      experience: true,
      workingState: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      published: true,
      expiredAt: {
        gt: new Date(),
      },
      name: {
        contains: queryString,
        mode: "insensitive",
      },
    },
  });
};
export const getLatestJob = async () => {
  return await db.job.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      published: true,
      expiredAt: {
        gt: new Date(),
      },
    },
  });
};
