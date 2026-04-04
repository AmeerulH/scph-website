/**
 * Canonical site origin for metadata, sitemap, and robots.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://www.sunwayplanetaryhealth.com.my).
 * Falls back to `VERCEL_URL` on Vercel preview/production if unset, then localhost for local dev.
 */
export function getSiteUrlString(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/\/$/, "");
    return host.startsWith("http") ? host : `https://${host}`;
  }
  return "http://localhost:3000";
}

export function getSiteUrl(): URL {
  return new URL(getSiteUrlString());
}
