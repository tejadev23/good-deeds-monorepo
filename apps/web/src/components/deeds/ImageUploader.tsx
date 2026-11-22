"use client";

import { useRef, useState } from "react";
import { CloseCircleLinear, GalleryAddLinear, RestartCircleLinear } from "solar-icon-set";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  images: string[];
  max: number;
  processing: boolean;
  onAdd: (files: FileList | File[]) => void;
  onRemove: (index: number) => void;
};

export function ImageUploader({ images, max, processing, onAdd, onRemove }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const canAdd = images.length < max;

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {images.map((src, index) => (
            <li key={index} className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted animate-in fade-in-0 zoom-in-95">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Upload preview ${index + 1}`} className="size-full object-cover" />
              <Button
                type="button"
                size="icon-xs"
                variant="outline"
                onClick={() => onRemove(index)}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute right-1.5 top-1.5 bg-card/90 backdrop-blur"
              >
                <CloseCircleLinear size={18} />
              </Button>
              {index === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-full bg-card/90 px-2 py-0.5 text-xs font-semibold">Cover</span>}
            </li>
          ))}
        </ul>
      )}

      {canAdd && (
        <Button
          type="button"
          variant="bare"
          size="bare"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files.length) onAdd(e.dataTransfer.files);
          }}
          className={cn(
            "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragging ? "border-primary bg-secondary" : "border-border bg-sage-subtle/50 hover:border-sage hover:bg-sage-subtle",
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-card text-forest shadow-soft">
            {processing ? <RestartCircleLinear size={24} className="animate-spin" /> : <GalleryAddLinear size={24} />}
          </span>
          <span className="text-sm font-semibold">{processing ? "Preparing photos…" : "Add photos"}</span>
          <span className="text-xs text-muted-foreground">
            Drag & drop or tap to choose · up to {max} · {images.length}/{max} added
          </span>
        </Button>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          if (e.target.files?.length) onAdd(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
