import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border font-semibold transition-colors [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-card text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        sun: "border-transparent bg-sun-subtle text-sun",
        environment: "border-transparent bg-cat-environment-subtle text-cat-environment",
        animals: "border-transparent bg-cat-animals-subtle text-cat-animals",
        education: "border-transparent bg-cat-education-subtle text-cat-education",
        humanity: "border-transparent bg-cat-humanity-subtle text-cat-humanity",
        charity: "border-transparent bg-cat-charity-subtle text-cat-charity",
        community: "border-transparent bg-cat-community-subtle text-cat-community",
      },
      size: {
        sm: "h-6 px-2.5 text-xs [&>svg]:size-3.5",
        md: "h-7 px-3 text-sm [&>svg]:size-4",
        lg: "h-9 px-4 text-sm [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
export type { BadgeProps };
