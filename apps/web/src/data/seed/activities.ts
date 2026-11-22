import { PHOTOS } from "@/config/images";
import type { DeedCategory } from "@/types";

export interface SeedActivity {
  id: string;
  title: string;
  description: string;
  category: DeedCategory;
  photo: string;
  location: string;
  daysFromNow: number;
  hour: number;
  organizerId: string;
  participantIds: string[];
  spots: number;
}

export const SEED_ACTIVITIES: SeedActivity[] = [
  {
    id: "a_bund_round_two",
    title: "Lake bund planting — round two",
    description: "Another 150 native saplings along the north bund. Tools, gloves and breakfast provided. Kids welcome.",
    category: "environment",
    photo: PHOTOS.treePlanting[5],
    location: "Hennur Lake, Bengaluru",
    daysFromNow: 9,
    hour: 7,
    organizerId: "u_sarah",
    participantIds: ["u_aarav", "u_ishita", "u_chloe", "u_zara"],
    spots: 40,
  },
  {
    id: "a_sunday_meals",
    title: "Sunday meals volunteer shift",
    description: "Cooking from 3pm, serving from 7pm. We need extra hands for chopping and for the serving line.",
    category: "charity",
    photo: PHOTOS.food[4],
    location: "Pune Station Road",
    daysFromNow: 3,
    hour: 15,
    organizerId: "u_aarav",
    participantIds: ["u_kamala", "u_vikram", "u_sarah"],
    spots: 30,
  },
  {
    id: "a_vaccination_drive",
    title: "Street dog vaccination drive",
    description: "Anti-rabies shots for colony dogs with a municipal vet team. Feeders who know the local dogs are especially welcome.",
    category: "animals",
    photo: PHOTOS.dogs[3],
    location: "Jubilee Hills, Hyderabad",
    daysFromNow: 6,
    hour: 8,
    organizerId: "u_maya",
    participantIds: ["u_zara", "u_rafael"],
    spots: 20,
  },
  {
    id: "a_clothes_sorting",
    title: "Winter clothes sorting day",
    description: "Help us size, fold and pack 400+ donations for the night shelters. Chai and good music guaranteed.",
    category: "charity",
    photo: PHOTOS.clothes[2],
    location: "Indiranagar, Bengaluru",
    daysFromNow: 4,
    hour: 10,
    organizerId: "u_ishita",
    participantIds: ["u_sarah", "u_aarav"],
    spots: 15,
  },
  {
    id: "a_beach_cleanup",
    title: "Big Muizenberg beach cleanup",
    description: "Our monthly sweep plus a brand audit. Bags and grabbers provided; bring a hat and a reusable bottle.",
    category: "environment",
    photo: PHOTOS.cleanup[0],
    location: "Muizenberg, Cape Town",
    daysFromNow: 12,
    hour: 8,
    organizerId: "u_ryan",
    participantIds: ["u_jonas", "u_lena"],
    spots: 60,
  },
  {
    id: "a_story_hour",
    title: "Story hour volunteers needed",
    description: "Read aloud to children under the neem tree. Tamil or English — both welcome. Books provided.",
    category: "education",
    photo: PHOTOS.books[3],
    location: "Madurai",
    daysFromNow: 7,
    hour: 17,
    organizerId: "u_ramesh",
    participantIds: ["u_zara", "u_kabir"],
    spots: 10,
  },
];
