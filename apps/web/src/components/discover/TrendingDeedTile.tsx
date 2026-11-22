import Link from "next/link";
import { ChatRoundLineLinear, HeartLinear } from "solar-icon-set";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { SmartImage } from "@/components/ui/smart-image";
import { CATEGORY_META } from "@/config/categories";
import { ROUTES } from "@/config/routes";
import { formatCompactNumber, formatRelativeTime } from "@/lib/format";
import { likeCount } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { Deed, User } from "@/types";

export function TrendingDeedTile({ deed, author, comments, rank }: { deed: Deed; author?: User; comments: number; rank?: number }) {
  const meta = CATEGORY_META[deed.category];
  const Icon = meta.icon;
  return (
    <Link
      href={ROUTES.deed(deed.id)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-shadow hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative">
        {deed.images[0] ? (
          <SmartImage src={deed.images[0]} alt={deed.title} wrapperClassName="aspect-[4/3]" className="transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={cn("flex aspect-[4/3] items-center justify-center", meta.bgClass, meta.textClass)}>
            <Icon size={40} />
          </div>
        )}
        {rank !== undefined && (
          <span className="absolute left-3 top-3 flex size-8 items-center justify-center rounded-full bg-card/95 font-display text-sm font-semibold text-forest shadow-sm">
            {rank}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <CategoryBadge category={deed.category} />
        <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:underline">{deed.title}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
          {author && (
            <span className="flex min-w-0 items-center gap-1.5">
              <UserAvatar user={author} size="xs" />
              <span className="truncate">{author.name}</span>
            </span>
          )}
          <span className="flex shrink-0 items-center gap-2.5">
            <span className="flex items-center gap-1">
              <HeartLinear size={14} /> {formatCompactNumber(likeCount(deed))}
            </span>
            <span className="flex items-center gap-1">
              <ChatRoundLineLinear size={14} /> {comments}
            </span>
          </span>
        </div>
        <span className="sr-only">Posted {formatRelativeTime(deed.createdAt)}</span>
      </div>
    </Link>
  );
}
