import Link from "next/link";
import { StarRingsLinear } from "solar-icon-set";

import { ROUTES } from "@/config/routes";

export function RippleChip({ deedId, reach }: { deedId: string; reach: number }) {
  if (reach === 0) return null;
  return (
    <Link
      href={`${ROUTES.deed(deedId)}#ripples`}
      className="inline-flex items-center gap-1.5 rounded-full bg-cat-community-subtle px-3 py-1 text-xs font-semibold text-cat-community transition-transform hover:scale-[1.03]"
    >
      <StarRingsLinear size={14} />
      Inspired {reach} more deed{reach === 1 ? "" : "s"}
    </Link>
  );
}
