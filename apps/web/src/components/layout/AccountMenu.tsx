"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { BookmarkLinear, Logout3Linear, RestartLinear, UserRoundedLinear } from "solar-icon-set";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";
import { avatarForDemo } from "@/components/layout/demo-avatar";
import { useAccountActions } from "@/hooks/useAccountActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserStore } from "@/store/userStore";

type AccountMenuProps = { trigger: ReactNode; align?: "start" | "end"; side?: "top" | "bottom" };

export function AccountMenu({ trigger, align = "start", side = "top" }: AccountMenuProps) {
  const user = useCurrentUser();
  const users = useUserStore((s) => s.users);
  const { busy, otherAccounts, switchTo, signOut, resetDemo } = useAccountActions();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align={align} side={side} className="w-72">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <UserAvatar user={user} size="md" />
            <div className="min-w-0">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={ROUTES.profile(user.username)}>
              <UserRoundedLinear size={18} /> View profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.saved}>
              <BookmarkLinear size={18} /> Saved deeds
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Switch demo account</DropdownMenuLabel>
          {otherAccounts.map((account) => (
            <DropdownMenuItem key={account.userId} disabled={busy} onSelect={() => void switchTo(account)}>
              <UserAvatar user={avatarForDemo(account, users)} size="xs" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{account.name}</span>
                <span className="truncate text-xs text-muted-foreground">{account.persona}</span>
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConfirmReset(true)}>
            <RestartLinear size={18} /> Reset demo data
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => void signOut()}>
            <Logout3Linear size={18} /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset demo data?"
        description="This restores the original community — new deeds, likes, comments, follows and saves made in this browser will be cleared, and you'll be signed out."
        confirmLabel="Reset demo"
        destructive
        loading={busy}
        onConfirm={() => void resetDemo()}
      />
    </>
  );
}
