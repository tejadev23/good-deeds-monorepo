import { create } from "zustand";

import { services } from "@/services";
import type { CommunityActivity } from "@/types";

import type { LoadStatus } from "./types";

interface ActivityState {
  activities: CommunityActivity[];
  status: LoadStatus;
  load: () => Promise<void>;
  toggleJoin: (activityId: string, userId: string) => Promise<boolean>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  status: "idle",

  load: async () => {
    set({ status: get().activities.length ? "ready" : "loading" });
    try {
      set({ activities: await services.activities.list(), status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },

  toggleJoin: async (activityId, userId) => {
    const updated = await services.activities.toggleJoin(activityId, userId);
    set({ activities: get().activities.map((a) => (a.id === updated.id ? updated : a)) });
    return updated.participantIds.includes(userId);
  },
}));
