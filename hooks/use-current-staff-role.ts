import { useUser } from "@clerk/clerk-react";
import { StaffRole } from "@prisma/client";

export const useCurrentStaffRole = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn || !user) {
    return {
      isAdmin: false,
      isSuperAdmin: false,
      isFarmer: false,
      isOnlyAdmin: false,
      user: null,
    };
  }
  const isSuperAdmin = user.publicMetadata?.role === StaffRole.superadmin;
  const isAdmin = user.publicMetadata?.role === StaffRole.admin;
  const isFarmer = user.publicMetadata?.role === StaffRole.farmer;
  const isOnlyAdmin =
    isSuperAdmin || user.publicMetadata?.role === StaffRole.admin;
  return {
    isAdmin,
    isSuperAdmin,
    isFarmer,
    isOnlyAdmin,
    user,
  };
};
