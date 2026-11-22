"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { Deed } from "@/types";

import { DeedCard } from "./DeedCard";

const PAGE_SIZE = 8;

/** Renders deeds in pages so long feeds stay light. */
export function DeedList({ deeds, resetKey, insert }: { deeds: Deed[]; resetKey?: string; insert?: { after: number; node: ReactNode } }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [resetKey]);

  return (
    <div className="space-y-5">
      {deeds.slice(0, visible).map((deed, index) => (
        <Fragment key={deed.id}>
          <DeedCard deed={deed} />
          {insert && index === Math.min(insert.after, deeds.length) - 1 && insert.node}
        </Fragment>
      ))}
      {visible < deeds.length && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Show more deeds ({deeds.length - visible} more)
          </Button>
        </div>
      )}
      {visible >= deeds.length && deeds.length > PAGE_SIZE && (
        <p className="py-4 text-center text-sm text-muted-foreground">You&apos;re all caught up 🌿 Thanks for spreading kindness.</p>
      )}
    </div>
  );
}
