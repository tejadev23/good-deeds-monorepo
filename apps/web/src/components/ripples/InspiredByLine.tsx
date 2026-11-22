import Link from "next/link";
import { StarRingsLinear } from "solar-icon-set";

import { ROUTES } from "@/config/routes";
import type { Deed, User } from "@/types";

export function InspiredByLine({ origin, author }: { origin: Deed; author?: User }) {
  return (
    <Link
      href={ROUTES.deed(origin.id)}
      className="group flex items-center gap-2 rounded-xl bg-cat-community-subtle/70 px-3 py-2 text-sm text-cat-community transition-colors hover:bg-cat-community-subtle"
    >
      <StarRingsLinear size={16} className="shrink-0" />
      <span className="min-w-0 truncate">
        Inspired by {author ? <span className="font-semibold">{author.name.split(" ")[0]}&apos;s</span> : null} “<span className="group-hover:underline">{origin.title}</span>”
      </span>
    </Link>
  );
}
