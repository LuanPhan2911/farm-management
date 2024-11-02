import { getFieldById } from "@/services/fields";
import { getCurrentStaff } from "@/services/staffs";
import { auth } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";
import { isOnlyAdmin } from "./permission";

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
    isOnlyAdmin(currentStaff.role);
  if (!canReadField || !data) {
    return null;
  }
  return data;
};
