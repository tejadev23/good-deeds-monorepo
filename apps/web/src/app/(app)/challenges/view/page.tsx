"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AddCircleLinear, CalendarLinear, ClockCircleLinear, FlagLinear, LightbulbLinear } from "solar-icon-set";

import { BackButton } from "@/components/common/BackButton";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ChallengeProgress } from "@/components/challenges/ChallengeProgress";
import { JoinChallengeButton } from "@/components/challenges/JoinChallengeButton";
import { DeedList } from "@/components/deeds/DeedList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import { useChallenges } from "@/hooks/useChallenges";
import { useUsersById } from "@/hooks/useUsersById";
import { challengeContributions, challengeTimeLabel } from "@/lib/challenges";
import { formatDate } from "@/lib/format";
import { useDeedStore } from "@/store/deedStore";

function ChallengeDetail() {
  const id = useSearchParams().get("id") ?? "";
  const { all, status } = useChallenges();
  const deeds = useDeedStore((s) => s.deeds);
  const usersById = useUsersById();
  const view = all.find((v) => v.challenge.id === id);
  const contributions = useMemo(() => challengeContributions(id, deeds), [id, deeds]);

  if (!view) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <BackButton />
        {status === "ready" && <EmptyState icon={FlagLinear} title="Challenge not found" description="It may have been removed." />}
      </div>
    );
  }

  const { challenge, progress } = view;
  const participants = challenge.participantIds.map((pid) => usersById.get(pid)).filter((u) => u !== undefined);
  const canLog = view.status === "active";

  return (
    <div className="space-y-6">
      <BackButton />
      <section className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft">
        <div className="relative">
          <SmartImage src={challenge.coverUrl} alt={challenge.title} wrapperClassName="h-48 sm:h-64" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 text-primary-foreground sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={challenge.category} />
              <span className="flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-forest">
                <ClockCircleLinear size={12} /> {challengeTimeLabel(challenge)}
              </span>
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{challenge.title}</h1>
            <p className="text-primary-foreground/85">{challenge.tagline}</p>
          </div>
        </div>
        <div className="space-y-5 p-5 sm:p-7">
          {view.status !== "upcoming" && <ChallengeProgress size="lg" total={progress.total} goal={challenge.goal} percent={progress.percent} unit={challenge.unit} />}
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarLinear size={16} /> {formatDate(challenge.startDate, "d MMM")} – {formatDate(challenge.endDate, "d MMM yyyy")}
          </p>
          <p className="max-w-3xl text-base leading-relaxed text-foreground/85">{challenge.description}</p>
          <div className="flex flex-wrap gap-2">
            <JoinChallengeButton challenge={challenge} />
            {canLog && (
              <Button asChild size="sm" variant="secondary">
                <Link href={ROUTES.createForChallenge(challenge.id)}>
                  <AddCircleLinear size={16} /> Log a deed for this challenge
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <aside className="space-y-5 lg:order-last">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LightbulbLinear size={18} className="text-sun" /> Ways to take part
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-foreground/85">
                {challenge.ideas.map((idea) => (
                  <li key={idea} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
                    {idea}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{participants.length} people taking part</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {participants.map((u) => (
                <UserAvatar key={u.id} user={u} size="sm" linked />
              ))}
            </CardContent>
          </Card>
        </aside>
        <section className="min-w-0 space-y-4">
          <h2 className="text-xl font-semibold text-forest">Contributions</h2>
          {contributions.length === 0 ? (
            <EmptyState icon={FlagLinear} title="No deeds logged yet" description="Be the first to add one to this challenge." />
          ) : (
            <DeedList deeds={contributions} resetKey={challenge.id} />
          )}
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ChallengeDetail />
    </Suspense>
  );
}
