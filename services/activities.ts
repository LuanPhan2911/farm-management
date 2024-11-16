import { db } from "@/lib/db";
import {
  ActivityPriorityCount,
  ActivityStatusCount,
  ActivityTable,
  PaginatedResponse,
  ActivitySelectWithCrop,
  ActivityWithCountUsages,
  ActivityWithCost,
} from "@/types";
import { ActivityPriority, ActivityStatus } from "@prisma/client";
import { LIMIT } from "@/configs/paginationConfig";
import {
  getObjectFilterNumber,
  getObjectFilterString,
  getObjectSortOrder,
} from "@/lib/utils";
import { getCurrentStaff } from "./staffs";
import { cropSelect } from "./crops";
import { isSuperAdmin } from "@/lib/permission";
import { ActivityUpdateStatusCompletedError } from "@/errors";
import _ from "lodash";

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
  const assignedStaffs = await db.staff.findMany({
    where: {
      id: {
        in: assignedTo,
      },
    },
  });

  const activity = await db.activity.create({
    data: {
      ...other,
      createdById: currentStaff.id,
      assignedTo: {
        createMany: {
          data: assignedStaffs.map(({ id, baseHourlyWage }) => {
            return {
              staffId: id,
              hourlyWage: baseHourlyWage,
              actualWork: params.actualDuration,
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

  const assignedStaffs = await db.staff.findMany({
    where: {
      id: {
        in: assignedTo,
      },
    },
  });
  const updatedActivity = await db.activity.update({
    where: { id },
    data: {
      ...other,
      assignedTo: {
        createMany: {
          data: assignedStaffs.map(({ id, baseHourlyWage }) => {
            return {
              staffId: id,
              hourlyWage: baseHourlyWage,
              actualWork: params.actualDuration,
            };
          }),
          skipDuplicates: true,
        },
        updateMany: {
          data: {
            actualWork: params.actualDuration,
          },
          where: {
            actualWork: null,
          },
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
 * 1. Update activity status to complete
 * 2. Update equipment detail used in activity, equipment usages duration will be add to operating hour
 * 3. Update activity actual duration when null
 * 4. Update assigned staff when no actual work
 */
export const updateActivityStatusComplete = async (
  id: string,
  status: "COMPLETED"
) => {
  const activity = await db.activity.findUnique({
    where: {
      id,
      status: {
        not: "COMPLETED",
      },
      assignedTo: {
        none: {
          hourlyWage: null,
        },
      },
    },
  });
  if (!activity) {
    throw new ActivityUpdateStatusCompletedError();
  }

  return await db.$transaction(async (ctx) => {
    //update equipment detail operating hour
    const equipmentUseds = await ctx.equipmentUsage.findMany({
      where: { activityId: id },
      select: {
        equipmentDetailId: true,
        duration: true,
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

    const actualDuration =
      activity.actualDuration ?? activity.estimatedDuration;

    const updateAssignedStaff = await ctx.activityAssigned.updateMany({
      data: {
        actualWork: actualDuration,
      },
      where: {
        activityId: id,
        actualWork: null,
      },
    });
    // get total staff cost, material cost, equipment cost

    const assignedStaffs = await ctx.activityAssigned.findMany({
      where: {
        activityId: id,
      },
      select: {
        actualWork: true,
        hourlyWage: true,
      },
    });
    const equipmentUsages = await ctx.equipmentUsage.findMany({
      where: {
        activityId: id,
      },
      select: {
        fuelConsumption: true,
        fuelPrice: true,
        rentalPrice: true,
      },
    });
    const materialUsages = await ctx.materialUsage.findMany({
      where: {
        activityId: id,
      },
      select: {
        actualPrice: true,
        quantityUsed: true,
      },
    });
    const totalStaffCost = _.sumBy(assignedStaffs, (item) => {
      if (item.actualWork === null || item.hourlyWage === null) {
        return 0;
      }
      return item.actualWork * item.hourlyWage;
    });
    const totalMaterialCost = _.sumBy(materialUsages, (item) => {
      if (item.actualPrice === null) {
        return 0;
      }
      return item.actualPrice * item.quantityUsed;
    });

    const totalEquipmentCost = _.sumBy(equipmentUsages, (item) => {
      const { fuelConsumption, fuelPrice } = item;
      const rentalPrice = item.rentalPrice ?? 0;
      if (fuelConsumption === null || fuelPrice === null) {
        return rentalPrice;
      }
      return fuelConsumption * fuelPrice + rentalPrice;
    });

    //update activity actual duration
    const updatedActivity = await ctx.activity.update({
      where: { id },
      data: {
        status,
        actualDuration,
        totalEquipmentCost,
        totalMaterialCost,
        totalStaffCost,
      },
    });

    return updatedActivity;
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
  cropId?: string;
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
export const getActivitiesSelect = async (
  id?: string
): Promise<ActivitySelectWithCrop[]> => {
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
          {
            id,
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

type ActivityCropQuery = {
  cropId: string;
  query?: string;
  orderBy?: string;
  filterString?: string;
  filterNumber?: string;
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
}: ActivityCropQuery): Promise<ActivityWithCost[]> => {
  try {
    const currentStaff = await getCurrentStaff();
    if (!currentStaff) {
      throw new Error("Unauthorized");
    }
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

      return {
        ...item,
        actualCost,
      };
    });
    return dataWithCost;
  } catch (error) {
    return [];
  }
};
