import { ActivityExistError } from "@/errors";
import { db } from "@/lib/db";
import {
  StaffWithSalaryAndActivity,
  StaffWithSalary,
  SalaryChart,
} from "@/types";
import { Staff } from "@prisma/client";
import { activitySelect } from "./activities";
import _ from "lodash";
import {
  addMonths,
  eachMonthOfInterval,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { checkRole } from "@/lib/role";
import { getOrganizationMembership } from "./organizations";

type ActivityAssignedParams = {
  activityId: string;
  assignedTo: string[];
};
export const upsertActivityAssigned = async (
  params: ActivityAssignedParams
) => {
  const { activityId, assignedTo } = params;

  if (!assignedTo.length) {
    return await db.activityAssigned.deleteMany({
      where: {
        activityId,
      },
    });
  }

  const activity = await db.activity.findUnique({
    where: {
      id: activityId,
      status: {
        not: "COMPLETED",
      },
    },
  });
  if (!activity) {
    throw new ActivityExistError();
  }
  const assignedStaffs = await db.staff.findMany({
    where: {
      id: { in: assignedTo },
    },
  });
  return await db.$transaction([
    db.activityAssigned.createMany({
      data: assignedStaffs.map((staff) => {
        return {
          staffId: staff.id,
          activityId: activityId,
          hourlyWage: staff.baseHourlyWage,
          actualWork: activity.actualDuration,
        };
      }),
      skipDuplicates: true,
    }),
    db.activityAssigned.updateMany({
      data: {
        actualWork: activity.actualDuration,
      },
      where: {
        activityId,
        actualWork: null,
      },
    }),
    db.activityAssigned.deleteMany({
      where: {
        staffId: {
          notIn: assignedTo,
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
): Promise<StaffWithSalaryAndActivity[]> => {
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

    const activityAssignedWithCost: StaffWithSalaryAndActivity[] =
      activityAssigned.map((item) => {
        if (item.actualWork == null || item.hourlyWage === null) {
          return {
            ...item,
            actualCost: 0,
          };
        }
        return {
          ...item,
          actualCost: item.actualWork * item.hourlyWage,
        };
      });
    return activityAssignedWithCost;
  } catch (error) {
    return [];
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

type StaffSalaryQuery = {
  begin?: Date;
  end?: Date;
  query?: string;
  orgId?: string | null;
};
export const getStaffSalaries = async ({
  begin,
  end,
  query,
  orgId,
}: StaffSalaryQuery): Promise<StaffWithSalary[]> => {
  try {
    if (!begin || !end) {
      throw new Error("Invalid date query");
    }

    let staffExternalIds;
    const isSuperAdmin = checkRole("superadmin");
    if (!isSuperAdmin && !orgId) {
      throw new Error("Only SuperAdmin get staff without org id");
    }
    if (orgId) {
      const staffInOrg = await getOrganizationMembership({
        orgId: orgId,
      });

      staffExternalIds = staffInOrg
        .map((item) => item.publicUserData?.userId)
        .filter((item) => item !== undefined);
    }

    const staffs = await db.staff.findMany({
      where: {
        ...(staffExternalIds && {
          externalId: {
            in: staffExternalIds,
          },
        }),
        activityAssigned: {
          some: {
            activity: {
              status: "COMPLETED",
              activityDate: {
                gte: begin,
                lte: end,
              },
            },
          },
        },

        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        activityAssigned: {
          include: {
            activity: {
              select: {
                ...activitySelect,
              },
            },
          },
        },
        _count: {
          select: {
            activityAssigned: true,
          },
        },
      },
    });
    const staffsWithSalaries = staffs.map((item) => {
      return {
        ...item,
        salary: _.sumBy(item.activityAssigned, (assignedStaff) => {
          const { actualWork, hourlyWage, activity } = assignedStaff;
          if (
            actualWork === null ||
            hourlyWage === null ||
            activity.status !== "COMPLETED"
          ) {
            return 0;
          }
          return actualWork * hourlyWage;
        }),
        hourlyWork: _.sumBy(item.activityAssigned, (assignedStaff) => {
          if (
            assignedStaff.actualWork === null ||
            assignedStaff.activity.status !== "COMPLETED"
          ) {
            return 0;
          }
          return assignedStaff.actualWork;
        }),
      };
    });

    return staffsWithSalaries;
  } catch (error) {
    return [];
  }
};

type StaffSalaryActivityQuery = {
  begin?: Date;
  end?: Date;
  query?: string;
  staffId: string;
};
export const getStaffSalaryByStaffId = async ({
  staffId,
  begin,
  end,
  query,
}: StaffSalaryActivityQuery): Promise<StaffWithSalaryAndActivity[]> => {
  try {
    if (!begin || !end) {
      throw new Error("Invalid date query");
    }
    const activityAssigned = await db.activityAssigned.findMany({
      where: {
        staffId,
        activity: {
          activityDate: {
            gte: begin,
            lte: end,
          },
          status: "COMPLETED",
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      include: {
        activity: {
          select: {
            ...activitySelect,
          },
        },

        staff: true,
      },
      orderBy: [
        {
          activity: {
            activityDate: "desc",
          },
        },
      ],
    });
    const activityAssignedWithCost: StaffWithSalaryAndActivity[] =
      activityAssigned.map((item) => {
        if (item.actualWork === null || item.hourlyWage === null) {
          return {
            ...item,
            actualCost: 0,
          };
        }
        return {
          ...item,
          actualCost: item.actualWork * item.hourlyWage,
        };
      });
    return activityAssignedWithCost;
  } catch (error) {
    return [];
  }
};

export const getStaffSalariesChart = async (orgId?: string | null) => {
  try {
    const months = eachMonthOfInterval({
      start: addMonths(new Date(), -2),
      end: new Date(),
    });

    const staffSalaryEachMonths = await Promise.all(
      months.map((month) => {
        return getStaffSalaries({
          begin: startOfMonth(month),
          end: endOfMonth(month),
          orgId,
        });
      })
    );
    const salaryCharts: SalaryChart[] = staffSalaryEachMonths.map(
      (staffSalary, index) => {
        return {
          month: months[index],
          totalSalary: _.sumBy(staffSalary, (item) => item.salary),
          totalHourlyWork: _.sumBy(staffSalary, (item) => item.hourlyWork),
        };
      }
    );
    return salaryCharts;
  } catch (error) {
    return [];
  }
};

export const getStaffSalaryChartByStaffId = async (staffId: string) => {
  try {
    const months = eachMonthOfInterval({
      start: addMonths(new Date(), -2),
      end: new Date(),
    });

    const staffSalaryEachMonths = await Promise.all(
      months.map((month) => {
        return getStaffSalaryByStaffId({
          staffId,
          begin: startOfMonth(month),
          end: endOfMonth(month),
        });
      })
    );

    const salaryCharts: SalaryChart[] = staffSalaryEachMonths.map(
      (item, index) => {
        return {
          month: months[index],
          totalSalary: _.sumBy(item, (staff) => staff.actualCost),
          totalHourlyWork: _.sumBy(item, (staff) => {
            return staff.actualWork !== null &&
              staff.activity.status === "COMPLETED"
              ? staff.actualWork
              : 0;
          }),
        };
      }
    );
    return salaryCharts;
  } catch (error) {
    return [];
  }
};
