"use client";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { AccountMenu } from "./AccountMenu";

export function MobileHeader() {
  const user = useCurrentUser();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur lg:hidden">
      <Logo />
      <AccountMenu
        align="end"
        side="bottom"
        trigger={
          <Button variant="ghost" size="icon" className="rounded-full p-0" aria-label="Account menu">
            <UserAvatar user={user} size="sm" />
          </Button>
        }
      />
    </header>
  );
}
