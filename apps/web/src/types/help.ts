import type { DeedCategory } from "./category";

export interface HelpOffer {
  userId: string;
  message?: string;
  createdAt: string;
}

export type HelpRequestStatus = "open" | "fulfilled";

export interface HelpRequest {
  id: string;
  authorId: string;
  title: string;
  description: string;
  category: DeedCategory;
  location: string;
  /** ISO date the help is needed by. */
  neededBy: string;
  /** How many helpers are needed. */
  helpersNeeded: number;
  imageUrl?: string;
  offers: HelpOffer[];
  status: HelpRequestStatus;
  createdAt: string;
}

export interface NewHelpRequestInput {
  title: string;
  description: string;
  category: DeedCategory;
  location: string;
  neededBy: string;
  helpersNeeded: number;
}
