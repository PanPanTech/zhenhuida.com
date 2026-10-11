import type { NextConfig } from "next";

// Static export for GitHub Pages: `next build` writes the whole site to `out/`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
