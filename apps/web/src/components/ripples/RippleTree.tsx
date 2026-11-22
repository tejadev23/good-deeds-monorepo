import Link from "next/link";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ROUTES } from "@/config/routes";
import { formatRelativeTime } from "@/lib/format";
import type { RippleNode } from "@/lib/ripples";
import { cn } from "@/lib/utils";
import type { Deed, User } from "@/types";

type NodeProps = { deed: Deed; usersById: Map<string, User>; currentId: string; isRoot?: boolean };

function RippleRow({ deed, usersById, currentId, isRoot }: NodeProps) {
  const author = usersById.get(deed.authorId);
  const current = deed.id === currentId;
  return (
    <Link
      href={ROUTES.deed(deed.id)}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-2.5 pr-3 transition-colors hover:bg-accent",
        current ? "border-cat-community bg-cat-community-subtle/60" : "border-border/70 bg-card",
      )}
    >
      {author && <UserAvatar user={author} size="sm" />}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{deed.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {author?.name} · {formatRelativeTime(deed.createdAt)}
          {isRoot && " · where it started"}
          {current && !isRoot && " · this deed"}
        </p>
      </div>
      <CategoryBadge category={deed.category} className="hidden sm:inline-flex" />
    </Link>
  );
}

function Branch({ nodes, usersById, currentId }: { nodes: RippleNode[]; usersById: Map<string, User>; currentId: string }) {
  return (
    <ul className="space-y-2 border-l-2 border-dashed border-cat-community/40 pl-4">
      {nodes.map((node) => (
        <li key={node.deed.id} className="relative space-y-2 before:absolute before:-left-4 before:top-6 before:h-0.5 before:w-3 before:bg-cat-community/40">
          <RippleRow deed={node.deed} usersById={usersById} currentId={currentId} />
          {node.children.length > 0 && <Branch nodes={node.children} usersById={usersById} currentId={currentId} />}
        </li>
      ))}
    </ul>
  );
}

export function RippleTree({ root, tree, usersById, currentId }: { root: Deed; tree: RippleNode[]; usersById: Map<string, User>; currentId: string }) {
  return (
    <div className="space-y-2">
      <RippleRow deed={root} usersById={usersById} currentId={currentId} isRoot />
      <Branch nodes={tree} usersById={usersById} currentId={currentId} />
    </div>
  );
}
