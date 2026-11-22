"use client";

import { useState } from "react";
import { AddCircleLinear, HandShakeLinear } from "solar-icon-set";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { HelpRequestCard } from "@/components/help/HelpRequestCard";
import { HelpRequestDialog } from "@/components/help/HelpRequestDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_LIST } from "@/config/categories";
import { useHelpBoard, type HelpFilter } from "@/hooks/useHelp";
import { cn } from "@/lib/utils";
import type { DeedCategory, HelpRequest } from "@/types";

const FILTERS: { value: HelpFilter; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "helping", label: "I'm helping" },
  { value: "mine", label: "My requests" },
  { value: "fulfilled", label: "Fulfilled" },
];

const EMPTY_COPY: Record<HelpFilter, string> = {
  open: "No open requests in this category right now.",
  helping: "When you offer to help someone, it shows up here.",
  mine: "Need a hand with something good? Ask the community.",
  fulfilled: "Fulfilled requests will appear here.",
};

export default function HelpBoardPage() {
  const [filter, setFilter] = useState<HelpFilter>("open");
  const [category, setCategory] = useState<DeedCategory | "all">("all");
  const [asking, setAsking] = useState(false);
  const { items, counts, status } = useHelpBoard(filter, category);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help board"
        description="Good deeds often start with someone asking. Offer a hand, or ask for one."
        actions={
          <Button onClick={() => setAsking(true)}>
            <AddCircleLinear size={18} /> Ask for help
          </Button>
        }
      />

      <div className="space-y-3">
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as HelpFilter)}>
            <TabsList>
              {FILTERS.map((f) => (
                <TabsTrigger key={f.value} value={f.value}>
                  {f.label} <span className="tabular-nums text-muted-foreground">{counts[f.value]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
          <Button size="xs" variant={category === "all" ? "default" : "outline"} className="h-9 px-4 text-sm" onClick={() => setCategory("all")} aria-pressed={category === "all"}>
            All causes
          </Button>
          {CATEGORY_LIST.map(({ id, label, icon: Icon, textClass, bgClass }) => {
            const active = category === id;
            return (
              <Button
                key={id}
                size="xs"
                variant="outline"
                aria-pressed={active}
                onClick={() => setCategory(active ? "all" : id)}
                className={cn("h-9 px-4 text-sm", active && cn(bgClass, textClass, "border-transparent"))}
              >
                <Icon size={16} className={cn(!active && textClass)} /> {label}
              </Button>
            );
          })}
        </div>
      </div>

      <BoardBody loading={status === "loading" || status === "idle"} items={items} emptyText={EMPTY_COPY[filter]} onAsk={() => setAsking(true)} />

      <HelpRequestDialog open={asking} onOpenChange={setAsking} />
    </div>
  );
}

function BoardBody({ loading, items, emptyText, onAsk }: { loading: boolean; items: HelpRequest[]; emptyText: string; onAsk: () => void }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-72 rounded-3xl" />
        ))}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <EmptyState
        icon={HandShakeLinear}
        title="Nothing here yet"
        description={emptyText}
        action={
          <Button size="sm" variant="outline" onClick={onAsk}>
            Ask for help
          </Button>
        }
      />
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <HelpRequestCard key={r.id} request={r} />
      ))}
    </div>
  );
}
