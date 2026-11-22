"use client";

import { useUnreadCount } from "@/hooks/useNotificationsView";
import { cn } from "@/lib/utils";

export function NotificationDot({ className, showCount = true }: { className?: string; showCount?: boolean }) {
  const unread = useUnreadCount();
  if (unread === 0) return null;
  return (
    <span
      className={cn(
        "flex min-w-5 items-center justify-center rounded-full bg-heart px-1.5 text-xs font-bold leading-5 text-primary-foreground ring-2 ring-background",
        !showCount && "size-2.5 min-w-0 p-0",
        className,
      )}
      aria-label={`${unread} unread notifications`}
    >
      {showCount ? (unread > 9 ? "9+" : unread) : null}
    </span>
  );
}
