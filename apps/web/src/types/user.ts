import type { DeedCategory } from "./category";

export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  location: string;
  joinedAt: string;
  interests: DeedCategory[];
  featuredDeedId?: string;
  /** Marks the three demo personas that can sign in. */
  isDemoAccount?: boolean;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface UserStats {
  totalDeeds: number;
  totalLikesReceived: number;
  followers: number;
  following: number;
  categoryBreakdown: Record<DeedCategory, number>;
  /** Deeds that were inspired by this user's deeds (direct ripples). */
  ripplesInspired: number;
  challengesJoined: number;
  helpOffered: number;
}

export type BadgeId =
  | "nature-champion"
  | "environmental-advocate"
  | "animal-friend"
  | "community-helper"
  | "education-supporter"
  | "kindness-ambassador"
  | "generous-heart"
  | "first-step"
  | "changemaker"
  | "ripple-maker"
  | "helping-hand";

export interface RecognitionBadge {
  id: BadgeId;
  name: string;
  description: string;
}
