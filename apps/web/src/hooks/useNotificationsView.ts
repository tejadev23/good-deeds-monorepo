"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import { errorMessage } from "@/services";
import { useNotificationStore } from "@/store/notificationStore";

import { useCurrentUserId } from "./useCurrentUser";

export type NotificationFilter = "all" | "unread" | "like" | "comment" | "follow";

export function useUnreadCount(): number {
  return useNotificationStore((s) => s.items.filter((n) => !n.read).length);
}

export function useNotificationsView(filter: NotificationFilter) {
  const viewerId = useCurrentUserId();
  const { items, status, markRead, markAllRead } = useNotificationStore();

  const visible = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((n) => !n.read);
    return items.filter((n) => n.type === filter);
  }, [items, filter]);

  const unread = items.filter((n) => !n.read).length;

  const markEverythingRead = async () => {
    if (!viewerId) return;
    try {
      await markAllRead(viewerId);
      toast.success("You're all caught up");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return { items: visible, status, unread, markRead, markEverythingRead };
}
