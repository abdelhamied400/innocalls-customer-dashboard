import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

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
};

export default withNextIntl(nextConfig);
