import { User } from "@clerk/nextjs/server";
import {
  ActivityStatus,
  EquipmentStatus,
  Staff,
  StaffRole,
} from "@prisma/client";
export const isSuperAdmin = (role: StaffRole) => {
  return role === StaffRole.superadmin;
};
export const isOnlyAdmin = (role: StaffRole) => {
  return role === StaffRole.superadmin || role == StaffRole.admin;
};
export const isAdmin = (role: StaffRole) => {
  return role == StaffRole.admin;
};
export const isFarmer = (role: StaffRole) => {
  return role === StaffRole.farmer;
};

export const canUpdateActivityStatus = (status: ActivityStatus) => {
  return status === "NEW" || status === "IN_PROGRESS" || status === "PENDING";
};

export const canUpdateEquipmentUsage = (status: EquipmentStatus) => {
  return status === "AVAILABLE";
};

export const canCreateActivity = (role: StaffRole) => isOnlyAdmin(role);

export const canStaffUpdateActivity = ({
  assignedToId,
  createdById,
  currentStaff,
}: {
  createdById: string;
  assignedToId: string;
  currentStaff: Staff;
}) => {
  const isCreatedBy = currentStaff.id === createdById;
  const isAssignedTo = currentStaff.id === assignedToId;
  return isCreatedBy || isAssignedTo || isSuperAdmin(currentStaff.role);
};
