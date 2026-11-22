import { execSync } from "node:child_process";
import path from "node:path";

/**
 * Resets the test database to the latest migrations before the run.
 * Uses TEST_DATABASE_URL (defaults to the gooddeeds_test db that docker-compose creates).
 * Set TEST_SKIP_MIGRATE=1 if you manage the test schema yourself.
 */
export default function setup() {
  process.env.TEST_DATABASE_URL ??= "postgresql://gooddeeds:gooddeeds@localhost:5432/gooddeeds_test";
  if (process.env.TEST_SKIP_MIGRATE === "1") return;
  execSync("pnpm exec prisma migrate reset --force", {
    cwd: path.resolve(import.meta.dirname, "../../../packages/database"),
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    stdio: "inherit",
  });
}
