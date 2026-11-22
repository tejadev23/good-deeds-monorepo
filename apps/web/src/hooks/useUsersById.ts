"use client";

import { useMemo } from "react";

import { useUserStore } from "@/store/userStore";
import type { User } from "@/types";

export function useUsersById(): Map<string, User> {
  const users = useUserStore((s) => s.users);
  return useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);
}
