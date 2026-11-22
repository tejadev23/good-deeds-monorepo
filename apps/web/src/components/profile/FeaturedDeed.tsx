import Link from "next/link";
import { HeartLinear, StarShineLinear } from "solar-icon-set";

import { CategoryBadge } from "@/components/common/CategoryBadge";
import { SmartImage } from "@/components/ui/smart-image";
import { ROUTES } from "@/config/routes";
import { formatCompactNumber, formatDate } from "@/lib/format";
import { likeCount } from "@/lib/selectors";
import type { Deed } from "@/types";

export function FeaturedDeed({ deed }: { deed: Deed }) {
  return (
    <Link
      href={ROUTES.deed(deed.id)}
      className="group relative block overflow-hidden rounded-3xl border border-border/80 bg-forest shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {deed.images[0] ? (
        <SmartImage src={deed.images[0]} alt={deed.title} wrapperClassName="aspect-[16/10]" className="transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="aspect-[16/10] bg-gradient-to-br from-forest-soft to-forest" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-forest backdrop-blur">
          <StarShineLinear size={14} className="text-sun" /> Featured deed
        </span>
        <CategoryBadge category={deed.category} />
      </div>
      <div className="absolute inset-x-0 bottom-0 space-y-1 p-5 text-primary-foreground">
        <h3 className="text-xl font-semibold leading-snug">{deed.title}</h3>
        <p className="flex items-center gap-3 text-sm text-primary-foreground/80">
          <span className="flex items-center gap-1">
            <HeartLinear size={14} /> {formatCompactNumber(likeCount(deed))}
          </span>
          <span>{formatDate(deed.createdAt)}</span>
        </p>
      </div>
    </Link>
  );
}
