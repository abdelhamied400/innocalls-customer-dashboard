import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
