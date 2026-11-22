"use client";

import { Button } from "@/components/ui/button";
import { CATEGORY_LIST } from "@/config/categories";
import { cn } from "@/lib/utils";
import type { DeedCategory } from "@/types";

type Props = { value: DeedCategory | ""; onChange: (value: DeedCategory) => void; invalid?: boolean };

export function CategoryPicker({ value, onChange, invalid }: Props) {
  return (
    <div role="radiogroup" aria-label="Category" aria-invalid={invalid} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {CATEGORY_LIST.map(({ id, label, description, icon: Icon, textClass, bgClass }) => {
        const selected = value === id;
        return (
          <Button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            variant="bare"
            size="bare"
            onClick={() => onChange(id)}
            className={cn(
              "flex h-full flex-col items-start justify-start gap-2 rounded-2xl border bg-card p-3 text-left transition-all hover:border-sage",
              selected ? "border-primary ring-2 ring-primary/20" : "border-border",
              invalid && !value && "border-destructive/60",
            )}
          >
            <span className={cn("flex size-9 items-center justify-center rounded-xl", bgClass, textClass)}>
              <Icon size={20} />
            </span>
            <span className="text-sm font-semibold">{label}</span>
            <span className="hidden text-xs leading-snug text-muted-foreground sm:block">{description}</span>
          </Button>
        );
      })}
    </div>
  );
}
