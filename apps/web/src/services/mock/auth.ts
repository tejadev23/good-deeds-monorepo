import { DEMO_ACCOUNTS } from "@/config/demo-accounts";

import type { AuthService } from "../contracts";
import { ServiceError } from "../errors";
import { getDb, latency, readSession, writeSession } from "./storage";

/** Local, demo-only credential check. Never use as production auth. */
export const mockAuthService: AuthService = {
  async login(email, password) {
    await latency(350, 600);
    const account = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!account || account.password !== password) {
      throw new ServiceError("That email and password don't match a demo account.", "INVALID_CREDENTIALS");
    }
    const user = getDb().users.find((u) => u.id === account.userId);
    if (!user) throw new ServiceError("Demo profile not found. Try resetting the demo data.", "NOT_FOUND");
    writeSession(user.id);
    return user;
  },

  async logout() {
    writeSession(null);
  },

  async restoreSession() {
    const userId = readSession();
    if (!userId) return null;
    return getDb().users.some((u) => u.id === userId) ? userId : null;
  },
};
