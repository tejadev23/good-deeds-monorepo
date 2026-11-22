/**
 * Detail pages use query strings so the app can be exported as a fully static
 * site (GitHub Pages, any static host) as well as run on Vercel.
 */
export const ROUTES = {
  home: "/",
  login: "/login",
  feed: "/feed",
  discover: "/discover",
  create: "/create",
  notifications: "/notifications",
  saved: "/saved",
  profile: (username: string) => `/u?name=${encodeURIComponent(username)}`,
  deed: (id: string) => `/deed?id=${id}`,
  challenges: "/challenges",
  challenge: (id: string) => `/challenges/view?id=${id}`,
  help: "/help",
  helpRequest: (id: string) => `/help/view?id=${id}`,
  createInspiredBy: (deedId: string) => `/create?inspiredBy=${deedId}`,
  createForChallenge: (challengeId: string) => `/create?challenge=${challengeId}`,
} as const;

/** Base path when the site is served from a sub-folder (e.g. GitHub Pages project sites). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Absolute URL for a route, for sharing and hard navigation. */
export function absoluteUrl(route: string): string {
  return `${window.location.origin}${BASE_PATH}${route}`;
}
