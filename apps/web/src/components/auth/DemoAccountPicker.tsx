"use client";

import { AltArrowRightLinear, InfoCircleLinear, RestartCircleLinear } from "solar-icon-set";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/config/demo-accounts";
import { avatarUrl, PORTRAITS } from "@/config/images";

const DEMO_PORTRAITS: Record<string, string> = {
  u_sarah: avatarUrl(PORTRAITS.women[0]),
  u_aarav: avatarUrl(PORTRAITS.men[2]),
  u_maya: avatarUrl(PORTRAITS.women[7]),
};

type Props = { pendingId: string | null; onPick: (account: DemoAccount) => void };

export function DemoAccountPicker({ pendingId, onPick }: Props) {
  return (
    <section aria-labelledby="demo-accounts" className="space-y-3">
      <div className="flex items-center gap-2">
        <InfoCircleLinear size={16} className="text-sun" />
        <h2 id="demo-accounts" className="font-sans text-sm font-semibold">
          Demo accounts — tap to sign in
        </h2>
      </div>
      <ul className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <li key={account.userId}>
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 rounded-2xl p-3 text-left hover:border-sage"
              disabled={pendingId !== null}
              onClick={() => onPick(account)}
            >
              <UserAvatar user={{ name: account.name, avatarUrl: DEMO_PORTRAITS[account.userId], username: account.userId }} size="md" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold">{account.name}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">{account.persona}</span>
                <span className="truncate font-mono text-xs font-normal text-forest-soft">
                  {account.email} · {account.password}
                </span>
              </span>
              {pendingId === account.userId ? (
                <RestartCircleLinear size={18} className="animate-spin text-primary" />
              ) : (
                <AltArrowRightLinear size={18} className="text-muted-foreground" />
              )}
            </Button>
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-muted-foreground">
        These demo credentials are checked locally in your browser for this prototype only — there&apos;s no real authentication here.
      </p>
    </section>
  );
}
