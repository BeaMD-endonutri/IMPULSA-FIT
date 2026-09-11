import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/IMPULSA-FIT" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/IMPULSA-FIT/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
