import {
  DEED_CATEGORIES,
  type Challenge,
  type Deed,
  type DeedCategory,
  type FeedQuery,
  type Follow,
  type HelpRequest,
  type User,
  type UserStats,
} from "@/types";

const DAY = 24 * 60 * 60 * 1000;

export const likeCount = (deed: Deed) => deed.likedBy.length + deed.communityLikes;

export function emptyBreakdown(): Record<DeedCategory, number> {
  return DEED_CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: 0 }), {} as Record<DeedCategory, number>);
}

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function matchesText(haystack: (string | undefined)[], needle: string): boolean {
  const q = normalize(needle.trim());
  if (!q) return true;
  return haystack.some((value) => value && normalize(value).includes(q));
}

export function followingIds(follows: Follow[], userId: string): Set<string> {
  return new Set(follows.filter((f) => f.followerId === userId).map((f) => f.followingId));
}

export function followerIds(follows: Follow[], userId: string): Set<string> {
  return new Set(follows.filter((f) => f.followingId === userId).map((f) => f.followerId));
}

export function filterDeeds(deeds: Deed[], usersById: Map<string, User>, query: FeedQuery, viewerFollowing?: Set<string>): Deed[] {
  return deeds.filter((deed) => {
    if (query.authorId && deed.authorId !== query.authorId) return false;
    if (query.category && query.category !== "all" && deed.category !== query.category) return false;
    if (query.scope === "following" && viewerFollowing && !viewerFollowing.has(deed.authorId)) return false;
    if (query.search) {
      const author = usersById.get(deed.authorId);
      return matchesText([deed.title, deed.description, deed.location, deed.category, author?.name, author?.username], query.search);
    }
    return true;
  });
}

export interface StatsContext {
  challenges?: Challenge[];
  helpRequests?: HelpRequest[];
}

export function computeUserStats(userId: string, deeds: Deed[], follows: Follow[], context: StatsContext = {}): UserStats {
  const own = deeds.filter((d) => d.authorId === userId);
  const ownIds = new Set(own.map((d) => d.id));
  const categoryBreakdown = emptyBreakdown();
  own.forEach((d) => {
    categoryBreakdown[d.category] += 1;
  });
  return {
    totalDeeds: own.length,
    totalLikesReceived: own.reduce((sum, d) => sum + likeCount(d), 0),
    followers: followerIds(follows, userId).size,
    following: followingIds(follows, userId).size,
    categoryBreakdown,
    ripplesInspired: deeds.filter((d) => d.inspiredById && ownIds.has(d.inspiredById) && d.authorId !== userId).length,
    challengesJoined: (context.challenges ?? []).filter((c) => c.participantIds.includes(userId)).length,
    helpOffered: (context.helpRequests ?? []).filter((r) => r.offers.some((o) => o.userId === userId)).length,
  };
}

/** Most-appreciated deeds from the last `days` days. */
export function trendingDeeds(deeds: Deed[], commentCounts: Map<string, number>, days = 21, limit = 6): Deed[] {
  const since = Date.now() - days * DAY;
  const score = (d: Deed) => likeCount(d) + (commentCounts.get(d.id) ?? 0) * 8;
  return deeds
    .filter((d) => new Date(d.createdAt).getTime() >= since)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

/** People the viewer doesn't follow yet, ranked by shared interests and activity. */
export function suggestedUsers(users: User[], deeds: Deed[], follows: Follow[], viewerId: string, limit = 5): User[] {
  const viewer = users.find((u) => u.id === viewerId);
  const following = followingIds(follows, viewerId);
  const deedCounts = new Map<string, number>();
  deeds.forEach((d) => deedCounts.set(d.authorId, (deedCounts.get(d.authorId) ?? 0) + 1));
  const followsViewer = followerIds(follows, viewerId);

  return users
    .filter((u) => u.id !== viewerId && !following.has(u.id))
    .map((u) => {
      const shared = viewer ? u.interests.filter((i) => viewer.interests.includes(i)).length : 0;
      const score = shared * 3 + (deedCounts.get(u.id) ?? 0) + (followsViewer.has(u.id) ? 4 : 0);
      return { u, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ u }) => u);
}

/** Members with the most deeds in the last `days` days. */
export function featuredContributors(users: User[], deeds: Deed[], days = 45, limit = 6): { user: User; count: number }[] {
  const since = Date.now() - days * DAY;
  const counts = new Map<string, number>();
  deeds
    .filter((d) => new Date(d.createdAt).getTime() >= since)
    .forEach((d) => counts.set(d.authorId, (counts.get(d.authorId) ?? 0) + 1));
  return users
    .map((user) => ({ user, count: counts.get(user.id) ?? 0 }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function categoryTotals(deeds: Deed[]): Record<DeedCategory, number> {
  const totals = emptyBreakdown();
  deeds.forEach((d) => {
    totals[d.category] += 1;
  });
  return totals;
}
