"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GhostLinear } from "solar-icon-set";

import { BackButton } from "@/components/common/BackButton";
import { EmptyState } from "@/components/common/EmptyState";
import { CommentComposer } from "@/components/deeds/CommentComposer";
import { CommentList } from "@/components/deeds/CommentList";
import { DeedCard } from "@/components/deeds/DeedCard";
import { RippleSection } from "@/components/ripples/RippleSection";
import { FeedSkeleton } from "@/components/deeds/DeedCardSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useComments } from "@/hooks/useComments";
import { useUsersById } from "@/hooks/useUsersById";
import { useDeedStore } from "@/store/deedStore";

function DeedDetail() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const deed = useDeedStore((s) => s.deeds.find((d) => d.id === id));
  const status = useDeedStore((s) => s.status);
  const usersById = useUsersById();
  const comments = useComments(id);

  if (status === "loading" || status === "idle") return <FeedSkeleton count={1} />;

  if (!deed) {
    return (
      <div className="space-y-4">
        <BackButton />
        <EmptyState
          icon={GhostLinear}
          title="This deed isn't here anymore"
          description="It may have been deleted, or the link is incorrect."
          action={
            <Button asChild size="sm">
              <Link href={ROUTES.feed}>Back to the feed</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BackButton />
      <DeedCard
        deed={deed}
        variant="detail"
        onCommentClick={() => document.getElementById("comment-composer")?.querySelector("input")?.focus()}
        onDeleted={() => router.replace(ROUTES.feed)}
      />
      <RippleSection deed={deed} />
      <Card id="comments">
        <CardHeader>
          <CardTitle>
            Comments <span className="font-sans text-base font-normal text-muted-foreground">({comments.comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <CommentList comments={comments.comments} usersById={usersById} />
          <div id="comment-composer" className="border-t border-border/70 pt-4">
            <CommentComposer
              draft={comments.draft}
              onDraftChange={comments.setDraft}
              onSubmit={() => void comments.submit()}
              sending={comments.sending}
              canSubmit={comments.canSubmit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <DeedDetail />
    </Suspense>
  );
}
