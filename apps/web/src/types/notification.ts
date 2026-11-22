export type NotificationType = "like" | "comment" | "follow" | "community" | "milestone" | "ripple" | "help" | "challenge";

export interface AppNotification {
  id: string;
  recipientId: string;
  actorId?: string;
  type: NotificationType;
  deedId?: string;
  activityId?: string;
  helpRequestId?: string;
  challengeId?: string;
  message?: string;
  createdAt: string;
  read: boolean;
}
