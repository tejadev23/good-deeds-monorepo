"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ShellSkeleton } from "@/components/layout/ShellSkeleton";
import { ROUTES } from "@/config/routes";
import { useSessionStore } from "@/store/sessionStore";

export default function HomePage() {
  const router = useRouter();
  const { status, restore } = useSessionStore();

  useEffect(() => {
    if (status === "checking") void restore();
    else router.replace(status === "authenticated" ? ROUTES.feed : ROUTES.login);
  }, [status, restore, router]);

  return <ShellSkeleton label="Welcome to Good Deeds" />;
}
