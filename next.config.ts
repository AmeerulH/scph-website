import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { GTP_2026_REGISTRATION_URL } from "./src/lib/gtp-registration-url";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/events/gtp-2026/register",
        destination: GTP_2026_REGISTRATION_URL,
        permanent: true,
      },
      {
        source: "/events/gtp-2026/programmes/ai-thinkers-networking-breakfast",
        destination: "/events/gtp-2026/programmes/artificial-intelligence-sessions",
        permanent: true,
      },
    ];
  },

  async headers() {
    // Dev chunk filenames are not content-hashed, so immutable caching serves stale CSS/JS.
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        // Static assets: images, fonts, JS, CSS — cache for 1 year
        source: "/:path((?!_next/static|_next/image).*\\.(?:jpg|jpeg|png|webp|avif|ico|svg|woff|woff2|ttf|otf)$)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js static JS/CSS chunks — cache 1 year (filenames are content-hashed)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js image optimisation endpoint — cache for 1 day
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  images: {
    // WebP only — AVIF encoding is too slow on first request (hurts LCP)
    formats: ["image/webp"],
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
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
