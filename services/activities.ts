import { db } from "@/lib/db";
import { ActivitySelect, ActivityTable, PaginatedResponse } from "@/types";
import { ActivityPriority, ActivityStatus } from "@prisma/client";
import { getCurrentStaff, getStaffById } from "./staffs";
import {
  ActivityCreatePermissionError,
  ActivityExistError,
  ActivityUpdatePermissionError,
  ActivityUpdateStatusError,
  StaffExistError,
  UnAuthorizedError,
} from "@/errors";
import {
  canCreateActivity,
  canStaffUpdateActivity,
  canUpdateActivityStatus,
} from "@/lib/permission";
import { LIMIT } from "@/configs/paginationConfig";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";

type ActivityParams = {
  name: string;
  description?: string | null;
  fieldId: string;
  activityDate: Date;
  status: ActivityStatus;
  priority: ActivityPriority;
  estimatedDuration?: string | null;
  actualDuration?: string | null;
  note?: string | null;
  createdById: string;
  assignedToId: string;
};
/**
 * only admin or super admin have permission to create activity
 * createdById and assignedTo must be valid
 *
 * @param params
 */
export const createActivity = async (params: ActivityParams) => {
  const { createdById, assignedToId } = params;
  const createdBy = await getCurrentStaff();
  // check create by exist
  if (!createdBy || createdBy.id !== createdById) {
    throw new UnAuthorizedError();
  }
  // check created by role
  if (!canCreateActivity(createdBy.role)) {
    throw new ActivityCreatePermissionError();
  }
  const assignedTo = await getStaffById(assignedToId);
  if (!assignedTo) {
    throw new StaffExistError();
  }

  const activity = await db.activity.create({
    data: {
      ...params,
    },
  });
  return activity;
};

type ActivityUpdateParams = {
  name: string;
  description?: string | null;
  status: ActivityStatus;
  priority: ActivityPriority;
  actualDuration?: string | null;
  note?: string | null;
};
/**
 * update activity
 * activity exist
 * activity status must be in_progress, pending, new
 * only created by or assigned to activity or superadmin role have permission update
 * @param id
 * @param params
 * @returns
 */
export const updateActivity = async (
  id: string,
  params: ActivityUpdateParams
) => {
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    throw new UnAuthorizedError();
  }
  const activity = await db.activity.findUnique({
    where: {
      id,
    },
  });
  if (!activity) {
    throw new ActivityExistError();
  }
  if (!canUpdateActivityStatus(activity.status)) {
    throw new ActivityUpdateStatusError();
  }
  const { assignedToId, createdById } = activity;
  if (
    !canStaffUpdateActivity({
      assignedToId,
      createdById,
      currentStaff,
    })
  ) {
    throw new ActivityUpdatePermissionError();
  }

  const updatedActivity = await db.activity.update({
    where: { id },
    data: {
      ...params,
    },
  });
  return updatedActivity;
};
/**
 * delete activity
 * activity exist
 * permission delete
 * @param id
 * @returns
 */
export const deleteActivity = async (id: string) => {
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    throw new UnAuthorizedError();
  }
  const activity = await db.activity.findUnique({
    where: {
      id,
    },
  });
  if (!activity) {
    throw new ActivityExistError();
  }
  if (!canUpdateActivityStatus(activity.status)) {
    throw new ActivityUpdateStatusError();
  }
  const { assignedToId, createdById } = activity;
  if (
    !canStaffUpdateActivity({
      assignedToId,
      createdById,
      currentStaff,
    })
  ) {
    throw new ActivityUpdatePermissionError();
  }
  const deletedActivity = await db.activity.delete({
    where: {
      id,
    },
  });

  return deletedActivity;
};

type ActivitySelectQuery = {
  staffId: string;
};
type ActivityQuery = {
  page?: number;
  query?: string;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
  staffId: string;
};
export const getActivities = async ({
  filterNumber,
  filterString,
  orderBy,
  page = 1,
  query,
  staffId,
}: ActivityQuery): Promise<PaginatedResponse<ActivityTable>> => {
  try {
    const [data, count] = await db.$transaction([
      db.activity.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          OR: [{ assignedToId: staffId }, { createdById: staffId }],
          name: {
            contains: query,
            mode: "insensitive",
          },

          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
        include: {
          assignedTo: true,
          createdBy: true,
          field: {
            select: {
              name: true,
              location: true,
            },
          },
          _count: {
            select: {
              equipmentUseds: true,
              materialUseds: true,
            },
          },
        },
      }),
      db.activity.count({
        where: {
          OR: [{ assignedToId: staffId }, { createdById: staffId }],
          name: {
            contains: query,
            mode: "insensitive",
          },
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
      }),
    ]);
    const totalPage = Math.ceil(count / LIMIT);
    return {
      data,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
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

export const getActivityById = async ({
  staffId,
  activityId,
}: {
  staffId: string;
  activityId: string;
}): Promise<ActivityTable | null> => {
  try {
    return await db.activity.findUnique({
      where: {
        id: activityId,
        OR: [
          {
            createdById: staffId,
          },
          {
            assignedToId: staffId,
          },
        ],
      },
      include: {
        assignedTo: true,
        createdBy: true,
        field: {
          select: {
            name: true,
            location: true,
          },
        },
        _count: {
          select: {
            equipmentUseds: true,
            materialUseds: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
