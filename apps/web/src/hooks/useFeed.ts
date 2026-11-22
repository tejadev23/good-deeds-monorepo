"use client";

import { useMemo } from "react";

import { filterDeeds, followingIds } from "@/lib/selectors";
import { useDeedStore } from "@/store/deedStore";
import { useFeedStore } from "@/store/feedStore";
import { useUserStore } from "@/store/userStore";

import { useCurrentUserId } from "./useCurrentUser";
import { useUsersById } from "./useUsersById";

export function useFeed() {
  const viewerId = useCurrentUserId();
  const { deeds, status } = useDeedStore();
  const follows = useUserStore((s) => s.follows);
  const usersById = useUsersById();
  const filters = useFeedStore();

  const following = useMemo(() => (viewerId ? followingIds(follows, viewerId) : new Set<string>()), [follows, viewerId]);

  const items = useMemo(
    () =>
      filterDeeds(deeds, usersById, { category: filters.category, scope: filters.scope }, new Set([...following, viewerId ?? ""])),
    [deeds, usersById, filters.category, filters.scope, following, viewerId],
  );

  const isFiltered = filters.category !== "all";

  return { items, status, filters, isFiltered };
}
