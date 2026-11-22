import { DB_VERSION } from "@/config/storage-keys";
import { avatarUrl, unsplash } from "@/config/images";
import type { MockDatabase } from "@/services/mock/schema";
import type { AppNotification, Comment, CommunityActivity, Deed, Follow, User } from "@/types";

import { SEED_ACTIVITIES } from "./activities";
import { buildChallenges, buildExtraNotifications, buildHelpRequests } from "./build-extras";
import { SEED_CHALLENGE_CONTRIBUTIONS } from "./challenges";
import { COMMUNITY_DEEDS_A } from "./deeds-community-a";
import { COMMUNITY_DEEDS_B } from "./deeds-community-b";
import { PRIMARY_DEEDS } from "./deeds-primary";
import { createRandom } from "./random";
import { PRIMARY_FOLLOWERS, PRIMARY_FOLLOWING, PRIMARY_LIKES, PRIMARY_SAVES } from "./relations";
import { SEED_RIPPLES } from "./ripples";
import type { SeedDeed } from "./types";
import { SEED_USERS } from "./users";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const PRIMARY_IDS = ["u_sarah", "u_aarav", "u_maya"];

function publishedAt(now: number, daysAgo: number, hour: number): number {
  if (daysAgo < 1) return now - daysAgo * DAY;
  const day = new Date(now - Math.floor(daysAgo) * DAY);
  day.setHours(hour, (daysAgo * 37) % 60, 0, 0);
  return Math.min(day.getTime(), now - HOUR);
}

const iso = (ms: number) => new Date(ms).toISOString();

function buildUsers(now: number): User[] {
  return SEED_USERS.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    avatarUrl: avatarUrl(u.portrait),
    coverUrl: unsplash(u.cover, 1600, 600),
    bio: u.bio,
    location: u.location,
    joinedAt: iso(now - u.joinedDaysAgo * DAY),
    interests: u.interests,
    featuredDeedId: u.featuredDeedId,
    isDemoAccount: u.isDemoAccount,
  }));
}

function buildFollows(now: number): Follow[] {
  const rand = createRandom("follows");
  const pairs = new Set<string>();
  const add = (followerId: string, followingId: string) => {
    if (followerId !== followingId) pairs.add(`${followerId}>${followingId}`);
  };

  Object.entries(PRIMARY_FOLLOWING).forEach(([id, list]) => list.forEach((target) => add(id, target)));
  Object.entries(PRIMARY_FOLLOWERS).forEach(([id, list]) => list.forEach((follower) => add(follower, id)));

  const others = SEED_USERS.filter((u) => !PRIMARY_IDS.includes(u.id));
  others.forEach((user) => {
    const sameInterest = others.filter((o) => o.id !== user.id && o.interests.some((i) => user.interests.includes(i)));
    rand.sample(sameInterest, rand.int(3, 6)).forEach((o) => add(user.id, o.id));
    rand.sample(others, rand.int(1, 3)).forEach((o) => add(user.id, o.id));
  });

  return [...pairs].map((pair) => {
    const [followerId, followingId] = pair.split(">");
    return { followerId, followingId, createdAt: iso(now - rand.int(2, 80) * DAY - rand.int(0, 23) * HOUR) };
  });
}

function buildDeedsAndComments(now: number): { deeds: Deed[]; comments: Comment[] } {
  const rand = createRandom("deeds");
  const allSeeds: SeedDeed[] = [...PRIMARY_DEEDS, ...COMMUNITY_DEEDS_A, ...COMMUNITY_DEEDS_B];
  const userIds = SEED_USERS.map((u) => u.id);
  const comments: Comment[] = [];

  const deeds = allSeeds.map((seed) => {
    const created = publishedAt(now, seed.daysAgo, seed.hour);
    const candidates = userIds.filter((id) => id !== seed.authorId);
    const guaranteed = PRIMARY_IDS.filter((id) => PRIMARY_LIKES[id]?.includes(seed.id));
    const generated = rand
      .sample(
        candidates.filter((id) => !PRIMARY_IDS.includes(id)),
        Math.min(candidates.length, Math.round(seed.likes / 18) + 2),
      );
    const likedBy = [...new Set([...guaranteed, ...generated])];

    (seed.comments ?? []).forEach(([authorId, text], index) => {
      const at = Math.min(created + (index + 1) * rand.int(1, 6) * HOUR + rand.int(1, 50) * 60_000, now - 5 * 60_000);
      comments.push({ id: `c_${seed.id}_${index}`, deedId: seed.id, authorId, text, createdAt: iso(at) });
    });

    const activity = new Date(created - (seed.activityLag ?? 0) * DAY);
    const contribution = SEED_CHALLENGE_CONTRIBUTIONS[seed.id];
    return {
      id: seed.id,
      authorId: seed.authorId,
      title: seed.title,
      description: seed.description,
      category: seed.category,
      images: seed.photos.map((p) => unsplash(p, 1200)),
      location: seed.location,
      activityDate: iso(activity.getTime()).slice(0, 10),
      createdAt: iso(created),
      likedBy,
      communityLikes: Math.max(0, seed.likes - likedBy.length),
      inspiredById: SEED_RIPPLES[seed.id],
      challenge: contribution ? { challengeId: contribution[0], amount: contribution[1] } : undefined,
    } satisfies Deed;
  });

  deeds.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { deeds, comments };
}

