import type {
  AppNotification,
  Challenge,
  HelpRequest,
  NewHelpRequestInput,
  Comment,
  CommunityActivity,
  Deed,
  Follow,
  NewDeedInput,
  User,
} from "@/types";

/**
 * Service contracts used by the UI. The current implementation is a browser
 * mock (`services/mock`); a real backend only needs to implement these
 * interfaces (e.g. with fetch calls) and be swapped in `services/index.ts`.
 */
export interface AuthService {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  /** Returns the signed-in user id, if a session exists. */
  restoreSession(): Promise<string | null>;
}

export interface UserService {
  list(): Promise<User[]>;
  listFollows(): Promise<Follow[]>;
  follow(followerId: string, targetId: string): Promise<Follow>;
  unfollow(followerId: string, targetId: string): Promise<void>;
}

export interface DeedService {
  list(): Promise<Deed[]>;
  create(authorId: string, input: NewDeedInput): Promise<Deed>;
  remove(deedId: string, userId: string): Promise<void>;
  toggleLike(deedId: string, userId: string): Promise<Deed>;
  listComments(): Promise<Comment[]>;
  addComment(deedId: string, authorId: string, text: string): Promise<Comment>;
  listSaved(userId: string): Promise<string[]>;
  toggleSave(deedId: string, userId: string): Promise<string[]>;
}

export interface NotificationService {
  list(userId: string): Promise<AppNotification[]>;
  markRead(notificationId: string): Promise<void>;
  markAllRead(userId: string): Promise<void>;
}

export interface ActivityService {
  list(): Promise<CommunityActivity[]>;
  toggleJoin(activityId: string, userId: string): Promise<CommunityActivity>;
}

export interface ChallengeService {
  list(): Promise<Challenge[]>;
  setParticipation(challengeId: string, userId: string, join: boolean): Promise<Challenge>;
}

export interface HelpService {
  list(): Promise<HelpRequest[]>;
  create(authorId: string, input: NewHelpRequestInput): Promise<HelpRequest>;
  offer(requestId: string, userId: string, message?: string): Promise<HelpRequest>;
  withdraw(requestId: string, userId: string): Promise<HelpRequest>;
  setFulfilled(requestId: string, userId: string, fulfilled: boolean): Promise<HelpRequest>;
}

export interface DemoService {
  /** Restores the original seeded community and clears the session. */
  reset(): Promise<void>;
}

export interface Services {
  auth: AuthService;
  users: UserService;
  deeds: DeedService;
  notifications: NotificationService;
  activities: ActivityService;
  challenges: ChallengeService;
  help: HelpService;
  demo: DemoService;
}
