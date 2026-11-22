"use client";

import Link from "next/link";
import { FlagLinear } from "solar-icon-set";

import { ROUTES } from "@/config/routes";
import { formatCompactNumber } from "@/lib/format";
import { useChallengeStore } from "@/store/challengeStore";
import type { DeedChallengeContribution } from "@/types";

export function ChallengeTag({ contribution }: { contribution: DeedChallengeContribution }) {
  const challenge = useChallengeStore((s) => s.challenges.find((c) => c.id === contribution.challengeId));
  if (!challenge) return null;
  return (
    <Link
      href={ROUTES.challenge(challenge.id)}
      className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-cat-education-subtle px-3 py-1 text-xs font-semibold text-cat-education transition-transform hover:scale-[1.03]"
    >
      <FlagLinear size={14} className="shrink-0" />
      <span className="truncate">
        +{formatCompactNumber(contribution.amount)} {challenge.unit} · {challenge.title}
      </span>
    </Link>
  );
}
