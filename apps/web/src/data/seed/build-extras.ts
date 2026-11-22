import { unsplash } from "@/config/images";
import type { AppNotification, Challenge, Deed, HelpRequest } from "@/types";

import { SEED_CHALLENGES } from "./challenges";
import { SEED_HELP_REQUESTS } from "./help";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const iso = (ms: number) => new Date(ms).toISOString();

export function buildChallenges(now: number): Challenge[] {
  return SEED_CHALLENGES.map((c) => {
    const start = new Date(now - c.startDaysAgo * DAY);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now + c.endDaysFromNow * DAY);
    end.setHours(23, 59, 0, 0);
    return {
      id: c.id,
      title: c.title,
      tagline: c.tagline,
      description: c.description,
      category: c.category,
      coverUrl: unsplash(c.photo, 1400, 700),
      startDate: iso(start.getTime()),
      endDate: iso(end.getTime()),
      goal: c.goal,
      unit: c.unit,
      communityProgress: c.communityProgress,
      participantIds: c.participantIds,
      ideas: c.ideas,
    };
  });
}

export function buildHelpRequests(now: number): HelpRequest[] {
  return SEED_HELP_REQUESTS.map((h) => {
    const created = now - h.daysAgo * DAY;
    const neededBy = new Date(now + h.neededInDays * DAY);
    return {
      id: h.id,
      authorId: h.authorId,
      title: h.title,
      description: h.description,
      category: h.category,
      location: h.location,
      neededBy: iso(neededBy.getTime()).slice(0, 10),
      helpersNeeded: h.helpersNeeded,
      imageUrl: h.photo ? unsplash(h.photo, 900, 600) : undefined,
      offers: h.offers.map(([userId, message, hours]) => ({
        userId,
        message,
        createdAt: iso(Math.min(created + hours * HOUR, now - 10 * 60_000)),
      })),
      status: h.status,
      createdAt: iso(created),
    };
  });
}

/** Ripple, help-offer and challenge notifications derived from the seeded data. */
export function buildExtraNotifications(now: number, deeds: Deed[], help: HelpRequest[], challenges: Challenge[]): AppNotification[] {
  const byId = new Map(deeds.map((d) => [d.id, d]));
  const list: AppNotification[] = [];

  deeds.forEach((deed) => {
    const origin = deed.inspiredById ? byId.get(deed.inspiredById) : undefined;
    if (!origin || origin.authorId === deed.authorId) return;
    list.push({
      id: `n_ripple_${deed.id}`,
      recipientId: origin.authorId,
      actorId: deed.authorId,
      type: "ripple",
      deedId: deed.id,
      message: origin.title,
      createdAt: deed.createdAt,
      read: true,
    });
  });

  help.forEach((request) => {
    request.offers.forEach((offer) => {
      list.push({
        id: `n_help_${request.id}_${offer.userId}`,
        recipientId: request.authorId,
        actorId: offer.userId,
        type: "help",
        helpRequestId: request.id,
        message: offer.message,
        createdAt: offer.createdAt,
        read: true,
      });
    });
  });

  challenges
    .filter((c) => new Date(c.endDate).getTime() > now && new Date(c.startDate).getTime() < now)
    .forEach((c, index) => {
      ["u_sarah", "u_aarav", "u_maya"]
        .filter((id) => c.participantIds.includes(id))
        .forEach((recipientId) => {
          list.push({
            id: `n_challenge_${c.id}_${recipientId}`,
            recipientId,
            type: "challenge",
            challengeId: c.id,
            message: c.title,
            createdAt: iso(now - (6 + index * 7) * HOUR),
            read: true,
          });
        });
    });

  return list;
}
