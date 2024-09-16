import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}
const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};
export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