function buildActivities(now: number): CommunityActivity[] {
  return SEED_ACTIVITIES.map((a) => {
    const date = new Date(now + a.daysFromNow * DAY);
    date.setHours(a.hour, 0, 0, 0);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      category: a.category,
      imageUrl: unsplash(a.photo, 900, 600),
      location: a.location,
      date: iso(date.getTime()),
      organizerId: a.organizerId,
      participantIds: a.participantIds,
      spots: a.spots,
    };
  });
}

function buildNotifications(now: number, deeds: Deed[], comments: Comment[], follows: Follow[], extra: AppNotification[]): AppNotification[] {
  const rand = createRandom("notifications");
  const all: AppNotification[] = [];
  const authorOf = new Map(deeds.map((d) => [d.id, d.authorId]));

  deeds.forEach((deed) => {
    deed.likedBy.forEach((actorId) => {
      const at = Math.min(new Date(deed.createdAt).getTime() + rand.int(1, 40) * HOUR, now - rand.int(10, 300) * 60_000);
      all.push({ id: `n_like_${deed.id}_${actorId}`, recipientId: deed.authorId, actorId, type: "like", deedId: deed.id, createdAt: iso(at), read: true });
    });
  });
  comments.forEach((c) => {
    const recipientId = authorOf.get(c.deedId);
    if (!recipientId || recipientId === c.authorId) return;
    all.push({ id: `n_comment_${c.id}`, recipientId, actorId: c.authorId, type: "comment", deedId: c.deedId, message: c.text, createdAt: c.createdAt, read: true });
  });
  follows.forEach((f) => {
    all.push({ id: `n_follow_${f.followerId}_${f.followingId}`, recipientId: f.followingId, actorId: f.followerId, type: "follow", createdAt: f.createdAt, read: true });
  });

  const extras: AppNotification[] = [
    { id: "n_comm_sarah", recipientId: "u_sarah", actorId: "u_ishita", type: "community", activityId: "a_clothes_sorting", message: "invited you to Winter clothes sorting day", createdAt: iso(now - 5 * HOUR), read: false },
    { id: "n_comm_aarav", recipientId: "u_aarav", actorId: "u_sarah", type: "community", activityId: "a_bund_round_two", message: "invited you to Lake bund planting — round two", createdAt: iso(now - 9 * HOUR), read: false },
    { id: "n_comm_maya", recipientId: "u_maya", actorId: "u_rafael", type: "community", activityId: "a_vaccination_drive", message: "joined your Street dog vaccination drive", createdAt: iso(now - 3 * HOUR), read: false },
    { id: "n_mile_maya", recipientId: "u_maya", type: "milestone", deedId: "d_maya_2", message: "Biscuit got adopted! has inspired more than 300 people this week", createdAt: iso(now - 2 * DAY), read: true },
    { id: "n_mile_aarav", recipientId: "u_aarav", type: "milestone", deedId: "d_aarav_1", message: "Sunday meals: 340 plates is trending in Charity", createdAt: iso(now - 1 * DAY), read: false },
    { id: "n_mile_sarah", recipientId: "u_sarah", type: "milestone", deedId: "d_sarah_1", message: "120 native saplings is featured on Discover this week", createdAt: iso(now - 3 * DAY), read: true },
  ];

  // Keep the most recent 45 per recipient; anything from the last ~36h starts unread.
  const byRecipient = new Map<string, AppNotification[]>();
  [...all, ...extras, ...extra].forEach((n) => byRecipient.set(n.recipientId, [...(byRecipient.get(n.recipientId) ?? []), n]));

  return [...byRecipient.values()].flatMap((list) =>
    list
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 45)
      .map((n, index) => {
        const recent = now - new Date(n.createdAt).getTime() < 36 * HOUR;
        // Only a handful of the newest items start unread, like a real inbox.
        return { ...n, read: !(index < 6 && (recent || !n.read)) };
      }),
  );
}

/** Builds a fresh, fully populated demo community relative to `now`. */
export function buildSeedDatabase(now: number = Date.now()): MockDatabase {
  const users = buildUsers(now);
  const follows = buildFollows(now);
  const { deeds, comments } = buildDeedsAndComments(now);
  const activities = buildActivities(now);
  const challenges = buildChallenges(now);
  const helpRequests = buildHelpRequests(now);
  const notifications = buildNotifications(now, deeds, comments, follows, buildExtraNotifications(now, deeds, helpRequests, challenges));

  return {
    version: DB_VERSION,
    seededAt: iso(now),
    users,
    deeds,
    comments,
    follows,
    notifications,
    activities,
    challenges,
    helpRequests,
    saves: { ...PRIMARY_SAVES },
  };
}
