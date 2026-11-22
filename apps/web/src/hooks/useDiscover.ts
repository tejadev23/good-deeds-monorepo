"use client";

import { useMemo, useState } from "react";

import { earnedBadges } from "@/lib/recognition";
import { categoryTotals, computeUserStats, featuredContributors, matchesText, suggestedUsers, trendingDeeds } from "@/lib/selectors";
import { useActivityStore } from "@/store/activityStore";
import { useChallengeStore } from "@/store/challengeStore";
import { useHelpStore } from "@/store/helpStore";
import { useDeedStore } from "@/store/deedStore";
import { useUserStore } from "@/store/userStore";

import { useCurrentUserId } from "./useCurrentUser";
import { useUsersById } from "./useUsersById";

export function useDiscover(search: string) {
  const viewerId = useCurrentUserId() ?? "";
  const users = useUserStore((s) => s.users);
  const follows = useUserStore((s) => s.follows);
  const { deeds, comments, status } = useDeedStore();
  const activities = useActivityStore((s) => s.activities);
  const challenges = useChallengeStore((s) => s.challenges);
  const helpRequests = useHelpStore((s) => s.requests);
  const usersById = useUsersById();
  // Suggestions are computed from a per-viewer snapshot so a card doesn't vanish the moment you follow someone.
  const [snapshot, setSnapshot] = useState({ viewerId, follows });
  if (snapshot.viewerId !== viewerId) setSnapshot({ viewerId, follows });

  const commentCounts = useMemo(() => {
    const map = new Map<string, number>();
    comments.forEach((c) => map.set(c.deedId, (map.get(c.deedId) ?? 0) + 1));
    return map;
  }, [comments]);

  const overview = useMemo(
    () => ({
      suggested: suggestedUsers(users, deeds, snapshot.follows, viewerId, 6),
      trending: trendingDeeds(deeds, commentCounts, 21, 6),
      categories: categoryTotals(deeds),
      contributors: featuredContributors(users, deeds, 45, 6).map((c) => ({
        ...c,
        badge: earnedBadges(computeUserStats(c.user.id, deeds, follows, { challenges, helpRequests }))[0],
      })),
    }),
    [users, deeds, follows, snapshot.follows, viewerId, commentCounts, challenges, helpRequests],
  );

  const results = useMemo(() => {
    const q = search.trim();
    if (!q) return null;
    return {
      people: users.filter((u) => matchesText([u.name, u.username, u.bio, u.location], q)).slice(0, 12),
      deeds: deeds
        .filter((d) => matchesText([d.title, d.description, d.location, d.category, usersById.get(d.authorId)?.name], q))
        .slice(0, 20),
    };
  }, [search, users, deeds, usersById]);

  return { ...overview, activities, results, status };
}
