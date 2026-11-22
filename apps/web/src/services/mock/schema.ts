import type { AppNotification, Challenge, Comment, CommunityActivity, Deed, Follow, HelpRequest, User } from "@/types";

/** Shape of the browser-side mock database persisted to localStorage. */
export interface MockDatabase {
  version: number;
  seededAt: string;
  users: User[];
  deeds: Deed[];
  comments: Comment[];
  follows: Follow[];
  notifications: AppNotification[];
  activities: CommunityActivity[];
  challenges: Challenge[];
  helpRequests: HelpRequest[];
  saves: Record<string, string[]>;
}
