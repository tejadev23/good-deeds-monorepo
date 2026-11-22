"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { errorMessage } from "@/services";
import { useHelpStore } from "@/store/helpStore";
import type { DeedCategory, HelpRequest } from "@/types";

import { useCurrentUserId } from "./useCurrentUser";

export type HelpFilter = "open" | "mine" | "helping" | "fulfilled";

export function useHelpBoard(filter: HelpFilter, category: DeedCategory | "all") {
  const viewerId = useCurrentUserId();
  const { requests, status } = useHelpStore();

  const items = useMemo(() => {
    const byFilter = requests.filter((r) => {
      if (filter === "open") return r.status === "open";
      if (filter === "fulfilled") return r.status === "fulfilled";
      if (filter === "mine") return r.authorId === viewerId;
      return r.offers.some((o) => o.userId === viewerId);
    });
    const byCategory = category === "all" ? byFilter : byFilter.filter((r) => r.category === category);
    // Soonest deadline first for open requests.
    return filter === "open" ? [...byCategory].sort((a, b) => a.neededBy.localeCompare(b.neededBy)) : byCategory;
  }, [requests, filter, category, viewerId]);

  const counts = useMemo(
    () => ({
      open: requests.filter((r) => r.status === "open").length,
      mine: requests.filter((r) => r.authorId === viewerId).length,
      helping: requests.filter((r) => r.offers.some((o) => o.userId === viewerId)).length,
      fulfilled: requests.filter((r) => r.status === "fulfilled").length,
    }),
    [requests, viewerId],
  );

  return { items, counts, status };
}

/** Open requests from others that the viewer hasn't answered yet (for the feed teaser). */
export function useHelpSuggestions(limit = 2): HelpRequest[] {
  const viewerId = useCurrentUserId();
  const requests = useHelpStore((s) => s.requests);
  return useMemo(
    () =>
      requests
        .filter((r) => r.status === "open" && r.authorId !== viewerId && !r.offers.some((o) => o.userId === viewerId))
        .sort((a, b) => a.neededBy.localeCompare(b.neededBy))
        .slice(0, limit),
    [requests, viewerId, limit],
  );
}

export function useHelpActions(request: HelpRequest) {
  const viewerId = useCurrentUserId();
  const { offer, withdraw, setFulfilled } = useHelpStore();
  const [pending, setPending] = useState(false);

  const isAuthor = request.authorId === viewerId;
  const hasOffered = request.offers.some((o) => o.userId === viewerId);
  const isOpen = request.status === "open";

  const run = async (action: () => Promise<void>, success: string, description?: string) => {
    if (!viewerId) return false;
    setPending(true);
    try {
      await action();
      toast.success(success, { description });
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    } finally {
      setPending(false);
    }
  };

  return {
    isAuthor,
    hasOffered,
    isOpen,
    pending,
    offerHelp: (message?: string) =>
      run(() => offer(request.id, viewerId!, message), "Thank you! 🤝", "We've let them know you can help. They may reach out to coordinate."),
    withdrawOffer: () => run(() => withdraw(request.id, viewerId!), "Offer withdrawn"),
    toggleFulfilled: () =>
      run(() => setFulfilled(request.id, viewerId!, isOpen), isOpen ? "Marked as fulfilled 🎉" : "Request reopened", isOpen ? "Thank the people who helped!" : undefined),
  };
}
