"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

import { isNavActive, NAV_ITEMS } from "./nav-items";
import { NotificationDot } from "./NotificationDot";

const MOBILE_KEYS = ["feed", "discover", "create", "notifications", "profile"] as const;

export function BottomNav() {
  const pathname = usePathname();
  const search = useSearchParams();
  const user = useCurrentUser();
  if (!user) return null;

  const items = MOBILE_KEYS.map((key) => NAV_ITEMS.find((item) => item.key === key)!);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 pb-safe shadow-[0_-8px_24px_-16px_rgb(31_58_43/0.25)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {items.map((item) => {
          const href = item.href(user.username);
          const active = isNavActive(pathname, search, href);
          const Icon = item.icon;
          const isCreate = item.key === "create";
          return (
            <li key={item.key} className="flex flex-1 justify-center">
              <Link
                href={href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "text-forest" : "text-muted-foreground",
                  isCreate && "-mt-7",
                )}
              >
                {isCreate ? (
                  <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background transition-transform active:scale-95">
                    <Icon size={28} />
                  </span>
                ) : (
                  <span className={cn("flex h-8 w-12 items-center justify-center rounded-full transition-colors", active && "bg-secondary")}>
                    <Icon size={22} />
                  </span>
                )}
                <span className={cn(isCreate && "sr-only")}>{item.key === "notifications" ? "Alerts" : item.label}</span>
                {item.key === "notifications" && <NotificationDot className="absolute right-2 top-0" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
