"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GalleryAddLinear, UserCrossRoundedLinear } from "solar-icon-set";

import { BackButton } from "@/components/common/BackButton";
import { EmptyState } from "@/components/common/EmptyState";
import { FeedSkeleton } from "@/components/deeds/DeedCardSkeleton";
import { DeedList } from "@/components/deeds/DeedList";
import { BadgeShelf } from "@/components/profile/BadgeShelf";
import { FeaturedDeed } from "@/components/profile/FeaturedDeed";
import { FollowListDialog, type FollowTab } from "@/components/profile/FollowListDialog";
import { ImpactCard } from "@/components/profile/ImpactCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useProfile } from "@/hooks/useProfile";
import { contributionSummary, monthlyActivity } from "@/lib/profile-story";

function Profile() {
  const username = useSearchParams().get("name") ?? "";
  const viewerId = useCurrentUserId();
  const profile = useProfile(username);
  const [followTab, setFollowTab] = useState<FollowTab | null>(null);

  const monthly = useMemo(() => (profile.user ? monthlyActivity(profile.deeds) : []), [profile]);

  if (!profile.user) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <BackButton />
        <EmptyState icon={UserCrossRoundedLinear} title="We couldn't find that person" description="The profile may not exist in this demo community." />
      </div>
    );
  }

  const { user, stats, deeds, featured, badges, followers, following, status } = profile;
  const isSelf = user.id === viewerId;
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={user}
        stats={stats}
        isSelf={isSelf}
        summary={contributionSummary(user, stats, isSelf)}
        onShowFollowers={() => setFollowTab("followers")}
        onShowFollowing={() => setFollowTab("following")}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <aside className="space-y-5 lg:order-last">
          {featured && <FeaturedDeed deed={featured} />}
          <BadgeShelf badges={badges} possessive={isSelf ? "your" : `${firstName}'s`} />
          <ImpactCard breakdown={stats.categoryBreakdown} total={stats.totalDeeds} monthly={monthly} />
        </aside>

        <section className="min-w-0 space-y-4" aria-labelledby="deed-history">
          <h2 id="deed-history" className="text-xl font-semibold text-forest">
            {isSelf ? "Your deeds" : `${firstName}'s deeds`}
          </h2>
          {status === "loading" && <FeedSkeleton count={2} />}
          {status !== "loading" && deeds.length === 0 && (
            <EmptyState
              icon={GalleryAddLinear}
              title={isSelf ? "Share your first good deed" : "No deeds shared yet"}
              description={isSelf ? "It doesn't have to be big. Watering a plant counts." : undefined}
              action={
                isSelf && (
                  <Button asChild size="sm">
                    <Link href={ROUTES.create}>Share a deed</Link>
                  </Button>
                )
              }
            />
          )}
          {deeds.length > 0 && <DeedList deeds={deeds} resetKey={user.id} />}
        </section>
      </div>

      <FollowListDialog name={user.name} open={followTab} onOpenChange={setFollowTab} followers={followers} following={following} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Profile />
    </Suspense>
  );
}
