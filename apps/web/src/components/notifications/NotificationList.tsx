"use client";

import { BellOffLinear } from "solar-icon-set";

import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { notificationGroup } from "@/lib/notification-text";
import type { AppNotification, Challenge, Deed, HelpRequest, User } from "@/types";

import { NotificationItem } from "./NotificationItem";

type Props = {
  items: AppNotification[];
  loading: boolean;
  usersById: Map<string, User>;
  deedsById: Map<string, Deed>;
  helpById: Map<string, HelpRequest>;
  challengesById: Map<string, Challenge>;
  onOpen: (n: AppNotification) => void;
};

export function NotificationList({ items, loading, usersById, deedsById, helpById, challengesById, onOpen }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState icon={BellOffLinear} title="Nothing here yet" description="When people appreciate your deeds or follow you, you'll see it here." />;
  }

  const groups = (["Today", "This week", "Earlier"] as const)
    .map((label) => ({ label, items: items.filter((n) => notificationGroup(n.createdAt) === label) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label} className="space-y-1">
          <h2 className="px-3 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.label}</h2>
          <ul className="space-y-1">
            {group.items.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                actor={n.actorId ? usersById.get(n.actorId) : undefined}
                deed={n.deedId ? deedsById.get(n.deedId) : undefined}
                helpRequest={n.helpRequestId ? helpById.get(n.helpRequestId) : undefined}
                challenge={n.challengeId ? challengesById.get(n.challengeId) : undefined}
                onOpen={() => onOpen(n)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
