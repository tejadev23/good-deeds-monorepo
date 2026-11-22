import type { ComponentType, ReactNode } from "react";
import type { SolarIconProps } from "solar-icon-set";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: ComponentType<SolarIconProps>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-14 text-center", className)}>
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-forest">
        <Icon size={26} />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
