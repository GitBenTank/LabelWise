import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure proper transpilation of workspace packages
  transpilePackages: ['@labelwise/shared', '@labelwise/core', '@labelwise/db'],
};

export default nextConfig;
