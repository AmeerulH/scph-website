import { defineUnlighthouseConfig } from "unlighthouse/config";

/**
 * Site origin is set by `scripts/unlighthouse-scan.mjs` via `--site` (from
 * UNLIGHTHOUSE_SITE or SCAN_SITE_URL). Optional env here merges when present.
 */
const siteFromEnv =
  process.env.UNLIGHTHOUSE_SITE?.trim() ||
  process.env.SCAN_SITE_URL?.trim() ||
  "";

export default defineUnlighthouseConfig({
  ...(siteFromEnv ? { site: siteFromEnv } : {}),
  /** Default in @unlighthouse/core; keep explicit for .gitignore alignment */
  outputPath: "unlighthouse",
  scanner: {
    /** Use Next.js App Router sitemap at /sitemap.xml */
    sitemap: true,
    robotsTxt: true,
    /** Marketing URLs are listed in sitemap; avoid crawling in-page links */
    crawler: false,
    samples: 1,
    exclude: [/^\/api\//],
  },
  /** Light load on production / Vercel when scanning live */
  puppeteerClusterOptions: {
    maxConcurrency: 2,
  },
});
