import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // `prisma generate` doesn't need a database, so don't fail when it's unset (e.g. in CI builds).
  datasource: { url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/unset" },
});
