import { create } from "zustand";

import { services } from "@/services";
import type { Challenge } from "@/types";

import type { LoadStatus } from "./types";

interface ChallengeState {
  challenges: Challenge[];
  status: LoadStatus;
  load: () => Promise<void>;
  setParticipation: (challengeId: string, userId: string, join: boolean) => Promise<void>;
  /** Mirrors the service's auto-join when a deed is logged for a challenge. */
  markJoined: (challengeId: string, userId: string) => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  status: "idle",

  load: async () => {
    set({ status: get().challenges.length ? "ready" : "loading" });
    try {
      set({ challenges: await services.challenges.list(), status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },

  setParticipation: async (challengeId, userId, join) => {
    const updated = await services.challenges.setParticipation(challengeId, userId, join);
    set({ challenges: get().challenges.map((c) => (c.id === updated.id ? updated : c)) });
  },

  markJoined: (challengeId, userId) => {
    set({
      challenges: get().challenges.map((c) =>
        c.id === challengeId && !c.participantIds.includes(userId) ? { ...c, participantIds: [...c.participantIds, userId] } : c,
      ),
    });
  },
}));
