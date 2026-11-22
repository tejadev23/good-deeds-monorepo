import type { DeedCategory } from "./category";

export interface Challenge {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: DeedCategory;
  coverUrl: string;
  startDate: string;
  endDate: string;
  goal: number;
  /** Plural unit label, e.g. "meals", "trees", "kg of plastic". */
  unit: string;
  /** Progress logged by the wider community outside the demo profiles. */
  communityProgress: number;
  participantIds: string[];
  /** Ideas shown on the challenge page to help people take part. */
  ideas: string[];
}

export type ChallengeStatus = "upcoming" | "active" | "completed";
