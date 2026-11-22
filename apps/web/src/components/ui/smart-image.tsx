"use client";

import * as React from "react";
import { GalleryLinear } from "solar-icon-set";

import { cn } from "@/lib/utils";

type SmartImageProps = Omit<React.ComponentProps<"img">, "src"> & {
  src?: string | null;
  /** Classes applied to the wrapper (controls size / aspect ratio). */
  wrapperClassName?: string;
};

/**
 * Lazy-loaded image with a soft shimmer while loading and a branded
 * fallback when the remote asset is unavailable.
 */
function SmartImage({ src, alt = "", className, wrapperClassName, ...props }: SmartImageProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(src ? "loading" : "error");

  React.useEffect(() => {
    setStatus(src ? "loading" : "error");
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-sage-subtle", wrapperClassName)}>
      {status === "loading" && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-sage-subtle to-secondary" />}
      {status === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage-subtle via-secondary to-sage/50 text-forest-soft">
          <GalleryLinear size={32} />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src ?? undefined}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn("size-full object-cover transition-opacity duration-500", status === "loaded" ? "opacity-100" : "opacity-0", className)}
          {...props}
        />
      )}
    </div>
  );
}

export { SmartImage };
