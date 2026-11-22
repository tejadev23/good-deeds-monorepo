"use client";

import Link from "next/link";
import { AltArrowRightLinear, HandShakeLinear, MapPointLinear } from "solar-icon-set";

import { UserAvatar } from "@/components/common/UserAvatar";
import { ROUTES } from "@/config/routes";
import { useHelpSuggestions } from "@/hooks/useHelp";
import { useUsersById } from "@/hooks/useUsersById";
import { neededByLabel } from "@/lib/help";

import { HelpActions } from "./HelpActions";

/** "Neighbours need a hand" card shown between feed posts. */
export function HelpTeaser() {
  const requests = useHelpSuggestions(2);
  const usersById = useUsersById();
  if (requests.length === 0) return null;

  return (
    <section className="space-y-3 rounded-3xl border border-cat-humanity/20 bg-cat-humanity-subtle/60 p-4 sm:p-5" aria-labelledby="help-teaser">
      <div className="flex items-center justify-between gap-2">
        <h2 id="help-teaser" className="flex items-center gap-2 font-sans text-sm font-semibold text-cat-humanity">
          <HandShakeLinear size={18} /> Neighbours need a hand
        </h2>
        <Link href={ROUTES.help} className="flex items-center gap-0.5 text-xs font-semibold text-cat-humanity hover:underline">
          Help board <AltArrowRightLinear size={14} />
        </Link>
      </div>
      <ul className="space-y-2">
        {requests.map((request) => {
          const author = usersById.get(request.authorId);
          return (
            <li key={request.id} className="flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-soft sm:flex-row sm:items-center">
              <Link href={ROUTES.helpRequest(request.id)} className="flex min-w-0 flex-1 items-center gap-3">
                {author && <UserAvatar user={author} size="md" />}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold hover:underline">{request.title}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    {author?.name.split(" ")[0]} · <MapPointLinear size={12} /> {request.location.split(",")[0]} · {neededByLabel(request)}
                  </p>
                </div>
              </Link>
              <HelpActions request={request} size="xs" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
