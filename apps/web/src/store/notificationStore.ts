import { create } from "zustand";

import { services } from "@/services";
import type { AppNotification } from "@/types";

import type { LoadStatus } from "./types";

interface NotificationState {
  items: AppNotification[];
  status: LoadStatus;
  load: (userId: string) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  status: "idle",

  load: async (userId) => {
    set({ status: get().items.length ? "ready" : "loading" });
    try {
      set({ items: await services.notifications.list(userId), status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },

  markRead: async (id) => {
    set({ items: get().items.map((n) => (n.id === id ? { ...n, read: true } : n)) });
    await services.notifications.markRead(id);
  },

  markAllRead: async (userId) => {
    set({ items: get().items.map((n) => ({ ...n, read: true })) });
    await services.notifications.markAllRead(userId);
  },
}));
