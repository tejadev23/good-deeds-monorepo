"use client";

import Link from "next/link";
import { StarRingsLinear } from "solar-icon-set";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useRipple } from "@/hooks/useRipples";
import { useUsersById } from "@/hooks/useUsersById";
import type { Deed } from "@/types";

import { RippleTree } from "./RippleTree";

export function RippleSection({ deed }: { deed: Deed }) {
  const viewerId = useCurrentUserId();
  const usersById = useUsersById();
  const { root, rootReach, tree } = useRipple(deed);
  const isOwner = viewerId === deed.authorId;
  const hasRipple = rootReach > 0;

  return (
    <Card id="ripples" className="scroll-mt-24 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StarRingsLinear size={20} className="text-cat-community" /> Ripples
        </CardTitle>
        <CardDescription>
          {hasRipple
            ? `This kindness has spread to ${rootReach} more deed${rootReach === 1 ? "" : "s"} so far.`
            : "When someone is inspired by this deed and shares their own, it shows up here."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {hasRipple && <RippleTree root={root} tree={tree} usersById={usersById} currentId={deed.id} />}
        {!isOwner && (
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-cat-community-subtle/60 p-4 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm text-foreground/80">Did this inspire you? Do something similar and keep the ripple going.</p>
            <Button asChild size="sm">
              <Link href={ROUTES.createInspiredBy(deed.id)}>
                <StarRingsLinear size={16} /> This inspired me
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
