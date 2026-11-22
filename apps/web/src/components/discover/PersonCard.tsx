import Link from "next/link";
import { MapPointLinear } from "solar-icon-set";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { FollowButton } from "@/components/common/FollowButton";
import { UserAvatar } from "@/components/common/UserAvatar";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import type { User } from "@/types";

export function PersonCard({ user, note }: { user: User; note?: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft">
      <SmartImage src={user.coverUrl} alt="" wrapperClassName="h-20" />
      <div className="-mt-8 flex flex-1 flex-col items-center gap-2 px-4 pb-4 text-center">
        <UserAvatar user={user} size="lg" linked />
        <Link href={ROUTES.profile(user.username)} className="hover:underline">
          <p className="font-semibold leading-tight">{user.name}</p>
        </Link>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPointLinear size={12} /> {user.location}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{note ?? user.bio}</p>
        <div className="flex flex-wrap justify-center gap-1">
          {user.interests.slice(0, 2).map((i) => (
            <CategoryBadge key={i} category={i} />
          ))}
        </div>
        <FollowButton userId={user.id} size="sm" className="mt-auto w-full" />
      </div>
    </div>
  );
}
