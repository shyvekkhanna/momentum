import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship raw TypeScript source (no build step), so the
  // Next.js compiler needs to transpile them like first-party app code.
  transpilePackages: [
    "@momentum/types",
    "@momentum/core",
    "@momentum/storage",
    "@momentum/notifications",
  ],
};

export default nextConfig;
