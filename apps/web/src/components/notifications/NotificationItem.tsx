"use client";

import Link from "next/link";
import {
  ChatRoundLineLinear,
  FlagLinear,
  HandShakeLinear,
  HeartLinear,
  StarRingsLinear,
  StarShineLinear,
  UserPlusRoundedLinear,
  UsersGroupRoundedLinear,
} from "solar-icon-set";

import { FollowButton } from "@/components/common/FollowButton";
import { UserAvatar } from "@/components/common/UserAvatar";
import { SmartImage } from "@/components/ui/smart-image";
import { formatRelativeTime } from "@/lib/format";
import { describeNotification } from "@/lib/notification-text";
import { cn } from "@/lib/utils";
import type { AppNotification, Challenge, Deed, HelpRequest, NotificationType, User } from "@/types";

const TYPE_ICON: Record<NotificationType, { icon: typeof HeartLinear; className: string }> = {
  like: { icon: HeartLinear, className: "bg-heart text-primary-foreground" },
  comment: { icon: ChatRoundLineLinear, className: "bg-cat-education text-primary-foreground" },
  follow: { icon: UserPlusRoundedLinear, className: "bg-primary text-primary-foreground" },
  community: { icon: UsersGroupRoundedLinear, className: "bg-cat-community text-primary-foreground" },
  milestone: { icon: StarShineLinear, className: "bg-sun text-primary-foreground" },
  ripple: { icon: StarRingsLinear, className: "bg-cat-community text-primary-foreground" },
  help: { icon: HandShakeLinear, className: "bg-cat-humanity text-primary-foreground" },
  challenge: { icon: FlagLinear, className: "bg-cat-education text-primary-foreground" },
};

type Props = { notification: AppNotification; actor?: User; deed?: Deed; helpRequest?: HelpRequest; challenge?: Challenge; onOpen: () => void };

export function NotificationItem({ notification, actor, deed, helpRequest, challenge, onOpen }: Props) {
  const view = describeNotification(notification, { actor, deed, helpRequest, challenge });
  const { icon: TypeIcon, className } = TYPE_ICON[notification.type];
  const thumbnail = deed?.images[0] ?? helpRequest?.imageUrl ?? challenge?.coverUrl;

  return (
    <li className="relative">
      <Link
        href={view.href}
        onClick={onOpen}
        className={cn(
          "flex items-start gap-3 rounded-2xl p-3 pr-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4",
          !notification.read && "bg-sage-subtle",
        )}
      >
        <div className="relative shrink-0">
          {actor ? (
            <UserAvatar user={actor} size="md" />
          ) : (
            <span className="flex size-11 items-center justify-center rounded-full bg-sun-subtle text-sun">
              {notification.type === "challenge" ? <FlagLinear size={22} /> : <StarShineLinear size={22} />}
            </span>
          )}
          <span className={cn("absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full ring-2 ring-card", className)}>
            <TypeIcon size={11} />
          </span>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm leading-snug">
            <span className="font-semibold">{view.lead}</span> {view.body}
          </p>
          {view.quote && <p className="line-clamp-2 rounded-xl border-l-2 border-sage bg-card/70 px-3 py-1.5 text-sm text-foreground/80">{view.quote}</p>}
          <p className="text-xs text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
        </div>
        {thumbnail && notification.type !== "follow" && <SmartImage src={thumbnail} alt="" wrapperClassName="size-12 shrink-0 rounded-xl" />}
        {notification.type === "follow" && actor && <span className="w-24 shrink-0" aria-hidden />}
        {!notification.read && <span className="absolute left-1.5 top-1/2 size-2 -translate-y-1/2 rounded-full bg-primary" aria-label="Unread" />}
      </Link>
      {notification.type === "follow" && actor && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <FollowButton userId={actor.id} size="xs" />
        </div>
      )}
    </li>
  );
}
