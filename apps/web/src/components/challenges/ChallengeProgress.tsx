import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { total: number; goal: number; percent: number; unit: string; size?: "sm" | "lg"; className?: string };

export function ChallengeProgress({ total, goal, percent, unit, size = "sm", className }: Props) {
  const reached = total >= goal;
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <p className={cn("font-semibold text-forest", size === "lg" ? "text-2xl font-display" : "text-sm")}>
          {formatNumber(total)} <span className="font-sans text-sm font-normal text-muted-foreground">of {formatNumber(goal)} {unit}</span>
        </p>
        <span className={cn("text-xs font-semibold tabular-nums", reached ? "text-cat-environment" : "text-muted-foreground")}>
          {reached ? "Goal reached 🎉" : `${percent}%`}
        </span>
      </div>
      <div
        className={cn("overflow-hidden rounded-full bg-muted", size === "lg" ? "h-3.5" : "h-2.5")}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={total}
        aria-label={`${total} of ${goal} ${unit}`}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-sage to-primary transition-all duration-1000" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
