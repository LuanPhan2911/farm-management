import { Roles } from "@/types";
import { auth } from "@clerk/nextjs/server";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();
  const currentRole = sessionClaims?.metadata.role;
  if (!currentRole) {
    return false;
  }

  return currentRole === role;
};
