"use client";

import Link from "next/link";
import { CalendarLinear, MapPointLinear, UsersGroupRoundedLinear } from "solar-icon-set";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import { useActivityJoin } from "@/hooks/useActivityJoin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CommunityActivity, User } from "@/types";

type ActivityCardProps = { activity: CommunityActivity; organizer?: User; compact?: boolean };

function JoinButton({ activity, className }: { activity: CommunityActivity; className?: string }) {
  const { isOrganizer, isJoined, isFull, pending, toggle } = useActivityJoin(activity);
  if (isOrganizer) {
    return (
      <Button size="xs" variant="secondary" disabled className={className}>
        You&apos;re organising
      </Button>
    );
  }
  return (
    <Button size="xs" variant={isJoined ? "outline" : "default"} loading={pending} disabled={isFull} onClick={() => void toggle()} className={className}>
      {isJoined ? "Going ✓" : isFull ? "Full" : "Join"}
    </Button>
  );
}

export function ActivityCard({ activity, organizer, compact = false }: ActivityCardProps) {
  const spotsLeft = activity.spots - activity.participantIds.length;

  if (compact) {
    return (
      <div className="flex gap-3">
        <SmartImage src={activity.imageUrl} alt={activity.title} wrapperClassName="size-16 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="line-clamp-2 text-sm font-semibold leading-snug">{activity.title}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarLinear size={12} /> {formatDate(activity.date, "EEE d MMM, h a")}
          </p>
          <JoinButton activity={activity} className="mt-1" />
        </div>
      </div>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-shadow hover:shadow-lift">
      <div className="relative">
        <SmartImage src={activity.imageUrl} alt={activity.title} wrapperClassName="aspect-[16/10]" />
        <CategoryBadge category={activity.category} className="absolute left-3 top-3 shadow-sm" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-snug">{activity.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{activity.description}</p>
        </div>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <CalendarLinear size={14} /> {formatDate(activity.date, "EEEE d MMM · h:mm a")}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPointLinear size={14} /> {activity.location}
          </p>
          <p className={cn("flex items-center gap-1.5", spotsLeft <= 3 && "font-semibold text-sun")}>
            <UsersGroupRoundedLinear size={14} /> {activity.participantIds.length} going · {spotsLeft} spots left
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {organizer && (
            <Link href={ROUTES.profile(organizer.username)} className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <UserAvatar user={organizer} size="xs" />
              <span className="truncate">by {organizer.name}</span>
            </Link>
          )}
          <JoinButton activity={activity} />
        </div>
      </div>
    </article>
  );
}
