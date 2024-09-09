import { auth } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";

export const checkRole = (role: StaffRole) => {
  const { sessionClaims } = auth();
  const currentRole = sessionClaims?.metadata.role;
  if (!currentRole) {
    return false;
  }

  return currentRole === role;
};
export const isSuperAdmin = (role: StaffRole) => {
  return role === StaffRole.superadmin;
};
export const isAdmin = (role: StaffRole) => {
  return role === StaffRole.superadmin || role == StaffRole.admin;
};
export const isFarmer = (role: StaffRole) => {
  return role === StaffRole.farmer;
};
