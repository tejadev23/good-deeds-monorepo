"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CloseCircleLinear, MagniferLinear } from "solar-icon-set";

import { ChallengeBanner } from "@/components/challenges/ChallengeBanner";
import { PageHeader } from "@/components/common/PageHeader";
import { ActivityCard } from "@/components/discover/ActivityCard";
import { CategoryTiles } from "@/components/discover/CategoryTiles";
import { ContributorCard } from "@/components/discover/ContributorCard";
import { PersonCard } from "@/components/discover/PersonCard";
import { QuickLinks } from "@/components/discover/QuickLinks";
import { SearchResults } from "@/components/discover/SearchResults";
import { Section } from "@/components/discover/Section";
import { TrendingDeedTile } from "@/components/discover/TrendingDeedTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDiscover } from "@/hooks/useDiscover";
import { useUsersById } from "@/hooks/useUsersById";
import { useDeedStore } from "@/store/deedStore";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const { suggested, trending, categories, contributors, activities, results } = useDiscover(deferred);
  const usersById = useUsersById();
  const comments = useDeedStore((s) => s.comments);
  const commentCount = useMemo(() => {
    const map = new Map<string, number>();
    comments.forEach((c) => map.set(c.deedId, (map.get(c.deedId) ?? 0) + 1));
    return map;
  }, [comments]);

  return (
    <div className="space-y-8">
      <PageHeader title="Discover" description="Find people, causes and activities that inspire you." />

      <div className="relative">
        <MagniferLinear size={20} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people, deeds, places or causes"
          aria-label="Search people and deeds"
          className="h-14 rounded-full pl-13 pr-12 text-base shadow-soft"
        />
        {query && (
          <Button variant="subtle" size="icon-xs" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setQuery("")} aria-label="Clear search">
            <CloseCircleLinear size={18} />
          </Button>
        )}
      </div>

      {results ? (
        <SearchResults query={deferred} people={results.people} deeds={results.deeds} />
      ) : (
        <>
          <ChallengeBanner />

          <QuickLinks />

          <Section title="Featured contributors" description="Celebrating members who've been especially kind lately.">
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
              {contributors.map(({ user, count, badge }) => (
                <ContributorCard key={user.id} user={user} count={count} badge={badge} />
              ))}
            </div>
          </Section>

          <Section title="Trending deeds" description="Most appreciated in the last three weeks.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((deed, i) => (
                <TrendingDeedTile key={deed.id} deed={deed} author={usersById.get(deed.authorId)} comments={commentCount.get(deed.id) ?? 0} rank={i + 1} />
              ))}
            </div>
          </Section>

          <Section title="Upcoming community activities" description="Join an activity and meet people doing good near you.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} organizer={usersById.get(activity.organizerId)} />
              ))}
            </div>
          </Section>

          <Section title="Popular categories" description="Tap a cause to explore it in the feed.">
            <CategoryTiles totals={categories} />
          </Section>

          <Section title="People you might like" description="Based on the causes you care about.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {suggested.map((user) => (
                <PersonCard key={user.id} user={user} />
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
