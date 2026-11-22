"use client";

import Link from "next/link";
import { GalleryAddLinear } from "solar-icon-set";

import { UserAvatar } from "@/components/common/UserAvatar";
import { ROUTES } from "@/config/routes";
import type { User } from "@/types";

export function ComposerPrompt({ user }: { user: User }) {
  return (
    <Link
      href={ROUTES.create}
      className="group flex items-center gap-3 rounded-3xl border border-border/80 bg-card p-3 pr-4 shadow-soft transition-shadow hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <UserAvatar user={user} size="md" />
      <span className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm text-muted-foreground transition-colors group-hover:bg-accent">
        What good did you do today, {user.name.split(" ")[0]}?
      </span>
      <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-forest">
        <GalleryAddLinear size={20} />
      </span>
    </Link>
  );
}
