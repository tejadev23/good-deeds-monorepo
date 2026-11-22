"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_LIST } from "@/config/categories";
import { cn } from "@/lib/utils";
import type { DeedCategory } from "@/types";

type FeedFiltersProps = {
  category: DeedCategory | "all";
  scope: "all" | "following";
  onCategory: (category: DeedCategory | "all") => void;
  onScope: (scope: "all" | "following") => void;
};

export function FeedFilters({ category, scope, onCategory, onScope }: FeedFiltersProps) {
  return (
    <div className="space-y-3">
      <Tabs value={scope} onValueChange={(v) => onScope(v as "all" | "following")}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:px-6">
            Everyone
          </TabsTrigger>
          <TabsTrigger value="following" className="flex-1 sm:px-6">
            Following
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
        <Button
          size="xs"
          variant={category === "all" ? "default" : "outline"}
          onClick={() => onCategory("all")}
          aria-pressed={category === "all"}
          className="h-9 px-4 text-sm"
        >
          All deeds
        </Button>
        {CATEGORY_LIST.map(({ id, label, icon: Icon, textClass, bgClass }) => {
          const active = category === id;
          return (
            <Button
              key={id}
              size="xs"
              variant="outline"
              onClick={() => onCategory(active ? "all" : id)}
              aria-pressed={active}
              className={cn("h-9 px-4 text-sm", active && cn(bgClass, textClass, "border-transparent hover:opacity-90"))}
            >
              <Icon size={16} className={cn(!active && textClass)} />
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
