import type { NextConfig } from "next";

// GitHub Pages serves this repo at /my-portfolio, so the build needs that prefix.
// Set by the deploy workflow; empty locally so `next dev` still runs at /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
