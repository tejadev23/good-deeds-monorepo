import { cn } from "@/lib/utils";

/** Dots for helpers offered vs needed: ●●○ 2 of 3 helpers. */
export function HelperProgress({ offered, needed }: { offered: number; needed: number }) {
  const dots = Math.min(needed, 8);
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: dots }, (_, i) => (
          <span key={i} className={cn("size-2.5 rounded-full", i < offered ? "bg-primary" : "bg-border")} />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {Math.min(offered, needed)} of {needed} helper{needed === 1 ? "" : "s"}
        {offered > needed && ` (+${offered - needed})`}
      </span>
    </div>
  );
}
