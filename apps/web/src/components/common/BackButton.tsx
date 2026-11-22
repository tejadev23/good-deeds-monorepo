"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftLinear } from "solar-icon-set";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(ROUTES.feed))}
    >
      <ArrowLeftLinear size={18} />
      {label}
    </Button>
  );
}
