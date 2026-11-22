import type { DeedCategory } from "./category";

export interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  category: DeedCategory;
  imageUrl: string;
  location: string;
  date: string;
  organizerId: string;
  participantIds: string[];
  spots: number;
}
