import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions, className }: { title: string; description?: string; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-forest sm:text-3xl">{title}</h1>
        {description && <p className="text-sm text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
