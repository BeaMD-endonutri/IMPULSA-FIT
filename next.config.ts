import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.GITHUB_ACTIONS ? "export" : undefined,
  basePath: process.env.GITHUB_ACTIONS ? "/IMPULSA-FIT" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/IMPULSA-FIT/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
