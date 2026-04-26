/**
 * Paths included in the public sitemap (SCPH marketing + GTP 2026).
 * Used by `src/app/sitemap.ts` and Sanity webhook revalidation for layout-level singletons.
 */
export const SCPH_MARKETING_PATHS: readonly string[] = [
  "/",
  "/about-us",
  "/programmes",
  "/research",
  "/events",
  "/media",
  "/network",
  "/network/community-hub",
  "/network/journalist-workshops",
  "/projects",
];

export const GTP_2026_MARKETING_PATHS: readonly string[] = [
  "/events/gtp-2026/about",
  "/events/gtp-2026/programmes",
  "/events/gtp-2026/submissions",
  "/events/gtp-2026/faq",
  "/events/gtp-2026/get-involved",
  "/events/gtp-2026/media",
  "/events/gtp-2026/biz-forum",
  "/events/gtp-2026/organising-committee",
];

export const ALL_PUBLIC_INDEXABLE_PATHS: readonly string[] = [
  ...SCPH_MARKETING_PATHS,
  ...GTP_2026_MARKETING_PATHS,
];
