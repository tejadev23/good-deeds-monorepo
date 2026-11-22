import { UserAvatar } from "@/components/common/UserAvatar";
import { formatCompactNumber } from "@/lib/format";
import type { User } from "@/types";

/** "Liked by Aarav, Maya and 212 others" with stacked avatars. */
export function LikedBy({ likers, total, viewerLiked }: { likers: User[]; total: number; viewerLiked: boolean }) {
  if (total === 0) return <p className="text-xs text-muted-foreground">Be the first to appreciate this deed.</p>;

  const names = likers.slice(0, 2).map((u) => u.name.split(" ")[0]);
  if (viewerLiked) names.unshift("you");
  const shown = names.slice(0, 2);
  const others = Math.max(0, total - shown.length);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {likers.slice(0, 3).map((u) => (
          <UserAvatar key={u.id} user={u} size="xs" className="ring-card" />
        ))}
      </div>
      <p className="truncate text-xs text-muted-foreground">
        Appreciated by <span className="font-semibold text-foreground">{shown.join(", ")}</span>
        {others > 0 && (
          <>
            {" "}and <span className="font-semibold text-foreground">{formatCompactNumber(others)} others</span>
          </>
        )}
      </p>
    </div>
  );
}
