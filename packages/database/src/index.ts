import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

export * from "../generated/prisma/client";

/**
 * Creates a Prisma client backed by node-postgres. Apps create exactly one
 * client at startup and pass it around (see apps/api/src/lib/db.ts).
 */
export function createPrismaClient(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export type Database = ReturnType<typeof createPrismaClient>;
