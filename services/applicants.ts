import { db } from "@/lib/db";
import { ApplicantTable } from "@/types";
import { ApplicantStatus } from "@prisma/client";

type ApplicantParams = {
  name: string;
  email: string;
  phone: string;
  address: string;
  note?: string | undefined;
  jobId: string;
};
export const getApplicants = async ({
  jobId,
}: {
  jobId?: string | undefined;
}): Promise<ApplicantTable[]> => {
  try {
    return await db.applicant.findMany({
      where: {
        ...(jobId && {
          jobId,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        note: true,
        status: true,
      },
    });
  } catch (error) {
    return [];
  }
};
export const getApplicantByEmailAndJobId = async (
  email: string,
  jobId: string
) => {
  try {
    return await db.applicant.findUnique({
      where: {
        email_jobId: {
          email,
          jobId,
        },
      },
    });
  } catch (error) {
    return null;
  }
};
export const getApplicantById = async (id: string) => {
  try {
    return await db.applicant.findUnique({
      where: { id, status: "NEW" },
      include: {
        job: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const createApplicant = async (params: ApplicantParams) => {
  return await db.applicant.create({
    data: {
      ...params,
    },
    include: {
      job: {
        select: {
          name: true,
        },
      },
    },
  });
};
export const deleteApplicant = async (id: string) => {
  return await db.applicant.delete({
    where: {
      id,
    },
  });
};
export const deleteManyApplicant = async (ids: string[]) => {
  return await db.applicant.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const updateApplicantStatus = async (email: string) => {
  return await db.applicant.updateMany({
    where: {
      email,
    },
    data: {
      status: ApplicantStatus.CONFIRM,
    },
  });
};
