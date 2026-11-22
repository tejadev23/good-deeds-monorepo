"use client";

import { CheckCircleLinear, FlagLinear } from "solar-icon-set";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useChallengeParticipation } from "@/hooks/useChallenges";
import type { Challenge } from "@/types";

export function JoinChallengeButton({ challenge, size = "sm", className }: { challenge: Challenge; size?: ButtonProps["size"]; className?: string }) {
  const { joined, ended, pending, toggle } = useChallengeParticipation(challenge);
  if (ended) return null;
  return (
    <Button
      size={size}
      variant={joined ? "outline" : "default"}
      loading={pending}
      onClick={(e) => {
        e.preventDefault();
        void toggle();
      }}
      aria-pressed={joined}
      className={className}
    >
      {!pending && (joined ? <CheckCircleLinear size={16} /> : <FlagLinear size={16} />)}
      {joined ? "Joined" : "Join challenge"}
    </Button>
  );
}
