"use client";

import { useState } from "react";
import { toast } from "sonner";

import { absoluteUrl, ROUTES } from "@/config/routes";
import { errorMessage } from "@/services";
import { useDeedStore } from "@/store/deedStore";
import type { Deed } from "@/types";

import { useCurrentUserId } from "./useCurrentUser";

export function useDeedActions(deed: Deed) {
  const viewerId = useCurrentUserId();
  const toggleLikeAction = useDeedStore((s) => s.toggleLike);
  const toggleSaveAction = useDeedStore((s) => s.toggleSave);
  const removeAction = useDeedStore((s) => s.removeDeed);
  const isSaved = useDeedStore((s) => s.savedIds.includes(deed.id));
  const commentCount = useDeedStore((s) => s.comments.filter((c) => c.deedId === deed.id).length);
  const [deleting, setDeleting] = useState(false);

  const isLiked = viewerId ? deed.likedBy.includes(viewerId) : false;
  const isOwner = viewerId === deed.authorId;

  const toggleLike = async () => {
    if (!viewerId) return;
    try {
      await toggleLikeAction(deed.id, viewerId);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const toggleSave = async () => {
    if (!viewerId) return;
    try {
      const saved = await toggleSaveAction(deed.id, viewerId);
      toast.success(saved ? "Saved to your collection" : "Removed from saved");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const share = async () => {
    const url = absoluteUrl(ROUTES.deed(deed.id));
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: deed.title, text: `${deed.title} — on Good Deeds`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: "Share it and inspire someone today." });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.message("Copy this link", { description: url });
    }
  };

  const remove = async () => {
    if (!viewerId) return false;
    setDeleting(true);
    try {
      await removeAction(deed.id, viewerId);
      toast.success("Deed deleted");
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { isLiked, isSaved, isOwner, commentCount, deleting, toggleLike, toggleSave, share, remove };
}
