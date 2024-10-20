import { db } from "@/lib/db";
import { ActivitySelect } from "@/types";

type ActivitySelectQuery = {
  staffId: string;
};
export const getActivitiesSelect = async ({
  staffId,
}: ActivitySelectQuery): Promise<ActivitySelect[]> => {
  try {
    return await db.activity.findMany({
      where: {
        OR: [
          {
            createdById: staffId,
          },
          {
            assignedToId: staffId,
          },
        ],
        status: {
          in: ["NEW", "IN_PROGRESS"],
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
        priority: true,
        createdBy: true,
        assignedTo: true,
        activityDate: true,
        note: true,
      },
    });
  } catch (error) {
    return [];
  }
};
