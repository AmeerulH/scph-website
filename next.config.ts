import type { NextConfig } from "next";
import { GTP_2026_REGISTRATION_URL } from "./src/lib/gtp-registration-url";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/events/gtp-2026/register",
        destination: GTP_2026_REGISTRATION_URL,
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
