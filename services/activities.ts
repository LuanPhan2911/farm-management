import { db } from "@/lib/db";
import {
  ActivityPriorityCount,
  ActivityStatusCount,
  ActivityTable,
  PaginatedResponse,
  ActivityAssignedStaffWithActivityAndCost,
  ActivitySelectWithCrop,
  ActivityWithCountUsages,
  ActivityWithTotalCost,
  ActivityWithCost,
} from "@/types";
import { ActivityPriority, ActivityStatus, Staff } from "@prisma/client";
import { LIMIT } from "@/configs/paginationConfig";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import { getCurrentStaff } from "./staffs";
import { cropSelect } from "./crops";
import { getMaterialUsagesByActivity } from "./material-usages";
import { getEquipmentUsagesByActivity } from "./equipment-usages";
import { isSuperAdmin } from "@/lib/permission";

type ActivityParams = {
  name: string;
  description?: string | null;
  cropId: string;
  activityDate: Date;
  status: ActivityStatus;
  priority: ActivityPriority;
  estimatedDuration: number;
  actualDuration?: number | null;
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
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    throw new Error("Unauthorized");
  }
  const activity = await db.activity.create({
    data: {
      ...other,
      createdById: currentStaff.id,
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
  estimatedDuration: number;
  actualDuration?: number | null;
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
  const { totalCost: totalStaffCost } = await getActivityAssignedStaffs(id);
  const { totalCost: totalMaterialCost } = await getMaterialUsagesByActivity({
    activityId: id,
  });
  const { totalCost: totalEquipmentCost } = await getEquipmentUsagesByActivity({
    activityId: id,
  });

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
        totalEquipmentCost,
        totalMaterialCost,
        totalStaffCost,
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

type ActivityQuery = {
  page?: number;
  query?: string;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
  type?: string;
  begin?: Date;
  end?: Date;
};
export const getActivities = async ({
  filterNumber,
  filterString,
  orderBy,
  page = 1,
  query,
  type = "assignedTo",
  begin,
  end,
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
          activityDate: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },
          name: {
            contains: query,
            mode: "insensitive",
          },
          crop: {
            status: {
              not: "FINISH",
            },
          },
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
          ...(filterString && getObjectFilterString(filterString)),
          ...(filterNumber && getObjectFilterNumber(filterNumber)),
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
        include: {
          createdBy: true,
          crop: {
            select: {
              ...cropSelect,
            },
          },
          assignedTo: {
            include: {
              staff: true,
            },
          },
        },
      }),
      db.activity.count({
        where: {
          activityDate: {
            ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
            ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
          },
          name: {
            contains: query,
            mode: "insensitive",
          },
          crop: {
            status: {
              not: "FINISH",
            },
          },
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

type ActivityCropQuery = {
  cropId: string;
  query?: string;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
  type?: string;
  begin?: Date;
  end?: Date;
};
export const getActivitiesByCrop = async ({
  filterNumber,
  filterString,
  orderBy,
  query,
  cropId,
  begin,
  end,
}: ActivityCropQuery): Promise<ActivityWithTotalCost> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    let totalCost: number = 0;
    const data = await db.activity.findMany({
      where: {
        cropId,
        activityDate: {
          ...(begin && { gte: begin }), // Include 'gte' (greater than or equal) if 'begin' is provided
          ...(end && { lte: end }), // Include 'lte' (less than or equal) if 'end' is provided
        },
        name: {
          contains: query,
          mode: "insensitive",
        },

        ...(filterString && getObjectFilterString(filterString)),
        ...(filterNumber && getObjectFilterNumber(filterNumber)),
      },

      orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
    });
    const dataWithCost: ActivityWithCost[] = data.map((item) => {
      let actualCost: number = 0;
      if (item.totalEquipmentCost != null) {
        actualCost += item.totalEquipmentCost;
      }
      if (item.totalMaterialCost != null) {
        actualCost += item.totalMaterialCost;
      }
      if (item.totalStaffCost != null) {
        actualCost += item.totalStaffCost;
      }
      totalCost += actualCost;
      return {
        ...item,
        actualCost,
      };
    });
    return {
      data: dataWithCost,
      totalCost,
    };
  } catch (error) {
    return {
      data: [],
      totalCost: 0,
    };
  }
};
export const activitySelect = {
  id: true,
  name: true,
  status: true,
  priority: true,
  activityDate: true,
  estimatedDuration: true,
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
        ...(!isSuperAdmin(currentStaff.role) && {
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
        }),
        status: {
          in: ["NEW", "PENDING", "IN_PROGRESS"],
        },
      },
      include: {
        createdBy: true,
        crop: {
          select: {
            ...cropSelect,
          },
        },
        assignedTo: {
          include: {
            staff: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const getOnlyActivityById = async (id: string) => {
  return await db.activity.findUnique({
    where: {
      id,
    },
  });
};

export const getActivityByIdWithCountUsage = async (
  id: string
): Promise<ActivityWithCountUsages | null> => {
  try {
    return await db.activity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            assignedTo: true,
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
export const getActivitiesSelect = async (): Promise<
  ActivitySelectWithCrop[]
> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    return await db.activity.findMany({
      where: {
        OR: [
          {
            assignedTo: {
              some: {
                staffId: currentStaff.id,
              },
            },
          },
          {
            createdById: currentStaff.id,
          },
        ],
        crop: {
          status: {
            not: "FINISH",
          },
        },
        status: {
          in: ["NEW", "IN_PROGRESS", "PENDING"],
        },
      },
      select: {
        ...activitySelect,
        crop: {
          select: {
            ...cropSelect,
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};
type ActivityCountQuery = {
  begin?: Date;
  end?: Date;
  cropId?: string;
};
export const getCountActivityStatus = async ({
  begin,
  end,
  cropId,
}: ActivityCountQuery): Promise<ActivityStatusCount[]> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    const result = await db.activity.groupBy({
      by: "status",
      where: {
        ...(cropId && {
          cropId,
        }),
        OR: [
          { createdById: currentStaff.id },
          {
            assignedTo: {
              some: {
                staffId: currentStaff.id,
              },
            },
          },
        ],
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
  cropId,
}: ActivityCountQuery): Promise<ActivityPriorityCount[]> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
    const result = await db.activity.groupBy({
      by: "priority",
      where: {
        ...(cropId && {
          cropId,
        }),
        OR: [
          { createdById: currentStaff.id },
          {
            assignedTo: {
              some: {
                staffId: currentStaff.id,
              },
            },
          },
        ],
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

export const getActivityAssignedStaffsSelect = async (
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
export const getActivityAssignedStaffs = async (
  activityId: string
): Promise<ActivityAssignedStaffWithActivityAndCost> => {
  try {
    const activityAssigned = await db.activityAssigned.findMany({
      where: {
        activityId,
      },
      include: {
        staff: true,
        activity: {
          select: {
            ...activitySelect,
          },
        },
      },
    });
    let totalCost: number = 0;
    const activityAssignedWithCost = activityAssigned.map((item) => {
      if (item.actualWork !== null && item.hourlyWage !== null) {
        totalCost += item.actualWork * item.hourlyWage;
        return {
          ...item,
          actualCost: item.actualWork * item.hourlyWage,
        };
      }
      return {
        ...item,
        actualCost: null,
      };
    });

    return {
      data: activityAssignedWithCost,
      totalCost,
    };
  } catch (error) {
    return {
      data: [],
      totalCost: 0,
    };
  }
};

type ActivityAssignedUpdateParams = {
  actualWork?: number | null;
  hourlyWage?: number | null;
};
export const updateActivityAssigned = async (
  id: string,
  params: ActivityAssignedUpdateParams
) => {
  return await db.activityAssigned.update({
    where: { id },
    data: {
      ...params,
    },
  });
};
