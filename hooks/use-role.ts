"use client";

import { StaffRole } from "@prisma/client";

export const useRole = (role?: StaffRole) => {
  const isSuperAdmin = role === StaffRole.superadmin;
  const isAdmin = role === StaffRole.admin || isSuperAdmin;
  const isFarmer = role === StaffRole.farmer;
  return { isAdmin, isSuperAdmin, isFarmer };
};
