import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/80 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-invalid:border-destructive disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
