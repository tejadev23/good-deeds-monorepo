"use client";

import { CloseCircleLinear, StarRingsLinear } from "solar-icon-set";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { useUsersById } from "@/hooks/useUsersById";
import { useDeedStore } from "@/store/deedStore";

export function InspiredByPreview({ deedId, onRemove }: { deedId: string; onRemove: () => void }) {
  const deed = useDeedStore((s) => s.deeds.find((d) => d.id === deedId));
  const author = useUsersById().get(deed?.authorId ?? "");
  if (!deed) return null;

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-cat-community/30 bg-cat-community-subtle/60 p-3">
      {deed.images[0] ? (
        <SmartImage src={deed.images[0]} alt="" wrapperClassName="size-14 shrink-0 rounded-2xl" />
      ) : (
        author && <UserAvatar user={author} size="lg" />
      )}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cat-community">
          <StarRingsLinear size={14} /> Inspired by
        </p>
        <p className="truncate text-sm font-semibold">{deed.title}</p>
        <p className="truncate text-xs text-muted-foreground">by {author?.name} · they&apos;ll be notified when you post</p>
      </div>
      <Button type="button" variant="subtle" size="icon-xs" onClick={onRemove} aria-label="Remove inspiration link">
        <CloseCircleLinear size={18} />
      </Button>
    </div>
  );
}
