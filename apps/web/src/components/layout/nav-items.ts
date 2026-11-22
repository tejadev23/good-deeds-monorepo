import type { ComponentType } from "react";
import { AddCircleLinear, BellLinear, BookmarkLinear, CompassLinear, FlagLinear, HandShakeLinear, HomeSmileLinear, UserRoundedLinear } from "solar-icon-set";
import type { SolarIconProps } from "solar-icon-set";

import { ROUTES } from "@/config/routes";

export interface NavItem {
  key: "feed" | "discover" | "challenges" | "help" | "create" | "notifications" | "saved" | "profile";
  label: string;
  href: (username: string) => string;
  icon: ComponentType<SolarIconProps>;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "feed", label: "Feed", href: () => ROUTES.feed, icon: HomeSmileLinear },
  { key: "discover", label: "Discover", href: () => ROUTES.discover, icon: CompassLinear },
  { key: "challenges", label: "Challenges", href: () => ROUTES.challenges, icon: FlagLinear },
  { key: "help", label: "Help board", href: () => ROUTES.help, icon: HandShakeLinear },
  { key: "create", label: "Share a deed", href: () => ROUTES.create, icon: AddCircleLinear },
  { key: "notifications", label: "Notifications", href: () => ROUTES.notifications, icon: BellLinear },
  { key: "saved", label: "Saved", href: () => ROUTES.saved, icon: BookmarkLinear },
  { key: "profile", label: "Profile", href: (username) => ROUTES.profile(username), icon: UserRoundedLinear },
];

/** Matches the path, and any query parameters the nav link carries (e.g. a profile's ?name=). */
export function isNavActive(pathname: string, search: URLSearchParams, href: string): boolean {
  const [path, query] = href.split("?");
  const pathMatches = pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
  if (!pathMatches || !query) return pathMatches;
  return [...new URLSearchParams(query).entries()].every(([key, value]) => search.get(key) === value);
}
