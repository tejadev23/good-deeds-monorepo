"use client";

import { useState } from "react";
import { toast } from "sonner";

import { errorMessage } from "@/services";
import { useActivityStore } from "@/store/activityStore";
import type { CommunityActivity } from "@/types";

import { useCurrentUserId } from "./useCurrentUser";

export function useActivityJoin(activity: CommunityActivity) {
  const viewerId = useCurrentUserId();
  const toggleJoin = useActivityStore((s) => s.toggleJoin);
  const [pending, setPending] = useState(false);

  const isOrganizer = activity.organizerId === viewerId;
  const isJoined = viewerId ? activity.participantIds.includes(viewerId) : false;
  const isFull = !isJoined && activity.participantIds.length >= activity.spots;

  const toggle = async () => {
    if (!viewerId || isOrganizer) return;
    setPending(true);
    try {
      const joined = await toggleJoin(activity.id, viewerId);
      toast.success(joined ? "You're in! 🙌" : "You've left this activity", {
        description: joined ? "The organiser has been notified." : undefined,
      });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setPending(false);
    }
  };

  return { isOrganizer, isJoined, isFull, pending, toggle };
}
