"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { challengeProgress, challengeStatus } from "@/lib/challenges";
import { errorMessage } from "@/services";
import { useChallengeStore } from "@/store/challengeStore";
import { useDeedStore } from "@/store/deedStore";
import type { Challenge, ChallengeStatus } from "@/types";

import { useCurrentUserId } from "./useCurrentUser";

export interface ChallengeView {
  challenge: Challenge;
  status: ChallengeStatus;
  progress: ReturnType<typeof challengeProgress>;
}

export function useChallenges() {
  const challenges = useChallengeStore((s) => s.challenges);
  const status = useChallengeStore((s) => s.status);
  const deeds = useDeedStore((s) => s.deeds);

  const views = useMemo<ChallengeView[]>(
    () => challenges.map((challenge) => ({ challenge, status: challengeStatus(challenge), progress: challengeProgress(challenge, deeds) })),
    [challenges, deeds],
  );

  return {
    status,
    all: views,
    active: views.filter((v) => v.status === "active").sort((a, b) => a.challenge.endDate.localeCompare(b.challenge.endDate)),
    upcoming: views.filter((v) => v.status === "upcoming"),
    completed: views.filter((v) => v.status === "completed"),
  };
}

export function useChallengeParticipation(challenge: Challenge) {
  const viewerId = useCurrentUserId();
  const setParticipation = useChallengeStore((s) => s.setParticipation);
  const [pending, setPending] = useState(false);
  const joined = viewerId ? challenge.participantIds.includes(viewerId) : false;
  const ended = challengeStatus(challenge) === "completed";

  const toggle = async () => {
    if (!viewerId || ended) return;
    setPending(true);
    try {
      await setParticipation(challenge.id, viewerId, !joined);
      toast.success(joined ? "You've left the challenge" : `You joined ${challenge.title} 🎉`, {
        description: joined ? undefined : "Log a deed any time to add to the community total.",
      });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setPending(false);
    }
  };

  return { joined, ended, pending, toggle };
}
