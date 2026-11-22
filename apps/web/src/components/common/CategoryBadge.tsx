import { Badge, type BadgeProps } from "@/components/ui/badge";
import { CATEGORY_META } from "@/config/categories";
import type { DeedCategory } from "@/types";

export function CategoryBadge({ category, size = "sm", className }: { category: DeedCategory; size?: BadgeProps["size"]; className?: string }) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  return (
    <Badge variant={meta.tone} size={size} className={className}>
      <Icon size={14} />
      {meta.label}
    </Badge>
  );
}
