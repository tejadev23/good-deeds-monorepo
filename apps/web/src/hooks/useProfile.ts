"use client";

import { useMemo } from "react";

import { earnedBadges } from "@/lib/recognition";
import { computeUserStats, followerIds, followingIds, likeCount } from "@/lib/selectors";
import { useChallengeStore } from "@/store/challengeStore";
import { useDeedStore } from "@/store/deedStore";
import { useHelpStore } from "@/store/helpStore";
import { useUserStore } from "@/store/userStore";

export function useProfile(username: string) {
  const users = useUserStore((s) => s.users);
  const follows = useUserStore((s) => s.follows);
  const usersStatus = useUserStore((s) => s.status);
  const deeds = useDeedStore((s) => s.deeds);
  const deedsStatus = useDeedStore((s) => s.status);
  const challenges = useChallengeStore((s) => s.challenges);
  const helpRequests = useHelpStore((s) => s.requests);

  const user = useMemo(() => users.find((u) => u.username === username) ?? null, [users, username]);

  return useMemo(() => {
    if (!user) return { user: null, status: usersStatus } as const;
    const ownDeeds = deeds.filter((d) => d.authorId === user.id);
    const stats = computeUserStats(user.id, deeds, follows, { challenges, helpRequests });
    const followerSet = followerIds(follows, user.id);
    const followingSet = followingIds(follows, user.id);
    const featured =
      ownDeeds.find((d) => d.id === user.featuredDeedId) ?? [...ownDeeds].sort((a, b) => likeCount(b) - likeCount(a))[0] ?? null;

    return {
      user,
      status: deedsStatus,
      stats,
      deeds: ownDeeds,
      featured,
      badges: earnedBadges(stats),
      followers: users.filter((u) => followerSet.has(u.id)),
      following: users.filter((u) => followingSet.has(u.id)),
    } as const;
  }, [user, users, deeds, follows, usersStatus, deedsStatus, challenges, helpRequests]);
}
