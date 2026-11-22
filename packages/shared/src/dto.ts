import type { CategoryKey } from "./constants";

/**
 * Shapes returned by the API. These are the public contract for the web and
 * mobile clients — they intentionally differ from database rows (no firebase
 * uid, no email for other people, counts instead of relation arrays).
 */
export interface UserSummaryDto {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface ProfileDto extends UserSummaryDto {
  bio: string;
  location: string;
  coverUrl: string | null;
  interests: CategoryKey[];
  joinedAt: string;
  stats: { deeds: number; followers: number; following: number; likesReceived: number; ripplesInspired: number; vouches: number };
  viewer: { isSelf: boolean; following: boolean; vouched: boolean };
}

export interface MeDto {
  id: string;
  email: string;
  username: string | null;
  name: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  onboarded: boolean;
}

export interface DeedImageDto {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
}

export interface DeedDto {
  id: string;
  author: UserSummaryDto;
  title: string;
  description: string;
  category: CategoryKey;
  location: string | null;
  activityDate: string;
  createdAt: string;
  images: DeedImageDto[];
  inspiredBy: { id: string; title: string; author: UserSummaryDto } | null;
  challenge: { id: string; slug: string; title: string; amount: number; unit: string } | null;
  counts: { likes: number; comments: number; saves: number; ripples: number; confirmations: number };
  viewer: { liked: boolean; saved: boolean; confirmed: boolean; isAuthor: boolean };
}

export interface CommentDto {
  id: string;
  deedId: string;
  author: UserSummaryDto;
  text: string;
  createdAt: string;
}

export interface NotificationDto {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW" | "RIPPLE" | "HELP_OFFER" | "CHALLENGE" | "CONFIRMATION" | "VOUCH" | "MILESTONE";
  actor: UserSummaryDto | null;
  deedId: string | null;
  helpRequestId: string | null;
  message: string | null;
  read: boolean;
  createdAt: string;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown };
}
