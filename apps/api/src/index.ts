import { createPrismaClient } from "@repo/database";
import { pino } from "pino";
import { createApp } from "./app";
import { loadEnv } from "./config/env";
import { createFirebaseVerifier } from "./lib/auth-verifier";

const env = loadEnv();
const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  ...(env.NODE_ENV === "development" ? { transport: { target: "pino-pretty" } } : {}),
});
const db = createPrismaClient(env.DATABASE_URL);
const app = createApp({ env, db, logger, verifier: createFirebaseVerifier(env) });

const server = app.listen(env.PORT, () => {
  logger.info(`API listening on http://localhost:${env.PORT}`);
  if (env.FIREBASE_AUTH_EMULATOR_HOST) logger.info(`Using Firebase Auth emulator at ${env.FIREBASE_AUTH_EMULATOR_HOST}`);
});

function shutdown() {
  server.close(() => {
    void db.$disconnect().finally(() => process.exit(0));
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
