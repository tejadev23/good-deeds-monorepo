"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BookmarkLinear } from "solar-icon-set";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { FeedSkeleton } from "@/components/deeds/DeedCardSkeleton";
import { DeedList } from "@/components/deeds/DeedList";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useDeedStore } from "@/store/deedStore";
import type { Deed } from "@/types";

export default function SavedPage() {
  const { deeds, savedIds, status } = useDeedStore();
  const saved = useMemo(() => savedIds.map((id) => deeds.find((d) => d.id === id)).filter((d) => d !== undefined), [deeds, savedIds]);

  return (
    <div className="space-y-6">
      <PageHeader title="Saved deeds" description="Ideas and stories you want to come back to." />
      <SavedBody loading={status === "loading"} saved={saved} />
    </div>
  );
}

function SavedBody({ loading, saved }: { loading: boolean; saved: Deed[] }) {
  if (loading) return <FeedSkeleton count={2} />;
  if (saved.length === 0) {
    return (
      <EmptyState
        icon={BookmarkLinear}
        title="Nothing saved yet"
        description="Tap the bookmark on any deed to keep it here for inspiration."
        action={
          <Button asChild size="sm">
            <Link href={ROUTES.feed}>Browse the feed</Link>
          </Button>
        }
      />
    );
  }
  return <DeedList deeds={saved} />;
}
