import { UserAvatar } from "@/components/common/UserAvatar";
import { formatCompactNumber } from "@/lib/format";
import type { User } from "@/types";

export function AvatarStack({ users, total, max = 4, label }: { users: User[]; total?: number; max?: number; label?: string }) {
  const count = total ?? users.length;
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {users.slice(0, max).map((u) => (
          <UserAvatar key={u.id} user={u} size="xs" className="ring-card" />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {formatCompactNumber(count)} {label ?? "taking part"}
      </span>
    </div>
  );
}
