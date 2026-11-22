"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AddCircleLinear, MenuDotsLinear } from "solar-icon-set";

import { Logo } from "@/components/common/Logo";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { AccountMenu } from "./AccountMenu";
import { isNavActive, NAV_ITEMS } from "./nav-items";
import { NotificationDot } from "./NotificationDot";

export function Sidebar() {
  const pathname = usePathname();
  const search = useSearchParams();
  const user = useCurrentUser();
  if (!user) return null;

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 border-r border-border/70 bg-ivory/80 px-4 py-6 backdrop-blur lg:flex xl:w-72">
      <Logo className="px-2" showTagline />

      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAV_ITEMS.filter((item) => item.key !== "create").map((item) => {
          const href = item.href(user.username);
          const active = isNavActive(pathname, search, href);
          const Icon = item.icon;
          return (
            <Button key={item.key} asChild variant="nav" size="nav" data-active={active}>
              <Link href={href} aria-current={active ? "page" : undefined}>
                <Icon size={22} />
                <span className="flex-1">{item.label}</span>
                {item.key === "notifications" && <NotificationDot />}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Button asChild size="lg" className="w-full">
        <Link href={ROUTES.create}>
          <AddCircleLinear size={20} />
          Share a good deed
        </Link>
      </Button>

      <div className="mt-auto">
        <AccountMenu
          trigger={
            <Button variant="ghost" className="h-auto w-full justify-start gap-3 rounded-2xl p-2 text-left">
              <UserAvatar user={user} size="sm" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">{user.name}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">@{user.username} · demo</span>
              </span>
              <MenuDotsLinear size={18} className="text-muted-foreground" />
            </Button>
          }
        />
      </div>
    </aside>
  );
}
