import { PrismaClient } from "@prisma/client";

// Normalizes DATABASE_URL (SSL, Neon pooler) before any Prisma use
import { DATABASE_URL } from "./env.js";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const options = {
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
  };

  if (DATABASE_URL) {
    options.datasources = {
      db: { url: DATABASE_URL }
    };
  }

  return new PrismaClient(options);
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client per process (critical for Neon: avoids duplicate pools).
// In dev, global survives nodemon reloads so connections are not leaked.
globalForPrisma.prisma = prisma;

export default prisma;
