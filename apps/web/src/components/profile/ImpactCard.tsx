import { PieChart2Linear } from "solar-icon-set";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LIST } from "@/config/categories";
import { cn } from "@/lib/utils";
import type { DeedCategory } from "@/types";

type ImpactCardProps = {
  breakdown: Record<DeedCategory, number>;
  total: number;
  monthly: { label: string; count: number }[];
};

export function ImpactCard({ breakdown, total, monthly }: ImpactCardProps) {
  const rows = CATEGORY_LIST.filter((c) => breakdown[c.id] > 0).sort((a, b) => breakdown[b.id] - breakdown[a.id]);
  const peak = Math.max(1, ...monthly.map((m) => m.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChart2Linear size={18} className="text-forest-soft" /> Contribution breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No deeds yet.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ id, label, icon: Icon, textClass, bgClass }) => {
              const count = breakdown[id];
              const pct = Math.round((count / Math.max(total, 1)) * 100);
              return (
                <li key={id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className={cn("flex size-6 items-center justify-center rounded-lg", bgClass, textClass)}>
                        <Icon size={14} />
                      </span>
                      {label}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {count} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full bg-current transition-all duration-700", textClass)} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last 6 months</p>
          <div className="flex h-24 items-end gap-2" role="img" aria-label={monthly.map((m) => `${m.label}: ${m.count}`).join(", ")}>
            {monthly.map((m) => (
              <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs tabular-nums text-muted-foreground">{m.count || ""}</span>
                <div className="w-full rounded-t-lg bg-sage/70" style={{ height: `${Math.max(4, (m.count / peak) * 64)}px` }} />
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
