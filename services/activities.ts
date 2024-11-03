import { db } from "@/lib/db";
import {
  ActivityPriorityCount,
  ActivitySelect,
  ActivityStatusCount,
  ActivityTable,
  PaginatedResponse,
} from "@/types";
import { ActivityPriority, ActivityStatus } from "@prisma/client";
import { getCurrentStaff, getStaffById } from "./staffs";
import {
  ActivityCreatePermissionError,
  ActivityExistError,
  ActivityUpdatePermissionError,
  StaffExistError,
  UnAuthorizedError,
} from "@/errors";
import { canCreateActivity, canStaffUpdateActivity } from "@/lib/permission";
import { LIMIT } from "@/configs/paginationConfig";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";

const checkCreateActivity = async ({
  createdById,
  assignedToId,
}: {
  createdById: string;
  assignedToId: string;
}) => {
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
  return true;
};
const checkUpdateActivity = async (id: string) => {
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
  return true;
};
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
  await checkCreateActivity({
    assignedToId,
    createdById,
  });

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
  await checkUpdateActivity(id);

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
  await checkUpdateActivity(id);
  const deletedActivity = await db.activity.delete({
    where: {
      id,
    },
  });

  return deletedActivity;
};

export const updateActivityStatus = async (
  id: string,
  status: "COMPLETED" | "CANCELLED"
) => {
  await checkUpdateActivity(id);
  const equipmentDetails = await db.equipmentUsage.findMany({
    where: {
      activityId: id,
    },
    distinct: ["equipmentDetailId"],
    select: {
      equipmentDetailId: true,
    },
  });
  const [updatedActivity, updatedEquipmentDetails] = await db.$transaction([
    db.activity.update({
      where: {
        id,
      },
      data: {
        status,
      },
    }),
    db.equipmentDetail.updateMany({
      where: {
        id: {
          in: equipmentDetails.map((item) => item.equipmentDetailId),
        },
      },
      data: {
        status: "AVAILABLE",
      },
    }),
  ]);
  return { updatedActivity, updatedEquipmentDetails };
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
              id: true,
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
            id: true,
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

type ActivityCountQuery = {
  begin?: Date;
  end?: Date;
};
export const getCountActivityStatus = async ({
  begin,
  end,
}: ActivityCountQuery): Promise<ActivityStatusCount[]> => {
  try {
    if (!begin || !end) {
      return [];
    }
    const result = await db.activity.groupBy({
      by: "status",
      where: {
        activityDate: {
          ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
          ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
        },
      },
      _count: {
        _all: true,
      },
    });
    return result.map((item) => {
      return {
        status: item.status,
        _count: item._count._all,
      };
    });
  } catch (error) {
    return [];
  }
};
export const getCountActivityPriority = async ({
  begin,
  end,
}: ActivityCountQuery): Promise<ActivityPriorityCount[]> => {
  try {
    if (!begin || !end) {
      return [];
    }
    const result = await db.activity.groupBy({
      by: "priority",
      where: {
        activityDate: {
          ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
          ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
        },
      },
      _count: {
        _all: true,
      },
    });
    return result.map((item) => {
      return {
        priority: item.priority,
        _count: item._count._all,
      };
    });
  } catch (error) {
    return [];
  }
};
