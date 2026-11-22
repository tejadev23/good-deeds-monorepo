"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HandHeartLinear, LeafLinear, UsersGroupRoundedLinear } from "solar-icon-set";

import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/common/Logo";
import { ShellSkeleton } from "@/components/layout/ShellSkeleton";
import { SmartImage } from "@/components/ui/smart-image";
import { PHOTOS, unsplash } from "@/config/images";
import { ROUTES } from "@/config/routes";
import { useSessionStore } from "@/store/sessionStore";

const HIGHLIGHTS = [
  { icon: LeafLinear, text: "Share the good you do — big or small" },
  { icon: UsersGroupRoundedLinear, text: "Find people and causes near you" },
  { icon: HandHeartLinear, text: "Recognition, not points. Kindness isn't a competition." },
];

export default function LoginPage() {
  const router = useRouter();
  const { status, restore } = useSessionStore();

  useEffect(() => {
    if (status === "checking") void restore();
    if (status === "authenticated") router.replace(ROUTES.feed);
  }, [status, restore, router]);

  if (status !== "anonymous") return <ShellSkeleton />;

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <SmartImage src={unsplash(PHOTOS.treePlanting[1], 1600)} alt="Volunteers planting a sapling together" wrapperClassName="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/50 to-forest/10" />
        <div className="relative flex h-full flex-col justify-end gap-6 p-12 text-primary-foreground">
          <h1 className="max-w-lg font-display text-5xl font-semibold leading-tight">Small actions.<br />A better world.</h1>
          <ul className="space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-base text-primary-foreground/90">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-col">
        <div className="relative h-44 overflow-hidden lg:hidden">
          <SmartImage src={unsplash(PHOTOS.treePlanting[1], 900, 400)} alt="" wrapperClassName="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 pb-12 lg:py-12">
          <div className="-mt-10 space-y-4 lg:mt-0">
            <Logo href={ROUTES.login} showTagline />
            <div className="space-y-1.5">
              <h2 className="text-3xl font-semibold text-forest">Welcome back</h2>
              <p className="text-muted-foreground">Sign in to see what your community has been up to.</p>
            </div>
          </div>
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
