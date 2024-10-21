import {
  ActivityStatus,
  EquipmentStatus,
  Staff,
  StaffRole,
} from "@prisma/client";
import { isSuperAdmin } from "./role";

export const canUpdateActivityStatus = (status: ActivityStatus) => {
  return status === "NEW" || status === "IN_PROGRESS" || status === "PENDING";
};

export const canUpdateEquipmentUsage = (status: EquipmentStatus) => {
  return status === "AVAILABLE";
};

export const canCreateActivity = (role: StaffRole) => {
  return role === "superadmin" || role === "admin";
};

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
