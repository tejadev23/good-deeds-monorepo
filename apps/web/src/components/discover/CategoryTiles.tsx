"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CATEGORY_LIST } from "@/config/categories";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feedStore";
import type { DeedCategory } from "@/types";

export function CategoryTiles({ totals }: { totals: Record<DeedCategory, number> }) {
  const router = useRouter();
  const setCategory = useFeedStore((s) => s.setCategory);
  const ranked = [...CATEGORY_LIST].sort((a, b) => totals[b.id] - totals[a.id]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {ranked.map(({ id, label, description, icon: Icon, textClass, bgClass }) => (
        <Button
          key={id}
          variant="bare"
          size="bare"
          onClick={() => {
            setCategory(id);
            router.push(ROUTES.feed);
          }}
          className={cn("flex h-full flex-col items-start justify-between gap-6 rounded-3xl p-4 text-left transition-transform hover:-translate-y-0.5", bgClass)}
        >
          <span className={cn("flex size-11 items-center justify-center rounded-2xl bg-card/80", textClass)}>
            <Icon size={22} />
          </span>
          <span className="space-y-0.5">
            <span className={cn("block font-display text-lg font-semibold", textClass)}>{label}</span>
            <span className="block text-xs text-foreground/70">{totals[id]} deeds · {description}</span>
          </span>
        </Button>
      ))}
    </div>
  );
}
