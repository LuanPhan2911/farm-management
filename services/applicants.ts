import { db } from "@/lib/db";

export const getApplicants = async (jobId: string | null) => {
  try {
    return await db.applicant.findMany({
      where: {
        ...(jobId && {
          jobId,
        }),
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
