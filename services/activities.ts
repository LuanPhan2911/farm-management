import { db } from "@/lib/db";
import {
  ActivityPriorityCount,
  ActivitySelect,
  ActivitySelectWithCropAndField,
  ActivityStatusCount,
  ActivityTable,
  PaginatedResponse,
} from "@/types";
import { ActivityPriority, ActivityStatus, Staff } from "@prisma/client";
import { LIMIT } from "@/configs/paginationConfig";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import { getCurrentStaff } from "./staffs";
import { truncateByDomain } from "recharts/types/util/ChartUtils";
import { cropSelect } from "./crops";
import { fieldSelect } from "./fields";
import { plantSelect } from "./plants";

type ActivityParams = {
  name: string;
  description?: string | null;
  cropId: string;
  activityDate: Date;
  status: ActivityStatus;
  priority: ActivityPriority;
  estimatedDuration?: string | null;
  actualDuration?: string | null;
  createdById: string;
  assignedTo: string[];
};
/**
 * only admin or super admin have permission to create activity
 * createdById and assignedTo must be valid
 *
 * @param params
 */
export const createActivity = async (params: ActivityParams) => {
  const { assignedTo, ...other } = params;

  const activity = await db.activity.create({
    data: {
      ...other,
      assignedTo: {
        createMany: {
          data: assignedTo.map((staffId) => {
            return {
              staffId,
            };
          }),
          skipDuplicates: true,
        },
      },
    },
  });
  return activity;
};

type ActivityUpdateParams = {
  name: string;
  description?: string | null;
  activityDate: Date;
  status: ActivityStatus;
  priority: ActivityPriority;
  estimatedDuration?: string | null;
  actualDuration?: string | null;
  assignedTo: string[];
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
  const { assignedTo, ...other } = params;

  const updatedActivity = await db.activity.update({
    where: { id },
    data: {
      ...other,
      assignedTo: {
        createMany: {
          data: assignedTo.map((staffId) => {
            return {
              staffId,
            };
          }),
          skipDuplicates: true,
        },
        deleteMany: {
          staffId: {
            notIn: assignedTo,
          },
        },
      },
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
  const deletedActivity = await db.activity.delete({
    where: {
      id,
    },
  });

  return deletedActivity;
};

/**
 *
 * @param id
 * @param status
 * 1. Update activity status to complete | cancelled
 * 2. Update equipment detail used in activity, equipment usages duration will be add to operating hour
 */
export const updateActivityStatus = async (
  id: string,
  status: "COMPLETED" | "CANCELLED"
) => {
  return await db.$transaction(async (ctx) => {
    const equipmentUseds = await ctx.equipmentUsage.findMany({
      where: { activityId: id },
      select: {
        equipmentDetailId: true,
        duration: true,
      },
    });
    const activity = await ctx.activity.update({
      where: { id },
      data: {
        status,
      },
    });

    const updateEquipmentDetailPromises = equipmentUseds.map((item) => {
      return ctx.equipmentDetail.update({
        where: { id: item.equipmentDetailId },
        data: {
          operatingHours: {
            increment: item.duration,
          },
          status: "AVAILABLE",
        },
      });
    });
    await Promise.all(updateEquipmentDetailPromises);
    return activity;
  });
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
  type?: "createdBy" | "assignedTo";
  cropId?: string;
};
export const getActivities = async ({
  filterNumber,
  filterString,
  orderBy,
  page = 1,
  query,
  type = "assignedTo",
  cropId,
}: ActivityQuery): Promise<PaginatedResponse<ActivityTable>> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    const [data, count] = await db.$transaction([
      db.activity.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          ...(cropId && {
            cropId,
          }),
          ...(type === "createdBy" && {
            createdById: currentStaff.id,
          }),
          ...(type === "assignedTo" && {
            assignedTo: {
              some: {
                staffId: currentStaff.id,
              },
            },
          }),
          name: {
            contains: query,
            mode: "insensitive",
          },

          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
        include: {
          assignedTo: {
            include: {
              staff: true,
            },
          },
          createdBy: true,
          crop: {
            select: {
              ...cropSelect,
              field: {
                select: {
                  ...fieldSelect,
                },
              },
              plant: {
                select: {
                  ...plantSelect,
                },
              },
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
          ...(cropId && {
            cropId,
          }),
          ...(type === "createdBy" && {
            createdById: currentStaff.id,
          }),
          ...(type === "assignedTo" && {
            assignedTo: {
              some: {
                staffId: currentStaff.id,
              },
            },
          }),
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

export const activitySelect = {
  id: true,
  name: true,
  status: true,
  priority: true,
  activityDate: true,
};
export const getActivitiesSelect = async ({
  staffId,
}: ActivitySelectQuery): Promise<ActivitySelectWithCropAndField[]> => {
  try {
    return await db.activity.findMany({
      where: {
        OR: [
          {
            assignedTo: {
              some: {
                staffId,
              },
            },
          },
          {
            createdById: staffId,
          },
        ],
        status: {
          in: ["NEW", "IN_PROGRESS", "PENDING"],
        },
      },
      select: {
        ...activitySelect,
        crop: {
          select: {
            ...cropSelect,
            field: {
              select: {
                ...fieldSelect,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};

export const getActivityById = async (
  activityId: string
): Promise<ActivityTable | null> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      return null;
    }
    return await db.activity.findUnique({
      where: {
        id: activityId,
        OR: [
          {
            createdById: currentStaff.id,
          },
          {
            assignedTo: {
              some: {
                staffId: currentStaff.id,
              },
            },
          },
        ],
      },
      include: {
        assignedTo: {
          include: {
            staff: true,
          },
        },
        createdBy: true,
        crop: {
          select: {
            ...cropSelect,
            field: {
              select: {
                ...fieldSelect,
              },
            },
            plant: {
              select: {
                ...plantSelect,
              },
            },
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

type ActivityAssignedParams = {
  activityId: string;
  assignedTo: string[];
};
export const upsertActivityAssigned = async (
  params: ActivityAssignedParams
) => {
  return await db.$transaction([
    db.activityAssigned.createMany({
      data: params.assignedTo.map((staffId) => {
        return {
          staffId,
          activityId: params.activityId,
        };
      }),
      skipDuplicates: true,
    }),
    db.activityAssigned.deleteMany({
      where: {
        staffId: {
          notIn: params.assignedTo,
        },
      },
    }),
  ]);
};

export const deleteActivityAssigned = async ({
  activityId,
  staffId,
}: {
  activityId: string;
  staffId: string;
}) => {
  return await db.activityAssigned.delete({
    where: {
      activityId_staffId: {
        activityId,
        staffId,
      },
    },
  });
};
export const getActivityAssignedStaffs = async (
  activityId: string
): Promise<Staff[]> => {
  try {
    const activityAssigned = await db.activityAssigned.findMany({
      where: {
        activityId,
      },
      include: {
        staff: true,
      },
    });
    return activityAssigned.map((item) => item.staff);
  } catch (error) {
    return [];
  }
};
