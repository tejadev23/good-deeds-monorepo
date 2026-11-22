import Link from "next/link";
import { AltArrowRightLinear, HandShakeLinear } from "solar-icon-set";

import { ROUTES } from "@/config/routes";

const LINKS = [
  { href: ROUTES.help, title: "Help board", text: "Neighbours asking for a hand — offer yours, or ask for one", icon: HandShakeLinear, className: "bg-cat-humanity-subtle text-cat-humanity" },
];

export function QuickLinks() {
  return (
    <div className="grid gap-3">
      {LINKS.map(({ href, title, text, icon: Icon, className }) => (
        <Link key={href} href={href} className="group flex items-center gap-3 rounded-3xl border border-border/80 bg-card p-4 shadow-soft transition-shadow hover:shadow-lift">
          <span className={`flex size-12 items-center justify-center rounded-2xl ${className}`}>
            <Icon size={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{title}</span>
            <span className="block text-sm text-muted-foreground">{text}</span>
          </span>
          <AltArrowRightLinear size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}
