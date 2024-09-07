import { db } from "@/lib/db";
import { Gender, JobExperience, JobWorkingState } from "@prisma/client";

type JobParams = {
  name: string;
  slug: string;
  description: string;
  requirement: string;
  rights: string;
  workingTime: string;
  wage: string;
  quantity: number;
  experience: JobExperience;
  gender: Gender;
  workingState: JobWorkingState;
  expiredAt: Date;
};
export const getJobBySlug = async (slug: string) => {
  try {
    return await db.job.findUnique({
      where: { slug },
    });
  } catch (error) {
    return null;
  }
};
export const getJobById = async (id: string) => {
  try {
    return await db.job.findUnique({
      where: { id },
    });
  } catch (error) {
    return null;
  }
};

export const getJobsTable = async () => {
  try {
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
  } catch (error) {
    return [];
  }
};
export const getJobsCard = async (queryString: string) => {
  try {
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
  } catch (error) {
    return [];
  }
};
export const getLatestJob = async () => {
  try {
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
  } catch (error) {
    return null;
  }
};

export const getJobsSelection = async () => {
  try {
    return await db.job.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    return [];
  }
};

export const createJob = async (params: JobParams) => {
  return await db.job.create({
    data: {
      ...params,
    },
  });
};
export const updateJob = async (id: string, params: JobParams) => {
  return await db.job.update({
    where: {
      id,
    },
    data: {
      ...params,
    },
  });
};

export const updateJobPublished = async (id: string, published: boolean) => {
  return await db.job.update({
    where: {
      id,
    },
    data: {
      published,
    },
  });
};
export const deleteJob = async (id: string) => {
  return await db.job.delete({
    where: { id },
  });
};
export const deleteManyJob = async (ids: string[]) => {
  const { count } = await db.job.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return count;
};
