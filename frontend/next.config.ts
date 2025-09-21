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
  sassOptions: {
    prependData: `
    @use "@/styles/_variables.scss" as *;
    @use "@/styles/_mixins.scss" as *;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kwclasslog.s3.ap-southeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextPWA(nextConfig);
