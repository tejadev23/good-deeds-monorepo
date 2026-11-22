import type { Deed } from "@/types";

export interface RippleNode {
  deed: Deed;
  children: RippleNode[];
}

export function childrenIndex(deeds: Deed[]): Map<string, Deed[]> {
  const index = new Map<string, Deed[]>();
  deeds.forEach((d) => {
    if (!d.inspiredById) return;
    index.set(d.inspiredById, [...(index.get(d.inspiredById) ?? []), d]);
  });
  index.forEach((list) => list.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
  return index;
}

/** All deeds that grew out of `rootId`, as a tree (depth-limited for safety). */
export function rippleTree(rootId: string, index: Map<string, Deed[]>, depth = 0): RippleNode[] {
  if (depth > 6) return [];
  return (index.get(rootId) ?? []).map((deed) => ({ deed, children: rippleTree(deed.id, index, depth + 1) }));
}

/** Total number of deeds a deed has inspired, directly or indirectly. */
export function rippleReach(rootId: string, index: Map<string, Deed[]>): number {
  return rippleTree(rootId, index).reduce(function count(sum: number, node: RippleNode): number {
    return sum + 1 + node.children.reduce(count, 0);
  }, 0);
}
