"use client";

import { DangerCircleLinear, RestartLinear } from "solar-icon-set";

import { Button } from "@/components/ui/button";

import { EmptyState } from "./EmptyState";

export function ErrorState({ message = "We couldn't load this right now.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={DangerCircleLinear}
      title="Something went wrong"
      description={message}
      action={
        onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RestartLinear size={16} />
            Try again
          </Button>
        )
      }
    />
  );
}
