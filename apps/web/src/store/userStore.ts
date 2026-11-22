import { create } from "zustand";

import { services } from "@/services";
import type { Follow, User } from "@/types";

import type { LoadStatus } from "./types";

interface UserState {
  users: User[];
  follows: Follow[];
  status: LoadStatus;
  load: () => Promise<void>;
  setFollowing: (followerId: string, targetId: string, follow: boolean) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  follows: [],
  status: "idle",

  load: async () => {
    set({ status: "loading" });
    try {
      const [users, follows] = await Promise.all([services.users.list(), services.users.listFollows()]);
      set({ users, follows, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },

  setFollowing: async (followerId, targetId, follow) => {
    const previous = get().follows;
    const without = previous.filter((f) => !(f.followerId === followerId && f.followingId === targetId));
    // Optimistic update, rolled back if the service fails.
    set({ follows: follow ? [...without, { followerId, followingId: targetId, createdAt: new Date().toISOString() }] : without });
    try {
      if (follow) await services.users.follow(followerId, targetId);
      else await services.users.unfollow(followerId, targetId);
    } catch (error) {
      set({ follows: previous });
      throw error;
    }
  },
}));
