"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckReadLinear } from "solar-icon-set";

import { PageHeader } from "@/components/common/PageHeader";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useNotificationsView, type NotificationFilter } from "@/hooks/useNotificationsView";
import { useUsersById } from "@/hooks/useUsersById";
import { useChallengeStore } from "@/store/challengeStore";
import { useDeedStore } from "@/store/deedStore";
import { useHelpStore } from "@/store/helpStore";
import { useNotificationStore } from "@/store/notificationStore";

const FILTERS: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "like", label: "Likes" },
  { value: "comment", label: "Comments" },
  { value: "follow", label: "Follows" },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const viewerId = useCurrentUserId();
  const reload = useNotificationStore((s) => s.load);
  const { items, status, unread, markRead, markEverythingRead } = useNotificationsView(filter);
  const usersById = useUsersById();
  const deeds = useDeedStore((s) => s.deeds);
  const deedsById = useMemo(() => new Map(deeds.map((d) => [d.id, d])), [deeds]);
  const helpRequests = useHelpStore((s) => s.requests);
  const challenges = useChallengeStore((s) => s.challenges);
  const helpById = useMemo(() => new Map(helpRequests.map((r) => [r.id, r])), [helpRequests]);
  const challengesById = useMemo(() => new Map(challenges.map((c) => [c.id, c])), [challenges]);

  // Refresh on visit so interactions from other demo accounts show up.
  useEffect(() => {
    if (viewerId) void reload(viewerId);
  }, [viewerId, reload]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description={unread > 0 ? `You have ${unread} new update${unread === 1 ? "" : "s"}.` : "You're all caught up."}
        actions={
          <Button variant="outline" size="sm" onClick={() => void markEverythingRead()} disabled={unread === 0}>
            <CheckReadLinear size={18} /> Mark all read
          </Button>
        }
      />
      <Tabs value={filter} onValueChange={(v) => setFilter(v as NotificationFilter)}>
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
                {f.value === "unread" && unread > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{unread}</span>}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      <Card className="p-2">
        <NotificationList
          items={items}
          loading={status === "loading" || status === "idle"}
          usersById={usersById}
          deedsById={deedsById}
          helpById={helpById}
          challengesById={challengesById}
          onOpen={(n) => {
            if (!n.read) void markRead(n.id);
          }}
        />
      </Card>
    </div>
  );
}
