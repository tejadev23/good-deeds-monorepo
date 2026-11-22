import { z } from "zod";
import { CATEGORIES, LIMITS, RESERVED_USERNAMES, USERNAME_PATTERN } from "./constants";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const trimmed = (max: number) => z.string().trim().max(max);

export const categorySchema = z.enum(CATEGORIES);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(USERNAME_PATTERN, "3–24 characters: letters, numbers, dots or underscores")
  .refine((value) => !RESERVED_USERNAMES.includes(value), "That username is reserved");

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(LIMITS.pageSizeMax).default(LIMITS.pageSizeDefault),
});

export const onboardingSchema = z.object({
  username: usernameSchema,
  name: trimmed(LIMITS.name).min(1),
  location: trimmed(LIMITS.location).default(""),
  interests: z.array(categorySchema).max(CATEGORIES.length).default([]),
});

export const updateProfileSchema = z
  .object({
    name: trimmed(LIMITS.name).min(1),
    bio: trimmed(LIMITS.bio),
    location: trimmed(LIMITS.location),
    interests: z.array(categorySchema).max(CATEGORIES.length),
    avatarUrl: z.url().nullable(),
    coverUrl: z.url().nullable(),
  })
  .partial();

export const deedImageInputSchema = z.object({
  storagePath: z.string().min(1).max(300),
  url: z.url(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const createDeedSchema = z.object({
  title: trimmed(LIMITS.deedTitle).min(3),
  description: trimmed(LIMITS.deedDescription).min(10),
  category: categorySchema,
  activityDate: isoDate,
  location: trimmed(LIMITS.location).optional(),
  images: z.array(deedImageInputSchema).max(LIMITS.deedImages).default([]),
  inspiredById: z.uuid().optional(),
  challenge: z.object({ challengeId: z.uuid(), amount: z.number().int().min(1).max(100_000) }).optional(),
});

export const feedQuerySchema = paginationSchema.extend({
  scope: z.enum(["all", "following"]).default("all"),
  category: categorySchema.optional(),
  q: z.string().trim().max(80).optional(),
  author: z.string().optional(),
});

export const commentSchema = z.object({ text: trimmed(LIMITS.comment).min(1) });

export const reportSchema = z.object({
  targetType: z.enum(["DEED", "COMMENT", "USER", "HELP_REQUEST"]),
  targetId: z.uuid(),
  reason: z.enum(["SPAM", "FAKE", "SELF_PROMOTION", "INAPPROPRIATE", "HARASSMENT", "OTHER"]),
  details: trimmed(500).optional(),
});

export const deviceTokenSchema = z.object({
  token: z.string().min(10).max(4096),
  platform: z.enum(["IOS", "ANDROID", "WEB"]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateDeedInput = z.infer<typeof createDeedSchema>;
export type FeedQuery = z.infer<typeof feedQuerySchema>;
export type ReportInput = z.infer<typeof reportSchema>;
