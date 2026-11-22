"use client";

import { useEffect, useRef } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useComments } from "@/hooks/useComments";
import { useUsersById } from "@/hooks/useUsersById";
import type { Deed } from "@/types";

import { CommentComposer } from "./CommentComposer";
import { CommentList } from "./CommentList";

type CommentsDialogProps = { deed: Deed; open: boolean; onOpenChange: (open: boolean) => void };

export function CommentsDialog({ deed, open, onOpenChange }: CommentsDialogProps) {
  const usersById = useUsersById();
  const { comments, draft, setDraft, sending, submit, canSubmit } = useComments(deed.id);
  const listEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) listEnd.current?.scrollIntoView({ block: "end" });
  }, [open, comments.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription className="line-clamp-1">{deed.title}</DialogDescription>
        </DialogHeader>
        <div className="-mx-6 min-h-24 flex-1 overflow-y-auto px-6">
          <CommentList comments={comments} usersById={usersById} />
          <div ref={listEnd} />
        </div>
        <CommentComposer draft={draft} onDraftChange={setDraft} onSubmit={() => void submit()} sending={sending} canSubmit={canSubmit} autoFocus />
      </DialogContent>
    </Dialog>
  );
}
