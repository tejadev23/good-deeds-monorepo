import type { User } from "@repo/database";

declare global {
  namespace Express {
    interface Request {
      /** Set by `authenticate` when a valid token was sent. */
      user?: User;
    }
  }
}

export {};
