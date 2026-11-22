import { differenceInCalendarDays } from "date-fns";

import type { Challenge, ChallengeStatus, Deed } from "@/types";

export function challengeStatus(challenge: Challenge, now = Date.now()): ChallengeStatus {
  if (new Date(challenge.startDate).getTime() > now) return "upcoming";
  if (new Date(challenge.endDate).getTime() < now) return "completed";
  return "active";
}

export function challengeContributions(challengeId: string, deeds: Deed[]): Deed[] {
  return deeds.filter((d) => d.challenge?.challengeId === challengeId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function challengeProgress(challenge: Challenge, deeds: Deed[]) {
  const logged = challengeContributions(challenge.id, deeds).reduce((sum, d) => sum + (d.challenge?.amount ?? 0), 0);
  const total = challenge.communityProgress + logged;
  return { total, percent: Math.min(100, Math.round((total / challenge.goal) * 100)), reached: total >= challenge.goal };
}

/** "4 days left", "Ends today", "Starts in 6 days", "Ended 8 days ago". */
export function challengeTimeLabel(challenge: Challenge, now = new Date()): string {
  const status = challengeStatus(challenge, now.getTime());
  if (status === "upcoming") {
    const days = differenceInCalendarDays(new Date(challenge.startDate), now);
    return days <= 1 ? "Starts tomorrow" : `Starts in ${days} days`;
  }
  if (status === "completed") {
    const days = differenceInCalendarDays(now, new Date(challenge.endDate));
    return days <= 0 ? "Ended today" : `Ended ${days} day${days === 1 ? "" : "s"} ago`;
  }
  const left = differenceInCalendarDays(new Date(challenge.endDate), now);
  return left <= 0 ? "Ends today" : `${left} day${left === 1 ? "" : "s"} left`;
}
