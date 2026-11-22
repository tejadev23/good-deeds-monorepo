"use client";

import Link from "next/link";
import { ClockCircleLinear, MapPointLinear } from "solar-icon-set";

import { AvatarStack } from "@/components/common/AvatarStack";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import { useUsersById } from "@/hooks/useUsersById";
import { formatRelativeTime } from "@/lib/format";
import { isUrgent, neededByLabel } from "@/lib/help";
import { cn } from "@/lib/utils";
import type { HelpRequest } from "@/types";

import { HelpActions } from "./HelpActions";
import { HelperProgress } from "./HelperProgress";

export function HelpRequestCard({ request, className }: { request: HelpRequest; className?: string }) {
  const usersById = useUsersById();
  const author = usersById.get(request.authorId);
  const helpers = request.offers.map((o) => usersById.get(o.userId)).filter((u) => u !== undefined);
  const urgent = isUrgent(request);

  return (
    <article className={cn("flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-shadow hover:shadow-lift", request.status === "fulfilled" && "opacity-85", className)}>
      {request.imageUrl && (
        <Link href={ROUTES.helpRequest(request.id)}>
          <SmartImage src={request.imageUrl} alt={request.title} wrapperClassName="aspect-[16/8]" />
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={request.category} />
          <Badge variant={request.status === "fulfilled" ? "environment" : urgent ? "sun" : "muted"}>
            <ClockCircleLinear size={12} /> {neededByLabel(request)}
          </Badge>
        </div>
        <Link href={ROUTES.helpRequest(request.id)} className="space-y-1">
          <h3 className="text-lg font-semibold leading-snug text-forest hover:underline">{request.title}</h3>
          <p className="line-clamp-2 text-sm text-foreground/80">{request.description}</p>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {author && <UserAvatar user={author} size="xs" linked />}
          <span className="truncate">
            {author?.name} · {formatRelativeTime(request.createdAt)}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <MapPointLinear size={12} /> {request.location.split(",")[0]}
          </span>
        </div>
        <div className="mt-auto space-y-3 pt-1">
          <HelperProgress offered={request.offers.length} needed={request.helpersNeeded} />
          <div className="flex items-center justify-between gap-2">
            {helpers.length > 0 ? <AvatarStack users={helpers} label="offered" max={3} /> : <span className="text-xs text-muted-foreground">Be the first to help</span>}
            <HelpActions request={request} size="xs" />
          </div>
        </div>
      </div>
    </article>
  );
}
