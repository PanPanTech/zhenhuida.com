import type { NextConfig } from "next";

// Static export for GitHub Pages: `next build` writes the whole site to `out/`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // The root layout does not render <html> so each locale can set `lang`.
  // Unmatched URLs use app/global-not-found.tsx, which supplies its own document.
  experimental: { globalNotFound: true },
};

export default nextConfig;
