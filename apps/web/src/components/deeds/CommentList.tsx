import Link from "next/link";
import { ChatRoundLineLinear } from "solar-icon-set";

import { UserAvatar } from "@/components/common/UserAvatar";
import { ROUTES } from "@/config/routes";
import { formatRelativeTime } from "@/lib/format";
import type { Comment, User } from "@/types";

export function CommentList({ comments, usersById }: { comments: Comment[]; usersById: Map<string, User> }) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
        <ChatRoundLineLinear size={28} />
        <p className="text-sm">No comments yet. Say something encouraging!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => {
        const author = usersById.get(comment.authorId);
        if (!author) return null;
        return (
          <li key={comment.id} className="flex gap-3 animate-in fade-in-0 slide-in-from-bottom-1">
            <UserAvatar user={author} size="sm" linked />
            <div className="min-w-0 flex-1">
              <div className="rounded-2xl rounded-tl-md bg-muted px-3.5 py-2.5">
                <Link href={ROUTES.profile(author.username)} className="text-sm font-semibold hover:underline">
                  {author.name}
                </Link>
                <p className="whitespace-pre-line break-words text-sm text-foreground/90">{comment.text}</p>
              </div>
              <p className="mt-1 pl-3 text-xs text-muted-foreground">{formatRelativeTime(comment.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
