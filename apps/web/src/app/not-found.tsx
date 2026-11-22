import Link from "next/link";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-forest">This path leads nowhere</h1>
        <p className="text-muted-foreground">But there&apos;s plenty of good happening back in the feed.</p>
      </div>
      <Button asChild>
        <Link href="/feed">Back to Good Deeds</Link>
      </Button>
    </div>
  );
}
