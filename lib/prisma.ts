import { PrismaClient } from "@prisma/client";

// For Prisma 7.x with SQLite, we need to use the direct file-based approach
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const unavailablePrisma = new Proxy(
  {},
  {
    get() {
      throw new Error("Prisma client unavailable");
    },
  }
) as PrismaClient;

let prisma: PrismaClient;

try {
  prisma = globalForPrisma.prisma ?? createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} catch (error) {
  console.error("Prisma initialization failed:", error);
  prisma = unavailablePrisma;
}

export { prisma };
export default prisma;
