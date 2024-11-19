import { getFieldById } from "@/services/fields";
import { getCurrentStaff } from "@/services/staffs";
import { auth } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";
import {
  canUpdateActivityStatus,
  canUpdateCropStatus,
  isAdmin,
  isSuperAdmin,
} from "./permission";
import { getCropById } from "@/services/crops";
import { getOnlyActivityById } from "@/services/activities";

export const checkRole = (role: StaffRole) => {
  const { sessionClaims } = auth();

  const currentRole = sessionClaims?.metadata.role;
  if (!currentRole) {
    return false;
  }

  return currentRole === role;
};

export const canGetField = async (fieldId: string) => {
  const { has, orgId } = auth();
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    return null;
  }
  const data = await getFieldById(fieldId);
  const canReadField =
    (has({ permission: "org:field:read" }) && data?.orgId === orgId) ||
    (isAdmin(currentStaff.role) && !data?.orgId) ||
    isSuperAdmin(currentStaff.role);
  if (!canReadField || !data) {
    return null;
  }
  return data;
};

export const canUpdateCrop = async (cropId: string) => {
  const { orgId } = auth();
  const crop = await getCropById(cropId);
  if (!crop) {
    return false;
  }
  const isSuperAdmin = checkRole("superadmin");
  return (
    canUpdateCropStatus(crop.status) &&
    (orgId === crop.field.orgId || isSuperAdmin)
  );
};
export const canUpdateActivity = async (
  cropId: string,
  activityId?: string
) => {
  const { orgId, orgRole } = auth();
  const crop = await getCropById(cropId);
  if (!crop || !canUpdateCropStatus(crop.status)) {
    return false;
  }
  if (activityId) {
    const activity = await getOnlyActivityById(activityId);
    if (!activity || !canUpdateActivityStatus(activity.status)) {
      return false;
    }
  }
  const isSuperAdmin = checkRole("superadmin");
  return (
    (orgId === crop.field.orgId && orgRole === "org:admin") || isSuperAdmin
  );
};
