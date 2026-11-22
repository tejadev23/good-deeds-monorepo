import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { RestartCircleLinear } from "solar-icon-set";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 shrink-0 outline-none focus-visible:ring-ring/60 focus-visible:ring-[3px] active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md shadow-primary/15 hover:bg-forest hover:shadow-primary/25",
        secondary: "bg-secondary text-secondary-foreground hover:bg-sage/40",
        outline: "border border-border bg-card text-foreground hover:bg-accent",
        ghost: "text-foreground hover:bg-accent",
        subtle: "text-muted-foreground hover:bg-accent hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline rounded-none",
        /** Unstyled clickable surface (image tiles, cards). */
        bare: "rounded-none font-normal whitespace-normal active:scale-100",
        nav: "w-full justify-start rounded-2xl text-base font-medium text-forest-soft hover:bg-accent hover:text-foreground data-[active=true]:bg-secondary data-[active=true]:text-forest data-[active=true]:font-semibold",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        xs: "h-7 px-3 text-xs gap-1",
        lg: "h-12 px-7 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-xs": "size-8",
        nav: "h-12 px-4 gap-3",
        bare: "h-auto p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

function Button({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={asChild ? undefined : loading || disabled}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && <RestartCircleLinear size={16} className="animate-spin" />}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
