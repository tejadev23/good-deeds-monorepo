import { createPrismaClient } from "@repo/database";
import { pino } from "pino";
import request from "supertest";
import { createApp } from "../src/app";
import { loadEnv } from "../src/config/env";
import type { TokenVerifier } from "../src/lib/auth-verifier";

/** Test tokens look like `test:<uid>:<email>` — no Firebase needed. */
const fakeVerifier: TokenVerifier = {
  async verify(token) {
    const [prefix, uid, email] = token.split(":");
    if (prefix !== "test" || !uid || !email) throw new Error("bad token");
    return { uid, email, emailVerified: true, name: uid };
  },
};

const env = loadEnv({
  NODE_ENV: "test",
  DATABASE_URL: process.env.TEST_DATABASE_URL ?? "postgresql://gooddeeds:gooddeeds@localhost:5432/gooddeeds_test",
  ADMIN_EMAILS: "admin@test.dev",
});
export const db = createPrismaClient(env.DATABASE_URL);
export const app = createApp({ env, db, logger: pino({ level: "silent" }), verifier: fakeVerifier });
export const api = () => request(app);

export async function resetDb() {
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  const list = tables.map((t) => `"${t.tablename}"`).join(", ");
  await db.$executeRawUnsafe(`TRUNCATE ${list} RESTART IDENTITY CASCADE`);
}

export interface TestUser {
  uid: string;
  username: string;
  auth: { Authorization: string };
}

/** Signs a person in and completes onboarding. */
export async function member(username: string, email = `${username}@test.dev`): Promise<TestUser> {
  const auth = { Authorization: `Bearer test:uid-${username}:${email}` };
  const res = await api().post("/v1/me/onboarding").set(auth).send({ username, name: username, interests: ["community"] });
  if (res.status !== 201) throw new Error(`onboarding failed: ${res.status} ${JSON.stringify(res.body)}`);
  return { uid: `uid-${username}`, username, auth };
}

export const today = () => new Date().toISOString().slice(0, 10);

export function deedBody(overrides: Record<string, unknown> = {}) {
  return {
    title: "Planted saplings by the lake",
    description: "Six of us planted twenty saplings along the east path this morning.",
    category: "environment",
    activityDate: today(),
    location: "Lakeside",
    ...overrides,
  };
}
