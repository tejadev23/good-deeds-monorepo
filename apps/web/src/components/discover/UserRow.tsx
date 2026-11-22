import Link from "next/link";

import { FollowButton } from "@/components/common/FollowButton";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ROUTES } from "@/config/routes";
import type { User } from "@/types";

export function UserRow({ user, subtitle }: { user: User; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={user} size="md" linked />
      <Link href={ROUTES.profile(user.username)} className="min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <p className="truncate text-sm font-semibold hover:underline">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle ?? user.location}</p>
      </Link>
      <FollowButton userId={user.id} size="xs" short />
    </div>
  );
}
