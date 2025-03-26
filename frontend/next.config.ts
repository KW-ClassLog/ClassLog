// @ts-expect-error: Type definitions for "next-pwa" are missing
import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextPWA = withPWA({
  dest: "public",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config: { cache: boolean }) => {
    config.cache = false;
    return config;
  },
};

export default nextPWA(nextConfig);
