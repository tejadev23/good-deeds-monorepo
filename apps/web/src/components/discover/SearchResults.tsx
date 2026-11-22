"use client";

import { MagniferLinear } from "solar-icon-set";

import { EmptyState } from "@/components/common/EmptyState";
import { DeedList } from "@/components/deeds/DeedList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Deed, User } from "@/types";

import { PersonCard } from "./PersonCard";

export function SearchResults({ query, people, deeds }: { query: string; people: User[]; deeds: Deed[] }) {
  if (people.length === 0 && deeds.length === 0) {
    return <EmptyState icon={MagniferLinear} title={`Nothing for “${query}”`} description="Try a name, a city, or a cause like “trees” or “food”." />;
  }

  return (
    <Tabs defaultValue={people.length > 0 ? "people" : "deeds"}>
      <TabsList>
        <TabsTrigger value="people">People · {people.length}</TabsTrigger>
        <TabsTrigger value="deeds">Deeds · {deeds.length}</TabsTrigger>
      </TabsList>
      <TabsContent value="people">
        {people.length === 0 ? (
          <EmptyState icon={MagniferLinear} title="No people found" />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {people.map((u) => (
              <PersonCard key={u.id} user={u} />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="deeds" className="mx-auto w-full max-w-2xl">
        {deeds.length === 0 ? <EmptyState icon={MagniferLinear} title="No deeds found" /> : <DeedList deeds={deeds} resetKey={query} />}
      </TabsContent>
    </Tabs>
  );
}
