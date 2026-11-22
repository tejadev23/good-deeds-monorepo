"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarLinear, MapPointLinear } from "solar-icon-set";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useDeedActions } from "@/hooks/useDeedActions";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useUsersById } from "@/hooks/useUsersById";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { likeCount } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { Deed } from "@/types";

import { InspiredByLine } from "@/components/ripples/InspiredByLine";
import { RippleChip } from "@/components/ripples/RippleChip";
import { ChallengeTag } from "@/components/challenges/ChallengeTag";
import { useRipple } from "@/hooks/useRipples";

import { CommentsDialog } from "./CommentsDialog";
import { DeedActions } from "./DeedActions";
import { DeedGallery } from "./DeedGallery";
import { DeedMenu } from "./DeedMenu";
import { LikedBy } from "./LikedBy";

type DeedCardProps = {
  deed: Deed;
  /** "detail" shows the full description and leaves comments to the page. */
  variant?: "feed" | "detail";
  onCommentClick?: () => void;
  onDeleted?: () => void;
};

const CLAMP_LENGTH = 220;

export function DeedCard({ deed, variant = "feed", onCommentClick, onDeleted }: DeedCardProps) {
  const usersById = useUsersById();
  const viewerId = useCurrentUserId();
  const actions = useDeedActions(deed);
  const [expanded, setExpanded] = useState(variant === "detail");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const ripple = useRipple(deed);
  const author = usersById.get(deed.authorId);
  if (!author) return null;

  const isLong = deed.description.length > CLAMP_LENGTH;
  const likers = deed.likedBy.filter((id) => id !== viewerId).map((id) => usersById.get(id)).filter((u) => u !== undefined);
  const showActivityDate = deed.activityDate !== deed.createdAt.slice(0, 10);

  return (
    <article className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-shadow hover:shadow-lift">
      <header className="flex items-start gap-3 p-4 pb-3 sm:p-5 sm:pb-3">
        <UserAvatar user={author} size="md" linked />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5">
            <Link href={ROUTES.profile(author.username)} className="truncate font-semibold hover:underline">
              {author.name}
            </Link>
            <span className="text-sm text-muted-foreground">· {formatRelativeTime(deed.createdAt)}</span>
          </div>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            {deed.location && (
              <>
                <MapPointLinear size={12} /> <span className="truncate">{deed.location}</span>
              </>
            )}
            {!deed.location && `@${author.username}`}
          </p>
        </div>
        <CategoryBadge category={deed.category} className="hidden sm:inline-flex" />
        <DeedMenu
          authorUsername={author.username}
          authorName={author.name}
          isOwner={actions.isOwner}
          deleting={actions.deleting}
          onCopyLink={() => void actions.share()}
          onDelete={async () => {
            const ok = await actions.remove();
            if (ok) onDeleted?.();
            return ok;
          }}
        />
      </header>

      <div className="space-y-3 px-4 sm:px-5">
        <CategoryBadge category={deed.category} className="sm:hidden" />
        {ripple.origin && <InspiredByLine origin={ripple.origin} author={usersById.get(ripple.origin.authorId)} />}
        {variant === "feed" ? (
          <Link href={ROUTES.deed(deed.id)} className="block">
            <h2 className="text-xl font-semibold leading-snug text-forest hover:underline">{deed.title}</h2>
          </Link>
        ) : (
          <h1 className="text-2xl font-semibold leading-snug text-forest sm:text-3xl">{deed.title}</h1>
        )}
        <p className={cn("whitespace-pre-line text-base leading-relaxed text-foreground/85", !expanded && isLong && "line-clamp-3")}>{deed.description}</p>
        {isLong && !expanded && (
          <Button variant="link" size="bare" onClick={() => setExpanded(true)} className="text-sm">
            Read more
          </Button>
        )}
        {showActivityDate && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarLinear size={13} /> Happened on {formatDate(deed.activityDate)}
          </p>
        )}
      </div>

      {deed.images.length > 0 && (
        <div className="px-2 pt-4 sm:px-3">
          <DeedGallery images={deed.images} title={deed.title} />
        </div>
      )}

      <div className="space-y-3 px-4 pb-3 pt-4 sm:px-5">
        {(ripple.reach > 0 || deed.challenge) && (
          <div className="flex flex-wrap gap-2">
            <RippleChip deedId={deed.id} reach={ripple.reach} />
            {deed.challenge && <ChallengeTag contribution={deed.challenge} />}
          </div>
        )}
        <LikedBy likers={likers} total={likeCount(deed)} viewerLiked={actions.isLiked} />
        <div className="-mx-2 border-t border-border/70 pt-2">
          <DeedActions
            likes={likeCount(deed)}
            comments={actions.commentCount}
            isLiked={actions.isLiked}
            isSaved={actions.isSaved}
            onLike={() => void actions.toggleLike()}
            onComment={() => (onCommentClick ? onCommentClick() : setCommentsOpen(true))}
            onShare={() => void actions.share()}
            onSave={() => void actions.toggleSave()}
            inspireHref={actions.isOwner ? undefined : ROUTES.createInspiredBy(deed.id)}
          />
        </div>
      </div>

      {!onCommentClick && <CommentsDialog deed={deed} open={commentsOpen} onOpenChange={setCommentsOpen} />}
    </article>
  );
}
