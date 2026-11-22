import type { DeedCategory } from "@/types";

/** [authorId, text] — timestamps are spread after the deed's publish time. */
export type SeedComment = [string, string];

export interface SeedDeed {
  id: string;
  authorId: string;
  title: string;
  description: string;
  category: DeedCategory;
  photos: string[];
  location?: string;
  /** Days before "now" the deed was published. */
  daysAgo: number;
  /** Hour of day it was published (0–23). */
  hour: number;
  /** Days between the activity and the post (default 0). */
  activityLag?: number;
  /** Total like count to display; spread across real profiles + wider community. */
  likes: number;
  comments?: SeedComment[];
}
