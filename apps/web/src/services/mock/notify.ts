import { createId } from "@/lib/utils";
import type { AppNotification } from "@/types";

import type { MockDatabase } from "./schema";

type NotificationInput = Omit<AppNotification, "id" | "createdAt" | "read">;

/** Adds a notification for someone else's activity (never for your own actions). */
export function pushNotification(db: MockDatabase, input: NotificationInput): void {
  if (input.actorId && input.actorId === input.recipientId) return;
  db.notifications.unshift({ ...input, id: createId("n"), createdAt: new Date().toISOString(), read: false });
}

export function removeNotifications(db: MockDatabase, match: (n: AppNotification) => boolean): void {
  db.notifications = db.notifications.filter((n) => !match(n));
}
