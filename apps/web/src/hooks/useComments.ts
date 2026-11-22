"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { errorMessage } from "@/services";
import { useDeedStore } from "@/store/deedStore";

import { useCurrentUserId } from "./useCurrentUser";

export function useComments(deedId: string) {
  const viewerId = useCurrentUserId();
  const allComments = useDeedStore((s) => s.comments);
  const addCommentAction = useDeedStore((s) => s.addComment);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const comments = useMemo(
    () => allComments.filter((c) => c.deedId === deedId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [allComments, deedId],
  );

  const submit = async () => {
    if (!viewerId || !draft.trim()) return;
    setSending(true);
    try {
      await addCommentAction(deedId, viewerId, draft);
      setDraft("");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return { comments, draft, setDraft, sending, submit, canSubmit: draft.trim().length > 0 && !sending };
}
