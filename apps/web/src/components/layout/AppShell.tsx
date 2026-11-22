"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ErrorState } from "@/components/common/ErrorState";
import { ROUTES } from "@/config/routes";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import { cn } from "@/lib/utils";

import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";
import { RightRail } from "./RightRail";
import { ShellSkeleton } from "./ShellSkeleton";
import { Sidebar } from "./Sidebar";

const WIDE_ROUTES = [ROUTES.discover, "/u", ROUTES.challenges, ROUTES.help];

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { sessionStatus, ready, failed } = useAppBootstrap();

  useEffect(() => {
    if (sessionStatus === "anonymous") router.replace(ROUTES.login);
  }, [sessionStatus, router]);

  if (failed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <ErrorState message="We couldn't load the community. Refresh the page to try again." onRetry={() => window.location.reload()} />
      </div>
    );
  }
  if (!ready) return <ShellSkeleton />;

  const wide = WIDE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  return (
    <div className="flex min-h-dvh">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <div className="flex flex-1 justify-center gap-8 xl:gap-10">
          <main
            id="main"
            className={cn("w-full min-w-0 px-4 pb-28 pt-4 sm:px-6 lg:pb-12 lg:pt-8", wide ? "max-w-5xl" : "max-w-2xl")}
          >
            {children}
          </main>
          {!wide && <RightRail />}
        </div>
      </div>
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
