import Link from "next/link";

import { UserAvatar } from "@/components/common/UserAvatar";
import type { BadgeMeta } from "@/config/badges";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

export function ContributorCard({ user, count, badge }: { user: User; count: number; badge?: BadgeMeta }) {
  const BadgeIcon = badge?.icon;
  return (
    <Link
      href={ROUTES.profile(user.username)}
      className="flex min-w-56 items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-soft transition-shadow hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-0"
    >
      <div className="relative">
        <UserAvatar user={user} size="lg" />
        {badge && BadgeIcon && (
          <span className={cn("absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full ring-2 ring-card", badge.className)}>
            <BadgeIcon size={13} />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{badge?.name ?? "Community member"}</p>
        <p className="text-xs font-medium text-forest-soft">
          {count} deed{count === 1 ? "" : "s"} recently
        </p>
      </div>
    </Link>
  );
}
