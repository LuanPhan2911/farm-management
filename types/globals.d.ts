export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Role;
      address?: string;
      phone?: string;
    };
  }
}
