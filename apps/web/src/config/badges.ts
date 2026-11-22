import type { ComponentType } from "react";
import {
  BookLinear,
  GiftLinear,
  FlagLinear,
  HandHeartLinear,
  HandShakeLinear,
  HeartsLinear,
  LeafLinear,
  PawLinear,
  StarRingsLinear,
  StarShineLinear,
  UsersGroupRoundedLinear,
} from "solar-icon-set";
import type { SolarIconProps } from "solar-icon-set";

import type { BadgeId, RecognitionBadge } from "@/types";

export interface BadgeMeta extends RecognitionBadge {
  icon: ComponentType<SolarIconProps>;
  /** Static gradient + text classes for the badge medallion. */
  className: string;
}

/**
 * Recognition labels — not points, levels or redeemable rewards.
 * Rules that award them live in `lib/recognition.ts`.
 */
export const BADGES: Record<BadgeId, BadgeMeta> = {
  "nature-champion": {
    id: "nature-champion",
    name: "Nature Champion",
    description: "Planted, tended or protected green spaces again and again.",
    icon: LeafLinear,
    className: "bg-cat-environment-subtle text-cat-environment",
  },
  "environmental-advocate": {
    id: "environmental-advocate",
    name: "Environmental Advocate",
    description: "Shows up for cleanups and inspires others to care for the planet.",
    icon: StarShineLinear,
    className: "bg-secondary text-forest",
  },
  "animal-friend": {
    id: "animal-friend",
    name: "Animal Friend",
    description: "A steady source of food, care and comfort for animals.",
    icon: PawLinear,
    className: "bg-cat-animals-subtle text-cat-animals",
  },
  "community-helper": {
    id: "community-helper",
    name: "Community Helper",
    description: "Brings neighbours together and lends a hand where it's needed.",
    icon: UsersGroupRoundedLinear,
    className: "bg-cat-community-subtle text-cat-community",
  },
  "education-supporter": {
    id: "education-supporter",
    name: "Education Supporter",
    description: "Shares time, books and knowledge so others can learn.",
    icon: BookLinear,
    className: "bg-cat-education-subtle text-cat-education",
  },
  "kindness-ambassador": {
    id: "kindness-ambassador",
    name: "Kindness Ambassador",
    description: "Does good across many causes and keeps the community inspired.",
    icon: HeartsLinear,
    className: "bg-heart-subtle text-heart",
  },
  "generous-heart": {
    id: "generous-heart",
    name: "Generous Heart",
    description: "Regularly donates food, clothes and essentials.",
    icon: GiftLinear,
    className: "bg-cat-charity-subtle text-cat-charity",
  },
  changemaker: {
    id: "changemaker",
    name: "Changemaker",
    description: "Joined a community challenge and helped move the whole community forward.",
    icon: FlagLinear,
    className: "bg-cat-education-subtle text-cat-education",
  },
  "ripple-maker": {
    id: "ripple-maker",
    name: "Ripple Maker",
    description: "Their deeds have inspired others to go and do good too.",
    icon: StarRingsLinear,
    className: "bg-cat-community-subtle text-cat-community",
  },
  "helping-hand": {
    id: "helping-hand",
    name: "Helping Hand",
    description: "Answered a neighbour's call for help on the Help board.",
    icon: HandShakeLinear,
    className: "bg-cat-humanity-subtle text-cat-humanity",
  },
  "first-step": {
    id: "first-step",
    name: "First Step",
    description: "Shared a first good deed with the community.",
    icon: HandHeartLinear,
    className: "bg-sun-subtle text-sun",
  },
};
