"use client";

import { MagniferLinear, UsersGroupRoundedLinear } from "solar-icon-set";
import Link from "next/link";

import { EmptyState } from "@/components/common/EmptyState";
import { HelpTeaser } from "@/components/help/HelpTeaser";
import { ErrorState } from "@/components/common/ErrorState";
import { ComposerPrompt } from "@/components/deeds/ComposerPrompt";
import { FeedSkeleton } from "@/components/deeds/DeedCardSkeleton";
import { DeedList } from "@/components/deeds/DeedList";
import { FeedFilters } from "@/components/deeds/FeedFilters";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFeed } from "@/hooks/useFeed";
import { timeOfDayGreeting } from "@/lib/greeting";
import { useDeedStore } from "@/store/deedStore";

export default function FeedPage() {
  const user = useCurrentUser();
  const { items, status, filters, isFiltered } = useFeed();
  const reload = useDeedStore((s) => s.load);
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{timeOfDayGreeting()}, {user.name.split(" ")[0]} 👋</p>
        <h1 className="text-2xl font-semibold text-forest sm:text-3xl">Community feed</h1>
      </div>

      <ComposerPrompt user={user} />

      <FeedFilters
        category={filters.category}
        scope={filters.scope}
        onCategory={filters.setCategory}
        onScope={filters.setScope}
      />

      <FeedBody
        status={status}
        count={items.length}
        isFiltered={isFiltered}
        scope={filters.scope}
        onReset={() => filters.setCategory("all")}
        onRetry={() => void reload(user.id)}
      >
        <DeedList
          deeds={items}
          resetKey={`${filters.category}|${filters.scope}`}
          insert={isFiltered ? undefined : { after: 3, node: <HelpTeaser /> }}
        />
      </FeedBody>
    </div>
  );
}

type FeedBodyProps = {
  status: string;
  count: number;
  isFiltered: boolean;
  scope: "all" | "following";
  onReset: () => void;
  onRetry: () => void;
  children: React.ReactNode;
};

function FeedBody({ status, count, isFiltered, scope, onReset, onRetry, children }: FeedBodyProps) {
  if (status === "loading" || status === "idle") return <FeedSkeleton />;
  if (status === "error") return <ErrorState onRetry={onRetry} />;
  if (count > 0) return <>{children}</>;
  if (scope === "following" && !isFiltered) {
    return (
      <EmptyState
        icon={UsersGroupRoundedLinear}
        title="Your following feed is quiet"
        description="Follow a few people to see their good deeds here."
        action={
          <Button asChild size="sm">
            <Link href={ROUTES.discover}>Discover people</Link>
          </Button>
        }
      />
    );
  }
  return (
    <EmptyState
      icon={MagniferLinear}
      title="No deeds here yet"
      description="Try another category — or share the first one yourself."
      action={
        <Button variant="outline" size="sm" onClick={onReset}>
          Clear filters
        </Button>
      }
    />
  );
}
