"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !border-border !bg-card !text-foreground !shadow-lift !font-sans",
          description: "!text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
