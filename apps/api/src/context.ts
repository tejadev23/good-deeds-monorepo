import type { Database } from "@repo/database";
import type { Logger } from "pino";
import type { Env } from "./config/env";
import type { TokenVerifier } from "./lib/auth-verifier";

/** Everything a request handler may depend on. Built once in index.ts (or per test). */
export interface AppContext {
  env: Env;
  db: Database;
  verifier: TokenVerifier;
  logger: Logger;
}
