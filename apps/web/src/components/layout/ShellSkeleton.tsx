import { LeafLinear } from "solar-icon-set";

export function ShellSkeleton({ label = "Gathering good deeds…" }: { label?: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background text-forest">
      <span className="flex size-14 animate-pulse items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
        <LeafLinear size={28} />
      </span>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
