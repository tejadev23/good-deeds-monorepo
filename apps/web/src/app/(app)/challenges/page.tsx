"use client";

import { FlagLinear } from "solar-icon-set";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Section } from "@/components/discover/Section";
import { Skeleton } from "@/components/ui/skeleton";
import { useChallenges, type ChallengeView } from "@/hooks/useChallenges";

function Grid({ views }: { views: ChallengeView[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {views.map((view) => (
        <ChallengeCard key={view.challenge.id} view={view} />
      ))}
    </div>
  );
}

export default function ChallengesPage() {
  const { status, active, upcoming, completed } = useChallenges();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community challenges"
        description="Shared goals we reach together. No leaderboards — every contribution moves the whole community forward."
      />
      {status === "loading" || status === "idle" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-80 rounded-3xl" />
          ))}
        </div>
      ) : (
        <>
          <Section title="Happening now" description="Join in and log a deed to add to the total.">
            {active.length > 0 ? <Grid views={active} /> : <EmptyState icon={FlagLinear} title="No active challenges right now" />}
          </Section>
          {upcoming.length > 0 && (
            <Section title="Coming up" description="Join early and get ready.">
              <Grid views={upcoming} />
            </Section>
          )}
          {completed.length > 0 && (
            <Section title="Completed together" description="What we achieved as a community.">
              <Grid views={completed} />
            </Section>
          )}
        </>
      )}
    </div>
  );
}
