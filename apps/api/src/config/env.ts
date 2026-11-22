import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().default(4100),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((value) => value.split(",").map((origin) => origin.trim()).filter(Boolean)),
  FIREBASE_PROJECT_ID: z.string().default("demo-good-deeds"),
  FIREBASE_AUTH_EMULATOR_HOST: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_BASE64: z.string().optional(),
  ADMIN_EMAILS: z
    .string()
    .default("")
    .transform((value) => value.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean)),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
  }
  return parsed.data;
}
