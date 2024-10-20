import { ActivityStatus, EquipmentStatus } from "@prisma/client";

export const canUpdateActivityUsage = (status: ActivityStatus) => {
  return status === "NEW" || status === "IN_PROGRESS";
};

export const canUpdateEquipmentUsage = (status: EquipmentStatus) => {
  return status === "AVAILABLE";
};
