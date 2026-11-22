import { PHOTOS } from "@/config/images";
import type { DeedCategory, HelpRequestStatus } from "@/types";

export interface SeedHelpRequest {
  id: string;
  authorId: string;
  title: string;
  description: string;
  category: DeedCategory;
  location: string;
  neededInDays: number;
  helpersNeeded: number;
  photo?: string;
  /** [userId, message?, hoursAfterPosting] */
  offers: [string, string | undefined, number][];
  status: HelpRequestStatus;
  daysAgo: number;
}

export const SEED_HELP_REQUESTS: SeedHelpRequest[] = [
  {
    id: "h_sarah_watering",
    authorId: "u_sarah",
    title: "Watering buddies while I'm away",
    description:
      "I'm travelling for 10 days and six of the lake saplings don't have a buddy family yet. Need a few people who can water them every other morning. Cans are kept with the security guard at the north gate.",
    category: "environment",
    location: "Hennur Lake, Bengaluru",
    neededInDays: 6,
    helpersNeeded: 3,
    photo: PHOTOS.treePlanting[2],
    offers: [["u_ishita", "I walk past there every morning — count me in for alternate days!", 3]],
    status: "open",
    daysAgo: 0.6,
  },
  {
    id: "h_maya_kittens",
    authorId: "u_maya",
    title: "Foster homes for two kittens",
    description:
      "Pepper and Ginger are 8 weeks old, litter-trained and vaccinated. They need a quiet foster home for 3–4 weeks until adoption. I'll provide food, litter and vet support — you just provide cuddles.",
    category: "animals",
    location: "Hyderabad",
    neededInDays: 7,
    helpersNeeded: 2,
    photo: PHOTOS.shelter[3],
    offers: [["u_zara", "I work from home and have a spare room. Can take one!", 5]],
    status: "open",
    daysAgo: 1,
  },
  {
    id: "h_ishita_sorting",
    authorId: "u_ishita",
    title: "5 pairs of hands for Saturday sorting",
    description: "The winter drive has over 400 donations waiting. We need people to sort by size, fold and pack bags for three night shelters. 10am–1pm, chai and snacks on us.",
    category: "charity",
    location: "Indiranagar, Bengaluru",
    neededInDays: 4,
    helpersNeeded: 5,
    photo: PHOTOS.clothes[2],
    offers: [
      ["u_sarah", "I'll be there by 10!", 2],
      ["u_aarav", "Sending two volunteers from our Bengaluru chapter.", 6],
    ],
    status: "open",
    daysAgo: 2,
  },
  {
    id: "h_aarav_cooks",
    authorId: "u_aarav",
    title: "Two extra cooks for Sunday meals",
    description:
      "We're expecting 350+ people this Sunday and two of our regular cooks are away. If you can chop onions fast and don't mind a hot kitchen from 3pm, we'd love your help.",
    category: "charity",
    location: "Pune Station Road",
    neededInDays: 3,
    helpersNeeded: 2,
    photo: PHOTOS.kitchen[2],
    offers: [],
    status: "open",
    daysAgo: 1.5,
  },
  {
    id: "h_noor_drivers",
    authorId: "u_noor",
    title: "Drivers for elders' clinic visits",
    description: "Three residents at the care home have physiotherapy twice a week and taxis are getting expensive. Looking for volunteers with a car for Tuesday or Thursday mornings.",
    category: "humanity",
    location: "Amman",
    neededInDays: 10,
    helpersNeeded: 3,
    offers: [],
    status: "open",
    daysAgo: 3,
  },
  {
    id: "h_ramesh_books",
    authorId: "u_ramesh",
    title: "Tamil storybooks for the neem tree library",
    description: "Our story hour has grown to 25 children but we only have 30 books, mostly in English. Any Tamil picture books or simple readers would be a treasure.",
    category: "education",
    location: "Madurai",
    neededInDays: 14,
    helpersNeeded: 4,
    photo: PHOTOS.books[1],
    offers: [["u_kabir", "Couriering a box of 20 from Delhi this week, sir.", 20]],
    status: "open",
    daysAgo: 4,
  },
  {
    id: "h_rafael_bolota",
    authorId: "u_rafael",
    title: "A forever home for Bolota",
    description: "Gentle, house-trained, about two years old and great with kids. He's been with me for a while and deserves his own sofa. Porto area preferred.",
    category: "animals",
    location: "Porto",
    neededInDays: 20,
    helpersNeeded: 1,
    photo: PHOTOS.dogs[5],
    offers: [["u_oliver", "I'll share his story with our adopters' group — some are open to travelling.", 9]],
    status: "open",
    daysAgo: 6,
  },
  {
    id: "h_lukas_parts",
    authorId: "u_lukas",
    title: "Spare bike parts for the repair café",
    description: "Running low on brake pads, inner tubes (26\" and 28\") and chains. If you've got spares gathering dust, we'll put them to good use.",
    category: "community",
    location: "Žižkov, Prague",
    neededInDays: 9,
    helpersNeeded: 6,
    offers: [],
    status: "open",
    daysAgo: 5,
  },
  {
    id: "h_emma_books",
    authorId: "u_emma",
    title: "Picture books for the reading club",
    description: "We've grown to 19 kids and need more picture books for ages 4–8.",
    category: "education",
    location: "Bristol",
    neededInDays: -10,
    helpersNeeded: 3,
    photo: PHOTOS.books[0],
    offers: [
      ["u_sam", "Mailing a box of our swap-meet books!", 4],
      ["u_ethan", "The library has duplicates we can donate.", 12],
      ["u_ramesh", undefined, 30],
    ],
    status: "fulfilled",
    daysAgo: 24,
  },
];
