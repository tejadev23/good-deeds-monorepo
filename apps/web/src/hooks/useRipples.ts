"use client";

import { useMemo } from "react";

import { childrenIndex, rippleReach, rippleTree } from "@/lib/ripples";
import { useDeedStore } from "@/store/deedStore";
import type { Deed } from "@/types";

/** Shared ripple index over all deeds. */
export function useRippleIndex() {
  const deeds = useDeedStore((s) => s.deeds);
  return useMemo(() => {
    const index = childrenIndex(deeds);
    const byId = new Map(deeds.map((d) => [d.id, d]));
    return { index, byId };
  }, [deeds]);
}

export function useRipple(deed: Deed) {
  const { index, byId } = useRippleIndex();
  return useMemo(() => {
    const origin = deed.inspiredById ? byId.get(deed.inspiredById) : undefined;
    // Walk up to the deed that started the whole ripple.
    let root: Deed = deed;
    const seen = new Set<string>();
    while (root.inspiredById && byId.has(root.inspiredById) && !seen.has(root.id)) {
      seen.add(root.id);
      root = byId.get(root.inspiredById)!;
    }
    return {
      origin,
      root,
      reach: rippleReach(deed.id, index),
      rootReach: rippleReach(root.id, index),
      tree: rippleTree(root.id, index),
    };
  }, [deed, index, byId]);
}
