import { ROUTES } from "@/config/routes";
import type { AppNotification, Challenge, Deed, HelpRequest, User } from "@/types";

export interface NotificationView {
  lead: string;
  body: string;
  quote?: string;
  href: string;
}

export interface NotificationContext {
  actor?: User;
  deed?: Deed;
  helpRequest?: HelpRequest;
  challenge?: Challenge;
}

/** Turns a notification into display copy and a destination link. */
export function describeNotification(n: AppNotification, { actor, deed, helpRequest, challenge }: NotificationContext): NotificationView {
  const lead = actor?.name ?? "Good Deeds";
  const deedTitle = deed ? `“${deed.title}”` : "your deed";
  const deedHref = deed ? ROUTES.deed(deed.id) : ROUTES.feed;

  switch (n.type) {
    case "like":
      return { lead, body: `appreciated ${deedTitle}`, href: deedHref };
    case "comment":
      return { lead, body: `commented on ${deedTitle}`, quote: n.message, href: deed ? `${deedHref}#comments` : ROUTES.feed };
    case "follow":
      return { lead, body: "started following you", href: actor ? ROUTES.profile(actor.username) : ROUTES.discover };
    case "community":
      return { lead, body: n.message ?? "shared a community activity", href: ROUTES.discover };
    case "milestone":
      return { lead: "Milestone", body: n.message ?? "One of your deeds is inspiring people", href: deedHref };
    case "ripple":
      return { lead, body: `was inspired by “${n.message ?? "your deed"}” and shared ${deedTitle}`, href: deedHref };
    case "help":
      return {
        lead,
        body: `offered to help with “${helpRequest?.title ?? "your request"}”`,
        quote: n.message,
        href: helpRequest ? ROUTES.helpRequest(helpRequest.id) : ROUTES.help,
      };
    case "challenge":
      return {
        lead: challenge?.title ?? n.message ?? "Challenge",
        body: "is moving — add your deed and keep the momentum going",
        href: challenge ? ROUTES.challenge(challenge.id) : ROUTES.challenges,
      };
    default:
      return { lead, body: n.message ?? "", href: ROUTES.feed };
  }
}

export function notificationGroup(createdAt: string): "Today" | "This week" | "Earlier" {
  const age = Date.now() - new Date(createdAt).getTime();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (new Date(createdAt) >= startOfToday) return "Today";
  if (age < 7 * 24 * 60 * 60 * 1000) return "This week";
  return "Earlier";
}
