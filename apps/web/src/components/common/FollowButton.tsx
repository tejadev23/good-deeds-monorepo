"use client";

import { UserCheckRoundedLinear, UserPlusRoundedLinear } from "solar-icon-set";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useFollow } from "@/hooks/useFollow";

type FollowButtonProps = { userId: string; size?: ButtonProps["size"]; className?: string; compact?: boolean; short?: boolean };

export function FollowButton({ userId, size = "sm", className, compact = false, short = false }: FollowButtonProps) {
  const { isFollowing, followsYou, isSelf, pending, toggle } = useFollow(userId);
  if (isSelf) return null;

  const label = isFollowing ? "Following" : followsYou && !short ? "Follow back" : "Follow";
  return (
    <Button
      size={size}
      variant={isFollowing ? "outline" : "default"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggle();
      }}
      disabled={pending}
      aria-pressed={isFollowing}
      className={className}
    >
      {isFollowing ? <UserCheckRoundedLinear size={16} /> : <UserPlusRoundedLinear size={16} />}
      {compact ? null : label}
    </Button>
  );
}
