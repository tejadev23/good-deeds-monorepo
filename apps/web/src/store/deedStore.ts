import { create } from "zustand";

import { services } from "@/services";
import type { Comment, Deed, NewDeedInput } from "@/types";

import type { LoadStatus } from "./types";

interface DeedState {
  deeds: Deed[];
  comments: Comment[];
  savedIds: string[];
  status: LoadStatus;
  load: (viewerId: string) => Promise<void>;
  toggleLike: (deedId: string, userId: string) => Promise<void>;
  toggleSave: (deedId: string, userId: string) => Promise<boolean>;
  addComment: (deedId: string, userId: string, text: string) => Promise<void>;
  createDeed: (userId: string, input: NewDeedInput) => Promise<Deed>;
  removeDeed: (deedId: string, userId: string) => Promise<void>;
}

const replaceDeed = (deeds: Deed[], next: Deed) => deeds.map((d) => (d.id === next.id ? next : d));

export const useDeedStore = create<DeedState>((set, get) => ({
  deeds: [],
  comments: [],
  savedIds: [],
  status: "idle",

  load: async (viewerId) => {
    set({ status: get().deeds.length ? "ready" : "loading" });
    try {
      const [deeds, comments, savedIds] = await Promise.all([
        services.deeds.list(),
        services.deeds.listComments(),
        services.deeds.listSaved(viewerId),
      ]);
      set({ deeds, comments, savedIds, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },

  toggleLike: async (deedId, userId) => {
    const previous = get().deeds;
    const deed = previous.find((d) => d.id === deedId);
    if (!deed) return;
    const liked = deed.likedBy.includes(userId);
    const optimistic = { ...deed, likedBy: liked ? deed.likedBy.filter((id) => id !== userId) : [...deed.likedBy, userId] };
    set({ deeds: replaceDeed(previous, optimistic) });
    try {
      const updated = await services.deeds.toggleLike(deedId, userId);
      set({ deeds: replaceDeed(get().deeds, updated) });
    } catch (error) {
      set({ deeds: previous });
      throw error;
    }
  },

  toggleSave: async (deedId, userId) => {
    const previous = get().savedIds;
    const willSave = !previous.includes(deedId);
    set({ savedIds: willSave ? [deedId, ...previous] : previous.filter((id) => id !== deedId) });
    try {
      set({ savedIds: await services.deeds.toggleSave(deedId, userId) });
      return willSave;
    } catch (error) {
      set({ savedIds: previous });
      throw error;
    }
  },

  addComment: async (deedId, userId, text) => {
    const comment = await services.deeds.addComment(deedId, userId, text);
    set({ comments: [...get().comments, comment] });
  },

  createDeed: async (userId, input) => {
    const deed = await services.deeds.create(userId, input);
    set({ deeds: [deed, ...get().deeds] });
    return deed;
  },

  removeDeed: async (deedId, userId) => {
    await services.deeds.remove(deedId, userId);
    set({
      deeds: get().deeds.filter((d) => d.id !== deedId),
      comments: get().comments.filter((c) => c.deedId !== deedId),
      savedIds: get().savedIds.filter((id) => id !== deedId),
    });
  },
}));
