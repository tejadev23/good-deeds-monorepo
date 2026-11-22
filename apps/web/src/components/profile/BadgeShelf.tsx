import { MedalRibbonStarLinear } from "solar-icon-set";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BadgeMeta } from "@/config/badges";
import { cn } from "@/lib/utils";

export function BadgeShelf({ badges, possessive }: { badges: BadgeMeta[]; possessive: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MedalRibbonStarLinear size={18} className="text-sun" /> Recognition
        </CardTitle>
        <CardDescription>Badges celebrate {possessive} kindness — they&apos;re never points or prizes.</CardDescription>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <p className="text-sm text-muted-foreground">Badges appear as deeds are shared.</p>
        ) : (
          <ul className="grid gap-2">
            {badges.map(({ id, name, description, icon: Icon, className }) => (
              <li key={id} className="flex items-center gap-3 rounded-2xl border border-border/70 p-2.5">
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-full shadow-inner", className)}>
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs leading-snug text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
