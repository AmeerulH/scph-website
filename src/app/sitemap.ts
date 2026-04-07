import type { MetadataRoute } from "next";
import { ALL_PUBLIC_INDEXABLE_PATHS } from "@/lib/public-indexable-paths";
import { getSiteUrlString } from "@/lib/site-url";

const PATHS: string[] = [...ALL_PUBLIC_INDEXABLE_PATHS];

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
