"use client";

import Link from "next/link";

import { ActivityCard } from "@/components/discover/ActivityCard";
import { UserRow } from "@/components/discover/UserRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useDiscover } from "@/hooks/useDiscover";
import { useUsersById } from "@/hooks/useUsersById";

export function RightRail() {
  const viewerId = useCurrentUserId();
  const { suggested, activities } = useDiscover("");
  const usersById = useUsersById();
  const upcoming = activities.filter((a) => a.organizerId !== viewerId).slice(0, 2);

  return (
    <aside className="sticky top-0 hidden h-dvh w-80 shrink-0 flex-col gap-5 overflow-y-auto py-6 pr-6 scrollbar-none xl:flex">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">People to follow</CardTitle>
          <Link href={ROUTES.discover} className="text-xs font-semibold text-primary hover:underline">
            See all
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggested.slice(0, 4).map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </CardContent>
      </Card>

      {upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcoming.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} organizer={usersById.get(activity.organizerId)} compact />
            ))}
          </CardContent>
        </Card>
      )}

      <p className="px-2 text-xs leading-relaxed text-muted-foreground">
        Good Deeds is a demo community — every person and post here is fictional. Small actions. A better world. 🌱
      </p>
    </aside>
  );
}
