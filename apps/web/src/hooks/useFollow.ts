"use client";

import { useState } from "react";
import { toast } from "sonner";

import { errorMessage } from "@/services";
import { useUserStore } from "@/store/userStore";

import { useCurrentUserId } from "./useCurrentUser";

export function useFollow(targetId: string) {
  const viewerId = useCurrentUserId();
  const isFollowing = useUserStore((s) => s.follows.some((f) => f.followerId === viewerId && f.followingId === targetId));
  const followsYou = useUserStore((s) => s.follows.some((f) => f.followerId === targetId && f.followingId === viewerId));
  const setFollowing = useUserStore((s) => s.setFollowing);
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    if (!viewerId || viewerId === targetId) return;
    setPending(true);
    try {
      await setFollowing(viewerId, targetId, !isFollowing);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setPending(false);
    }
  };

  return { isFollowing, followsYou, isSelf: viewerId === targetId, pending, toggle };
}
