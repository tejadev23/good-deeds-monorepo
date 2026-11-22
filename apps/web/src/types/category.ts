export const DEED_CATEGORIES = ["environment", "animals", "education", "humanity", "charity", "community"] as const;

export type DeedCategory = (typeof DEED_CATEGORIES)[number];
