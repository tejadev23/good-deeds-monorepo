import { create } from "zustand";

import { services } from "@/services";

type SessionStatus = "checking" | "authenticated" | "anonymous";

interface SessionState {
  status: SessionStatus;
  userId: string | null;
  restore: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: "checking",
  userId: null,

  restore: async () => {
    const userId = await services.auth.restoreSession();
    set({ userId, status: userId ? "authenticated" : "anonymous" });
  },

  login: async (email, password) => {
    const user = await services.auth.login(email, password);
    set({ userId: user.id, status: "authenticated" });
  },

  logout: async () => {
    await services.auth.logout();
    set({ userId: null, status: "anonymous" });
  },
}));
