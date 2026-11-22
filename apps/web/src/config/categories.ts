import type { ComponentType } from "react";
import { BookLinear, GiftLinear, HandHeartLinear, LeafLinear, PawLinear, UsersGroupRoundedLinear } from "solar-icon-set";
import type { SolarIconProps } from "solar-icon-set";

import type { DeedCategory } from "@/types";

export interface CategoryMeta {
  id: DeedCategory;
  label: string;
  description: string;
  icon: ComponentType<SolarIconProps>;
  /** Matches a Badge variant and the --cat-* colour tokens. */
  tone: DeedCategory;
  /** Static class names so Tailwind can see them. */
  textClass: string;
  bgClass: string;
}

export const CATEGORY_META: Record<DeedCategory, CategoryMeta> = {
  environment: {
    id: "environment",
    label: "Environment",
    description: "Trees, gardens, cleanups and greener streets.",
    icon: LeafLinear,
    tone: "environment",
    textClass: "text-cat-environment",
    bgClass: "bg-cat-environment-subtle",
  },
  animals: {
    id: "animals",
    label: "Animals",
    description: "Feeding strays, rescues and shelter care.",
    icon: PawLinear,
    tone: "animals",
    textClass: "text-cat-animals",
    bgClass: "bg-cat-animals-subtle",
  },
  education: {
    id: "education",
    label: "Education",
    description: "Tutoring, books and school supplies.",
    icon: BookLinear,
    tone: "education",
    textClass: "text-cat-education",
    bgClass: "bg-cat-education-subtle",
  },
  humanity: {
    id: "humanity",
    label: "Humanity",
    description: "Helping elders, strangers and people in need.",
    icon: HandHeartLinear,
    tone: "humanity",
    textClass: "text-cat-humanity",
    bgClass: "bg-cat-humanity-subtle",
  },
  charity: {
    id: "charity",
    label: "Charity",
    description: "Donating food, clothes and essentials.",
    icon: GiftLinear,
    tone: "charity",
    textClass: "text-cat-charity",
    bgClass: "bg-cat-charity-subtle",
  },
  community: {
    id: "community",
    label: "Community",
    description: "Drives, meetups and neighbourhood projects.",
    icon: UsersGroupRoundedLinear,
    tone: "community",
    textClass: "text-cat-community",
    bgClass: "bg-cat-community-subtle",
  },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORY_META);
