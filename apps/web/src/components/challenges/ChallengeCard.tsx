"use client";

import Link from "next/link";
import { ClockCircleLinear } from "solar-icon-set";

import { AvatarStack } from "@/components/common/AvatarStack";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import type { ChallengeView } from "@/hooks/useChallenges";
import { useUsersById } from "@/hooks/useUsersById";
import { challengeTimeLabel } from "@/lib/challenges";
import { cn } from "@/lib/utils";

import { ChallengeProgress } from "./ChallengeProgress";
import { JoinChallengeButton } from "./JoinChallengeButton";

export function ChallengeCard({ view, className }: { view: ChallengeView; className?: string }) {
  const { challenge, status, progress } = view;
  const usersById = useUsersById();
  const participants = challenge.participantIds.map((id) => usersById.get(id)).filter((u) => u !== undefined);

  return (
    <article className={cn("flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-shadow hover:shadow-lift", className)}>
      <Link href={ROUTES.challenge(challenge.id)} className="relative block">
        <SmartImage src={challenge.coverUrl} alt={challenge.title} wrapperClassName="aspect-[16/9]" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <CategoryBadge category={challenge.category} />
          <Badge variant={status === "active" ? "default" : "muted"} className="shadow-sm">
            <ClockCircleLinear size={12} /> {challengeTimeLabel(challenge)}
          </Badge>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={ROUTES.challenge(challenge.id)} className="space-y-0.5">
          <h3 className="text-lg font-semibold leading-snug text-forest hover:underline">{challenge.title}</h3>
          <p className="text-sm text-muted-foreground">{challenge.tagline}</p>
        </Link>
        {status !== "upcoming" && <ChallengeProgress total={progress.total} goal={challenge.goal} percent={progress.percent} unit={challenge.unit} />}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <AvatarStack users={participants} />
          <JoinChallengeButton challenge={challenge} size="xs" />
        </div>
      </div>
    </article>
  );
}
