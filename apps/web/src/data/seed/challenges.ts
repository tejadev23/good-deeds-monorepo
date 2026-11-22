import { PHOTOS } from "@/config/images";
import type { DeedCategory } from "@/types";

export interface SeedChallenge {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: DeedCategory;
  photo: string;
  startDaysAgo: number;
  /** Negative = already ended. */
  endDaysFromNow: number;
  goal: number;
  unit: string;
  communityProgress: number;
  participantIds: string[];
  ideas: string[];
}

export const SEED_CHALLENGES: SeedChallenge[] = [
  {
    id: "ch_hunger_free",
    title: "Hunger-Free Fortnight",
    tagline: "5,000 meals, shared together",
    description:
      "For two weeks, let's make sure nobody in our neighbourhoods goes to bed hungry. Cook an extra portion, volunteer at a community kitchen, or rescue food that would otherwise be thrown away — then log the meals you helped serve.",
    category: "charity",
    photo: PHOTOS.food[1],
    startDaysAgo: 10,
    endDaysFromNow: 4,
    goal: 5000,
    unit: "meals",
    communityProgress: 3245,
    participantIds: ["u_aarav", "u_marcus", "u_kamala", "u_felix", "u_daniel", "u_sarah", "u_ishita", "u_vikram"],
    ideas: ["Cook one extra plate for a night-shift worker", "Volunteer a shift at a community kitchen", "Rescue leftover food from a bakery or event"],
  },
  {
    id: "ch_thousand_trees",
    title: "Thousand Trees",
    tagline: "Plant, water, protect",
    description:
      "One thousand native trees in the ground this month — and cared for after. Planting days, school drives and balcony saplings all count. Tell us how many you planted (or adopted to water).",
    category: "environment",
    photo: PHOTOS.treePlanting[5],
    startDaysAgo: 12,
    endDaysFromNow: 18,
    goal: 1000,
    unit: "trees",
    communityProgress: 412,
    participantIds: ["u_sarah", "u_tom", "u_jonas", "u_lena", "u_chloe", "u_ryan", "u_aarav"],
    ideas: ["Choose native species that suit your area", "Pair every sapling with a watering buddy", "Ask your school or office for a corner to plant"],
  },
  {
    id: "ch_warm_winter",
    title: "Warm Winter Drive",
    tagline: "2,000 warm things for cold nights",
    description:
      "Sweaters, blankets, socks and jackets for night shelters and roadside families. Clear out a cupboard, run a collection in your building, or help sort donations at a drive near you.",
    category: "charity",
    photo: PHOTOS.clothes[0],
    startDaysAgo: 5,
    endDaysFromNow: 25,
    goal: 2000,
    unit: "warm items",
    communityProgress: 620,
    participantIds: ["u_ishita", "u_aarav", "u_sarah", "u_noor", "u_daniel"],
    ideas: ["Wash and fold before donating", "Start a collection box in your building lobby", "Socks and blankets are always the most needed"],
  },
  {
    id: "ch_book_week",
    title: "Book Week for Kids",
    tagline: "1,500 books into small hands",
    description:
      "Donate children's books, read aloud at a library or school, or set up a little free library on your street. Every book that finds a young reader counts.",
    category: "education",
    photo: PHOTOS.books[2],
    startDaysAgo: -6,
    endDaysFromNow: 13,
    goal: 1500,
    unit: "books",
    communityProgress: 0,
    participantIds: ["u_emma", "u_zara", "u_ramesh"],
    ideas: ["Donate books in local languages", "Read aloud for 20 minutes at a school", "Build a little free library box"],
  },
  {
    id: "ch_plastic_free",
    title: "Plastic-Free Shores",
    tagline: "500 kg off our beaches and riverbanks",
    description: "Six weeks of cleanups along beaches, lakes and rivers. Together we pulled more plastic out of the water than we thought possible.",
    category: "environment",
    photo: PHOTOS.cleanup[0],
    startDaysAgo: 45,
    endDaysFromNow: -8,
    goal: 500,
    unit: "kg of plastic",
    communityProgress: 520,
    participantIds: ["u_sarah", "u_jonas", "u_lena", "u_ryan", "u_sam"],
    ideas: ["Bring gloves, grabbers and two bags — one for recyclables", "Weigh your haul before dropping it off"],
  },
];

/** deedId → [challengeId, amount] for deeds that counted towards a challenge. */
export const SEED_CHALLENGE_CONTRIBUTIONS: Record<string, [string, number]> = {
  d_aarav_1: ["ch_hunger_free", 340],
  d_marcus_1: ["ch_hunger_free", 210],
  d_kamala_1: ["ch_hunger_free", 45],
  d_sarah_1: ["ch_thousand_trees", 120],
  d_ishita_1: ["ch_warm_winter", 460],
  d_sarah_2: ["ch_plastic_free", 38],
  d_jonas_1: ["ch_plastic_free", 22],
  d_lena_2: ["ch_plastic_free", 14],
};
