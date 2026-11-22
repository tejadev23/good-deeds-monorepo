"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CloseCircleLinear } from "solar-icon-set";

import { cn } from "@/lib/utils";

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-surface-overlay backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  /** Renders as a bottom sheet on small screens. */
  sheetOnMobile?: boolean;
};

function DialogContent({ className, children, showCloseButton = true, sheetOnMobile = true, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed z-50 flex max-h-[90dvh] flex-col gap-4 overflow-hidden border border-border bg-card p-6 shadow-lift outline-none duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          sheetOnMobile
            ? "inset-x-0 bottom-0 rounded-t-3xl pb-safe data-[state=open]:slide-in-from-bottom-8 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:pb-6 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-0"
            : "left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        {sheetOnMobile && <div className="mx-auto -mt-2 mb-1 h-1.5 w-10 rounded-full bg-border sm:hidden" aria-hidden />}
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Close"
          >
            <CloseCircleLinear size={22} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("font-display text-xl font-semibold", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
