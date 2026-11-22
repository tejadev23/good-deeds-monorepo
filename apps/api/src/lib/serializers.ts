import type { Prisma } from "@repo/database";
import type { CommentDto, DeedDto, NotificationDto, UserSummaryDto } from "@repo/shared";

/** Placeholder id for "no viewer" so viewer-relation filters match nothing. */
export const NO_VIEWER = "00000000-0000-0000-0000-000000000000";

export const userSummarySelect = { id: true, username: true, name: true, avatarUrl: true } as const;

type UserSummaryRow = Prisma.UserGetPayload<{ select: typeof userSummarySelect }>;

export function toUserSummary(user: UserSummaryRow): UserSummaryDto {
  return { id: user.id, username: user.username ?? "", name: user.name, avatarUrl: user.avatarUrl };
}

export const toDateOnly = (date: Date) => date.toISOString().slice(0, 10);

export function deedInclude(viewerId: string | undefined) {
  const viewer = viewerId ?? NO_VIEWER;
  return {
    author: { select: userSummarySelect },
    images: { orderBy: { position: "asc" as const } },
    inspiredBy: { select: { id: true, title: true, deletedAt: true, author: { select: userSummarySelect } } },
    challenge: { select: { id: true, slug: true, title: true, unit: true } },
    likes: { where: { userId: viewer }, select: { userId: true } },
    saves: { where: { userId: viewer }, select: { userId: true } },
    confirmations: { where: { userId: viewer }, select: { userId: true } },
    _count: {
      select: {
        likes: true,
        saves: true,
        confirmations: true,
        comments: { where: { deletedAt: null } },
        ripples: { where: { deletedAt: null } },
      },
    },
  } satisfies Prisma.DeedInclude;
}

export type DeedRow = Prisma.DeedGetPayload<{ include: ReturnType<typeof deedInclude> }>;

export function toDeedDto(deed: DeedRow, viewerId: string | undefined): DeedDto {
  return {
    id: deed.id,
    author: toUserSummary(deed.author),
    title: deed.title,
    description: deed.description,
    category: deed.category,
    location: deed.location,
    activityDate: toDateOnly(deed.activityDate),
    createdAt: deed.createdAt.toISOString(),
    images: deed.images.map((image) => ({ id: image.id, url: image.url, width: image.width, height: image.height })),
    inspiredBy:
      deed.inspiredBy && !deed.inspiredBy.deletedAt
        ? { id: deed.inspiredBy.id, title: deed.inspiredBy.title, author: toUserSummary(deed.inspiredBy.author) }
        : null,
    challenge:
      deed.challenge && deed.challengeAmount
        ? { ...deed.challenge, amount: deed.challengeAmount }
        : null,
    counts: {
      likes: deed._count.likes,
      comments: deed._count.comments,
      saves: deed._count.saves,
      ripples: deed._count.ripples,
      confirmations: deed._count.confirmations,
    },
    viewer: {
      liked: deed.likes.length > 0,
      saved: deed.saves.length > 0,
      confirmed: deed.confirmations.length > 0,
      isAuthor: deed.authorId === viewerId,
    },
  };
}

export const commentInclude = { author: { select: userSummarySelect } } satisfies Prisma.CommentInclude;
type CommentRow = Prisma.CommentGetPayload<{ include: typeof commentInclude }>;

export function toCommentDto(comment: CommentRow): CommentDto {
  return {
    id: comment.id,
    deedId: comment.deedId,
    author: toUserSummary(comment.author),
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
  };
}

export const notificationInclude = { actor: { select: userSummarySelect } } satisfies Prisma.NotificationInclude;
type NotificationRow = Prisma.NotificationGetPayload<{ include: typeof notificationInclude }>;

export function toNotificationDto(notification: NotificationRow): NotificationDto {
  return {
    id: notification.id,
    type: notification.type,
    actor: notification.actor ? toUserSummary(notification.actor) : null,
    deedId: notification.deedId,
    helpRequestId: notification.helpRequestId,
    message: notification.message,
    read: notification.readAt !== null,
    createdAt: notification.createdAt.toISOString(),
  };
}
