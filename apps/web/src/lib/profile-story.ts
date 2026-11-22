import { CATEGORY_META } from "@/config/categories";
import { formatMonthYear } from "@/lib/format";
import type { Deed, DeedCategory, User, UserStats } from "@/types";

/** A one-sentence summary of someone's contribution story. */
export function contributionSummary(user: User, stats: UserStats, isSelf: boolean): string {
  const first = isSelf ? "You've" : `${user.name.split(" ")[0]} has`;
  if (stats.totalDeeds === 0) return `${isSelf ? "You haven't" : `${user.name.split(" ")[0]} hasn't`} shared a deed yet — every journey starts with one.`;
  const top = (Object.entries(stats.categoryBreakdown) as [DeedCategory, number][]).sort((a, b) => b[1] - a[1])[0];
  const focus = CATEGORY_META[top[0]].label.toLowerCase();
  const base = `${first} shared ${stats.totalDeeds} good deed${stats.totalDeeds === 1 ? "" : "s"} since joining in ${formatMonthYear(user.joinedAt)}, with a heart for ${focus}.`;
  if (stats.ripplesInspired === 0) return base;
  const who = isSelf ? "Your" : "Their";
  return `${base} ${who} deeds have inspired ${stats.ripplesInspired} other${stats.ripplesInspired === 1 ? "" : "s"} to do the same 🌱`;
}

/** Deed counts for each of the last `months` calendar months, oldest first. */
export function monthlyActivity(deeds: Deed[], months = 6): { label: string; count: number }[] {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    const count = deeds.filter((deed) => {
      const at = new Date(deed.createdAt);
      return at.getFullYear() === d.getFullYear() && at.getMonth() === d.getMonth();
    }).length;
    return { label: d.toLocaleString("en", { month: "short" }), count };
  });
}
