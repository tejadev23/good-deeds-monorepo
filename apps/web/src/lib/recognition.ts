import { BADGES, type BadgeMeta } from "@/config/badges";
import type { BadgeId, UserStats } from "@/types";

type Rule = (stats: UserStats) => boolean;

const RULES: Record<BadgeId, Rule> = {
  "nature-champion": (s) => s.categoryBreakdown.environment >= 4,
  "environmental-advocate": (s) => s.categoryBreakdown.environment >= 2 && s.totalLikesReceived >= 40,
  "animal-friend": (s) => s.categoryBreakdown.animals >= 3,
  "community-helper": (s) => s.categoryBreakdown.community + s.categoryBreakdown.humanity >= 3,
  "education-supporter": (s) => s.categoryBreakdown.education >= 2,
  "kindness-ambassador": (s) => s.totalDeeds >= 6 && Object.values(s.categoryBreakdown).filter((n) => n > 0).length >= 3,
  "generous-heart": (s) => s.categoryBreakdown.charity >= 2,
  "first-step": (s) => s.totalDeeds >= 1,
  changemaker: (s) => s.challengesJoined >= 1,
  "ripple-maker": (s) => s.ripplesInspired >= 2,
  "helping-hand": (s) => s.helpOffered >= 1,
};

const PRIORITY: BadgeId[] = [
  "kindness-ambassador",
  "ripple-maker",
  "nature-champion",
  "animal-friend",
  "community-helper",
  "education-supporter",
  "generous-heart",
  "environmental-advocate",
  "helping-hand",
  "changemaker",
  "first-step",
];

/** Recognition badges earned from a user's contribution history. */
export function earnedBadges(stats: UserStats): BadgeMeta[] {
  const earned = PRIORITY.filter((id) => RULES[id](stats));
  // "First Step" is only shown when nothing else has been earned yet.
  const meaningful = earned.filter((id) => id !== "first-step");
  return (meaningful.length > 0 ? meaningful : earned).map((id) => BADGES[id]);
}
