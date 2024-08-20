import { useAuth, useUser } from "@clerk/nextjs";

export const useRole = () => {
  const { user, isSignedIn } = useUser();
  if (!isSignedIn) {
    return {
      isAdmin: false,
      isSuperAdmin: false,
      isFarmer: false,
    };
  }
  const role = user.publicMetadata.role;
  const isSuperAdmin = role === "superadmin";
  const isAdmin = role === "admin";
  const isFarmer = role === "farmer";
  return { isAdmin, isSuperAdmin, isFarmer };
};
