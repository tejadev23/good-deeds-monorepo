import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=true builds a fully static site into `out/` (used for GitHub Pages).
 * NEXT_PUBLIC_BASE_PATH serves it from a sub-folder, e.g. /Good-deeds-app.
 * Without them, the app builds normally for `next start` or Vercel.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/shared"],
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  ...(basePath && { basePath }),
};

export default nextConfig;
