"use client";

import Link from "next/link";
import { BookmarkLinear, ChatRoundLineLinear, HeartLinear, ShareLinear, StarRingsLinear } from "solar-icon-set";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type DeedActionsProps = {
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  /** Link to start a deed inspired by this one (hidden on your own deeds). */
  inspireHref?: string;
};

export function DeedActions({ likes, comments, isLiked, isSaved, onLike, onComment, onShare, onSave, inspireHref }: DeedActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="subtle"
        size="sm"
        onClick={onLike}
        aria-pressed={isLiked}
        aria-label={isLiked ? "Unlike" : "Like"}
        className={cn("px-3", isLiked && "bg-heart-subtle text-heart hover:bg-heart-subtle hover:text-heart")}
      >
        <HeartLinear size={20} key={String(isLiked)} className={cn(isLiked && "animate-heart-pop fill-current")} />
        <span className="tabular-nums">{formatCompactNumber(likes)}</span>
      </Button>
      <Button variant="subtle" size="sm" onClick={onComment} aria-label="Comments" className="px-3">
        <ChatRoundLineLinear size={20} />
        <span className="tabular-nums">{formatCompactNumber(comments)}</span>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="subtle" size="icon-sm" onClick={onShare} aria-label="Share">
            <ShareLinear size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>
      {inspireHref && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="subtle" size="sm" className="px-3 text-cat-community hover:text-cat-community">
              <Link href={inspireHref} aria-label="This inspired me — share a similar deed">
                <StarRingsLinear size={20} />
                <span className="hidden sm:inline">Inspired</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>This inspired me — do it too</TooltipContent>
        </Tooltip>
      )}
      <div className="flex-1" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="subtle"
            size="icon-sm"
            onClick={onSave}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Remove from saved" : "Save"}
            className={cn(isSaved && "bg-secondary text-forest hover:bg-secondary")}
          >
            <BookmarkLinear size={20} className={cn(isSaved && "fill-current")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isSaved ? "Saved" : "Save for later"}</TooltipContent>
      </Tooltip>
    </div>
  );
}
