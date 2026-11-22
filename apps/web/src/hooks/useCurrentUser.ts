"use client";

import { useSessionStore } from "@/store/sessionStore";
import { useUserStore } from "@/store/userStore";
import type { User } from "@/types";

/** The signed-in user's profile (null while loading or signed out). */
export function useCurrentUser(): User | null {
  const userId = useSessionStore((s) => s.userId);
  return useUserStore((s) => s.users.find((u) => u.id === userId) ?? null);
}

export function useCurrentUserId(): string | null {
  return useSessionStore((s) => s.userId);
}
