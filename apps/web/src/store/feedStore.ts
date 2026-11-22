import { create } from "zustand";

import type { DeedCategory } from "@/types";

interface FeedFilterState {
  category: DeedCategory | "all";
  scope: "all" | "following";
  setCategory: (category: DeedCategory | "all") => void;
  setScope: (scope: "all" | "following") => void;
  reset: () => void;
}

/** UI filter state for the community feed (kept across navigation). */
export const useFeedStore = create<FeedFilterState>((set) => ({
  category: "all",
  scope: "all",
  setCategory: (category) => set({ category }),
  setScope: (scope) => set({ scope }),
  reset: () => set({ category: "all", scope: "all" }),
}));
