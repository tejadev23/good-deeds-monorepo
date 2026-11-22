"use client";

import Link from "next/link";
import { AddCircleLinear, CalendarLinear, MapPointLinear } from "solar-icon-set";

import { FollowButton } from "@/components/common/FollowButton";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import { useFollow } from "@/hooks/useFollow";
import { formatCompactNumber, formatMonthYear } from "@/lib/format";
import type { User, UserStats } from "@/types";

type ProfileHeaderProps = {
  user: User;
  stats: UserStats;
  isSelf: boolean;
  summary: string;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
};

function Stat({ value, label, onClick }: { value: number; label: string; onClick?: () => void }) {
  const content = (
    <>
      <span className="font-display text-xl font-semibold text-forest sm:text-2xl">{formatCompactNumber(value)}</span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </>
  );
  if (!onClick) return <div className="flex flex-col items-center gap-0.5 px-2 py-2">{content}</div>;
  return (
    <Button variant="ghost" className="h-auto flex-col gap-0.5 rounded-2xl px-2 py-2" onClick={onClick}>
      {content}
    </Button>
  );
}

export function ProfileHeader({ user, stats, isSelf, summary, onShowFollowers, onShowFollowing }: ProfileHeaderProps) {
  const { followsYou } = useFollow(user.id);

  return (
    <section className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft">
      <SmartImage src={user.coverUrl} alt="" wrapperClassName="h-36 sm:h-52" />
      <div className="px-5 pb-5 sm:px-7">
        <div className="-mt-14 flex flex-wrap items-end justify-between gap-3 sm:-mt-16">
          <UserAvatar user={user} size="xl" />
          <div className="flex gap-2 pb-1">
            {isSelf ? (
              <Button asChild size="sm">
                <Link href={ROUTES.create}>
                  <AddCircleLinear size={18} /> Share a deed
                </Link>
              </Button>
            ) : (
              <FollowButton userId={user.id} size="sm" />
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-forest sm:text-3xl">{user.name}</h1>
              {user.isDemoAccount && <Badge variant="sun">Demo account</Badge>}
              {followsYou && !isSelf && <Badge variant="muted">Follows you</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-foreground/85">{user.bio}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPointLinear size={16} /> {user.location}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarLinear size={16} /> Joined {formatMonthYear(user.joinedAt)}
            </span>
          </div>
          <p className="rounded-2xl bg-sage-subtle px-4 py-3 text-sm text-forest">{summary}</p>
        </div>

        <div className="mt-4 grid grid-cols-4 divide-x divide-border/70 rounded-2xl border border-border/70">
          <Stat value={stats.totalDeeds} label="Deeds" />
          <Stat value={stats.totalLikesReceived} label="Appreciation" />
          <Stat value={stats.followers} label="Followers" onClick={onShowFollowers} />
          <Stat value={stats.following} label="Following" onClick={onShowFollowing} />
        </div>
      </div>
    </section>
  );
}
