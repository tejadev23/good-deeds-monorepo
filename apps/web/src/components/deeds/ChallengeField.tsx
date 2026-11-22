"use client";

import { FlagLinear } from "solar-icon-set";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChallenges } from "@/hooks/useChallenges";

import { FieldError } from "./FieldError";

const NONE = "none";

type Props = {
  challengeId: string;
  amount: string;
  amountError?: string;
  onChallenge: (id: string) => void;
  onAmount: (amount: string) => void;
};

export function ChallengeField({ challengeId, amount, amountError, onChallenge, onAmount }: Props) {
  const { active } = useChallenges();
  if (active.length === 0) return null;
  const selected = active.find((v) => v.challenge.id === challengeId)?.challenge;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <Label htmlFor="challenge">
          <FlagLinear size={16} /> Count it towards a challenge
        </Label>
        <span className="text-xs text-muted-foreground">Optional</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <Select value={challengeId || NONE} onValueChange={(v) => onChallenge(v === NONE ? "" : v)}>
          <SelectTrigger id="challenge">
            <SelectValue placeholder="Not part of a challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Not part of a challenge</SelectItem>
            {active.map(({ challenge }) => (
              <SelectItem key={challenge.id} value={challenge.id}>
                {challenge.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected && (
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              value={amount}
              onChange={(e) => onAmount(e.target.value)}
              placeholder="How many?"
              aria-label={`Number of ${selected.unit}`}
              aria-invalid={Boolean(amountError)}
              className="pr-24"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 max-w-20 -translate-y-1/2 truncate text-xs text-muted-foreground">{selected.unit}</span>
          </div>
        )}
      </div>
      <FieldError id="challenge-amount-error" message={amountError} />
    </div>
  );
}
