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
