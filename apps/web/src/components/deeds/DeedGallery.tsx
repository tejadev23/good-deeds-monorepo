"use client";

import { useState } from "react";
import { AltArrowLeftLinear, AltArrowRightLinear } from "solar-icon-set";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

const GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 grid-rows-2",
};

export function DeedGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (images.length === 0) return null;

  const shown = images.slice(0, 3);
  const extra = images.length - shown.length;

  return (
    <>
      <div className={cn("grid gap-1 overflow-hidden rounded-2xl", GRID[shown.length] ?? GRID[3])}>
        {shown.map((src, index) => (
          <Button
            key={src.slice(-40) + index}
            variant="bare"
            size="bare"
            onClick={() => setOpenIndex(index)}
            className={cn(
              "group relative block size-full cursor-zoom-in overflow-hidden",
              shown.length === 3 && index === 0 && "row-span-2",
            )}
            aria-label={`Open photo ${index + 1} of ${images.length}`}
          >
            <SmartImage
              src={src}
              alt={`${title} — photo ${index + 1}`}
              wrapperClassName={cn(shown.length === 1 ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-square h-full")}
              className="transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {extra > 0 && index === shown.length - 1 && (
              <span className="absolute inset-0 flex items-center justify-center bg-surface-overlay text-xl font-semibold text-primary-foreground">+{extra}</span>
            )}
          </Button>
        ))}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent sheetOnMobile={false} className="max-w-3xl gap-3 border-none bg-forest p-3 sm:p-4">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {openIndex !== null && (
            <div className="relative">
              <SmartImage src={images[openIndex]} alt={`${title} — photo ${openIndex + 1}`} wrapperClassName="max-h-[75dvh] rounded-2xl" className="object-contain" />
              {images.length > 1 && (
                <div className="mt-3 flex items-center justify-between text-primary-foreground">
                  <Button variant="ghost" size="icon-sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setOpenIndex((openIndex - 1 + images.length) % images.length)} aria-label="Previous photo">
                    <AltArrowLeftLinear size={20} />
                  </Button>
                  <span className="text-sm">
                    {openIndex + 1} / {images.length}
                  </span>
                  <Button variant="ghost" size="icon-sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setOpenIndex((openIndex + 1) % images.length)} aria-label="Next photo">
                    <AltArrowRightLinear size={20} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
