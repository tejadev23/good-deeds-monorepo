"use client";

import { useState } from "react";
import Link from "next/link";
import { LinkLinear, MenuDotsLinear, TrashBinMinimalisticLinear, UserRoundedLinear } from "solar-icon-set";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/config/routes";

type DeedMenuProps = {
  authorUsername: string;
  authorName: string;
  isOwner: boolean;
  deleting: boolean;
  onCopyLink: () => void;
  onDelete: () => Promise<boolean>;
};

export function DeedMenu({ authorUsername, authorName, isOwner, deleting, onCopyLink, onDelete }: DeedMenuProps) {
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle" size="icon-xs" aria-label="More options">
            <MenuDotsLinear size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={onCopyLink}>
            <LinkLinear size={18} /> Share link
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.profile(authorUsername)}>
              <UserRoundedLinear size={18} /> View {isOwner ? "your" : `${authorName.split(" ")[0]}'s`} profile
            </Link>
          </DropdownMenuItem>
          {isOwner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setConfirm(true)}>
                <TrashBinMinimalisticLinear size={18} /> Delete deed
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete this deed?"
        description="It will be removed from the feed and your profile, along with its likes and comments."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={async () => {
          if (await onDelete()) setConfirm(false);
        }}
      />
    </>
  );
}
