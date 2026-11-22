import type { Database, NotificationType } from "@repo/database";

interface NotifyInput {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  deedId?: string;
  helpRequestId?: string;
  message?: string;
}

/**
 * Creates a notification unless it would be noise: never for your own action,
 * never from someone the recipient blocked, and never twice for the same
 * like/follow/confirmation (so un-like → like again doesn't spam).
 */
export async function notify(db: Database, input: NotifyInput) {
  if (input.recipientId === input.actorId) return;

  const blocked = await db.block.findUnique({
    where: { blockerId_blockedId: { blockerId: input.recipientId, blockedId: input.actorId } },
  });
  if (blocked) return;

  if (input.type === "LIKE" || input.type === "FOLLOW" || input.type === "CONFIRMATION" || input.type === "VOUCH") {
    const existing = await db.notification.findFirst({
      where: { recipientId: input.recipientId, actorId: input.actorId, type: input.type, deedId: input.deedId ?? null },
      select: { id: true },
    });
    if (existing) return;
  }

  await db.notification.create({ data: input });
}
