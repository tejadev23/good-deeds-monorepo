import Link from "next/link";
import { LeafLinear } from "solar-icon-set";

import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

export function Logo({ className, showTagline = false, href = ROUTES.feed }: { className?: string; showTagline?: boolean; href?: string }) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:-rotate-6">
        <LeafLinear size={22} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold text-forest">Good Deeds</span>
        {showTagline && <span className="mt-1 text-xs font-medium text-muted-foreground">Small actions. A better world.</span>}
      </span>
    </Link>
  );
}
