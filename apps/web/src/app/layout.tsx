import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Good Deeds — Small actions. A better world.", template: "%s · Good Deeds" },
  description: "A positive social community where people share good actions, inspire others and create real impact.",
};

export const viewport: Viewport = {
  themeColor: "#f8f6ef",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
