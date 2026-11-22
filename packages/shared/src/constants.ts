/** Shared between the API, the web app and (later) the Flutter app's codegen. */
export const CATEGORIES = ["environment", "animals", "education", "humanity", "charity", "community"] as const;
export type CategoryKey = (typeof CATEGORIES)[number];

export const API_VERSION = "v1";

export const LIMITS = {
  pageSizeDefault: 20,
  pageSizeMax: 50,
  deedTitle: 120,
  deedDescription: 2000,
  deedImages: 4,
  comment: 500,
  bio: 280,
  name: 60,
  location: 80,
  /** Max new deeds a single person can post per day — slows down spam and farming. */
  deedsPerDay: 5,
  /** Max comments per person per hour. */
  commentsPerHour: 30,
} as const;

export const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9_.]{1,22})[a-z0-9]$/;

/** Usernames that could be mistaken for the platform itself or app routes. */
export const RESERVED_USERNAMES = [
  "admin", "api", "app", "deed", "deeds", "discover", "feed", "help", "challenges", "notifications",
  "saved", "settings", "support", "goodeeds", "gooddeeds", "good_deeds", "official", "team", "u", "me",
];
