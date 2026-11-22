"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarLinear, HandShakeLinear, MapPointLinear, UsersGroupRoundedLinear } from "solar-icon-set";

import { BackButton } from "@/components/common/BackButton";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { UserAvatar } from "@/components/common/UserAvatar";
import { HelpActions } from "@/components/help/HelpActions";
import { HelperProgress } from "@/components/help/HelperProgress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useUsersById } from "@/hooks/useUsersById";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { neededByLabel } from "@/lib/help";
import { useHelpStore } from "@/store/helpStore";

function HelpRequestDetail() {
  const id = useSearchParams().get("id") ?? "";
  const viewerId = useCurrentUserId();
  const request = useHelpStore((s) => s.requests.find((r) => r.id === id));
  const status = useHelpStore((s) => s.status);
  const usersById = useUsersById();

  if (!request) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <BackButton />
        {status === "ready" && <EmptyState icon={HandShakeLinear} title="Request not found" description="It may have been removed." />}
      </div>
    );
  }

  const author = usersById.get(request.authorId);
  const isAuthor = viewerId === request.authorId;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <BackButton />
      <article className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft">
        {request.imageUrl && <SmartImage src={request.imageUrl} alt={request.title} wrapperClassName="aspect-[16/7]" />}
        <div className="space-y-5 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={request.category} />
            <Badge variant={request.status === "fulfilled" ? "environment" : "sun"}>{neededByLabel(request)}</Badge>
          </div>
          <h1 className="text-2xl font-semibold text-forest sm:text-3xl">{request.title}</h1>
          {author && (
            <Link href={ROUTES.profile(author.username)} className="flex w-fit items-center gap-3">
              <UserAvatar user={author} size="md" />
              <div>
                <p className="text-sm font-semibold hover:underline">{author.name}</p>
                <p className="text-xs text-muted-foreground">Asked {formatRelativeTime(request.createdAt)}</p>
              </div>
            </Link>
          )}
          <p className="whitespace-pre-line text-base leading-relaxed text-foreground/85">{request.description}</p>
          <dl className="grid gap-3 rounded-2xl bg-muted/60 p-4 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <MapPointLinear size={18} className="text-forest-soft" />
              <div>
                <dt className="text-xs text-muted-foreground">Where</dt>
                <dd className="font-medium">{request.location}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarLinear size={18} className="text-forest-soft" />
              <div>
                <dt className="text-xs text-muted-foreground">Needed by</dt>
                <dd className="font-medium">{formatDate(request.neededBy, "EEE d MMM")}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UsersGroupRoundedLinear size={18} className="text-forest-soft" />
              <div>
                <dt className="text-xs text-muted-foreground">People needed</dt>
                <dd className="font-medium">{request.helpersNeeded}</dd>
              </div>
            </div>
          </dl>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
            <HelperProgress offered={request.offers.length} needed={request.helpersNeeded} />
            <HelpActions request={request} />
          </div>
        </div>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isAuthor ? "People who offered to help" : "Offers so far"}</CardTitle>
        </CardHeader>
        <CardContent>
          {request.offers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No offers yet{isAuthor ? " — share the request with friends nearby." : ". You could be the first!"}</p>
          ) : (
            <ul className="space-y-4">
              {request.offers.map((offer) => {
                const helper = usersById.get(offer.userId);
                if (!helper) return null;
                return (
                  <li key={offer.userId} className="flex gap-3">
                    <UserAvatar user={helper} size="sm" linked />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <Link href={ROUTES.profile(helper.username)} className="font-semibold hover:underline">
                          {helper.name}
                        </Link>{" "}
                        <span className="text-muted-foreground">offered {formatRelativeTime(offer.createdAt)}</span>
                      </p>
                      {offer.message && <p className="mt-1 rounded-2xl rounded-tl-md bg-muted px-3.5 py-2 text-sm">{offer.message}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <HelpRequestDetail />
    </Suspense>
  );
}
