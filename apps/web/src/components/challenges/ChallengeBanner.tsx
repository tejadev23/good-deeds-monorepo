"use client";

import Link from "next/link";
import { AltArrowRightLinear, FlagLinear } from "solar-icon-set";

import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import { useChallenges } from "@/hooks/useChallenges";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { challengeTimeLabel } from "@/lib/challenges";
import { formatNumber } from "@/lib/format";

/** Active community challenges, shown at the top of the feed. */
export function ChallengeBanner() {
  const viewerId = useCurrentUserId();
  const { active } = useChallenges();
  if (active.length === 0) return null;

  return (
    <section aria-labelledby="challenges-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="challenges-heading" className="flex items-center gap-2 font-sans text-sm font-semibold text-forest">
          <FlagLinear size={16} /> Community challenges
        </h2>
        <Link href={ROUTES.challenges} className="flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline">
          See all <AltArrowRightLinear size={14} />
        </Link>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0">
        {active.map(({ challenge, progress }) => {
          const joined = viewerId ? challenge.participantIds.includes(viewerId) : false;
          return (
            <Link
              key={challenge.id}
              href={ROUTES.challenge(challenge.id)}
              className="group relative flex w-72 shrink-0 snap-start overflow-hidden rounded-3xl bg-forest text-primary-foreground shadow-soft sm:w-80"
            >
              <SmartImage src={challenge.coverUrl} alt="" wrapperClassName="absolute inset-0" className="opacity-60 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/20" />
              <div className="relative flex w-full flex-col gap-3 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-primary-foreground/85">
                  <span>{challengeTimeLabel(challenge)}</span>
                  {joined && <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5">Joined ✓</span>}
                </div>
                <div className="mt-6 space-y-0.5">
                  <h3 className="text-lg font-semibold leading-tight">{challenge.title}</h3>
                  <p className="text-xs text-primary-foreground/80">
                    {formatNumber(progress.total)} of {formatNumber(challenge.goal)} {challenge.unit} · {challenge.participantIds.length} people
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/20">
                  <div className="h-full rounded-full bg-sage" style={{ width: `${progress.percent}%` }} />
                </div>
                <Button asChild size="xs" variant="secondary" className="self-start">
                  <span>{joined ? "Log a deed" : "Take part"}</span>
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
