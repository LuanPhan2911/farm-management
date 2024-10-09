export {};

import { StaffRole } from "@prisma/client";
import { Roles } from ".";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: StaffRole;
      address?: string;
      phone?: string;
      isPublicFile?: boolean;
    };
  }
}
