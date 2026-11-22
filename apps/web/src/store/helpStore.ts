import { create } from "zustand";

import { services } from "@/services";
import type { HelpRequest, NewHelpRequestInput } from "@/types";

import type { LoadStatus } from "./types";

interface HelpState {
  requests: HelpRequest[];
  status: LoadStatus;
  load: () => Promise<void>;
  create: (userId: string, input: NewHelpRequestInput) => Promise<HelpRequest>;
  offer: (requestId: string, userId: string, message?: string) => Promise<void>;
  withdraw: (requestId: string, userId: string) => Promise<void>;
  setFulfilled: (requestId: string, userId: string, fulfilled: boolean) => Promise<void>;
}

export const useHelpStore = create<HelpState>((set, get) => {
  const replace = (updated: HelpRequest) => set({ requests: get().requests.map((r) => (r.id === updated.id ? updated : r)) });

  return {
    requests: [],
    status: "idle",

    load: async () => {
      set({ status: get().requests.length ? "ready" : "loading" });
      try {
        set({ requests: await services.help.list(), status: "ready" });
      } catch {
        set({ status: "error" });
      }
    },

    create: async (userId, input) => {
      const request = await services.help.create(userId, input);
      set({ requests: [request, ...get().requests] });
      return request;
    },

    offer: async (requestId, userId, message) => replace(await services.help.offer(requestId, userId, message)),
    withdraw: async (requestId, userId) => replace(await services.help.withdraw(requestId, userId)),
    setFulfilled: async (requestId, userId, fulfilled) => replace(await services.help.setFulfilled(requestId, userId, fulfilled)),
  };
});
