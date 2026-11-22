"use client";

import { Plain2Linear } from "solar-icon-set";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type CommentComposerProps = {
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
  sending: boolean;
  canSubmit: boolean;
  autoFocus?: boolean;
};

export function CommentComposer({ draft, onDraftChange, onSubmit, sending, canSubmit, autoFocus }: CommentComposerProps) {
  const viewer = useCurrentUser();
  if (!viewer) return null;

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <UserAvatar user={viewer} size="sm" />
      <Input
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        placeholder="Add a kind word…"
        aria-label="Write a comment"
        maxLength={500}
        autoFocus={autoFocus}
        className="h-10 rounded-full"
      />
      <Button type="submit" size="icon-sm" disabled={!canSubmit} loading={sending} aria-label="Post comment">
        {!sending && <Plain2Linear size={18} />}
      </Button>
    </form>
  );
}
