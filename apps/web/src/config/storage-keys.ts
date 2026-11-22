/** Bump DB_VERSION whenever the seed shape changes so old demo data is replaced. */
export const DB_VERSION = 3;

export const STORAGE_KEYS = {
  db: "good-deeds:db",
  session: "good-deeds:session",
} as const;
