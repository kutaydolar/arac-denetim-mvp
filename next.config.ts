import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove any experimental turbo or deprecated flags
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;