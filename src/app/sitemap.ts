import type { MetadataRoute } from "next";
import { getSiteUrlString } from "@/lib/site-url";

/** Public indexable paths (SCPH site + GTP 2026). */
const PATHS: string[] = [
  "/",
  "/about-us",
  "/programmes",
  "/research",
  "/events",
  "/media",
  "/network",
  "/projects",
  "/events/gtp-2026/about",
  "/events/gtp-2026/programmes",
  "/events/gtp-2026/register",
  "/events/gtp-2026/submissions",
  "/events/gtp-2026/faq",
  "/events/gtp-2026/get-involved",
  "/events/gtp-2026/media",
  "/events/gtp-2026/biz-forum",
  "/events/gtp-2026/organising-committee",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrlString();
  const lastModified = new Date();

  return PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/events/gtp-2026") ? 0.9 : 0.8,
  }));
}
