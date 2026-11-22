import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/config/routes";
import { cn, initials } from "@/lib/utils";
import type { User } from "@/types";

const avatarSize = cva("", {
  variants: {
    size: {
      xs: "size-7 text-xs ring-1",
      sm: "size-9 text-xs",
      md: "size-11 text-sm",
      lg: "size-14 text-base",
      xl: "size-28 text-2xl ring-4 sm:size-32",
    },
  },
  defaultVariants: { size: "md" },
});

type UserAvatarProps = VariantProps<typeof avatarSize> & {
  user: Pick<User, "name" | "avatarUrl" | "username">;
  linked?: boolean;
  className?: string;
};

export function UserAvatar({ user, size, linked = false, className }: UserAvatarProps) {
  const avatar = (
    <Avatar className={cn(avatarSize({ size }), className)}>
      <AvatarImage src={user.avatarUrl} alt={user.name} />
      <AvatarFallback>{initials(user.name)}</AvatarFallback>
    </Avatar>
  );
  if (!linked) return avatar;
  return (
    <Link href={ROUTES.profile(user.username)} className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${user.name}'s profile`}>
      {avatar}
    </Link>
  );
}
