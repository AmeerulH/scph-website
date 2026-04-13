/**
 * Allow only Google Maps embed iframes (paste src from Share → Embed a map).
 */
export function sanitizeGoogleMapsEmbedUrl(
  raw: string | null | undefined,
): string | null {
  const s = raw?.trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    if (u.protocol !== "https:") return null;
    const host = u.hostname.toLowerCase();
    if (host === "www.google.com" && u.pathname.startsWith("/maps/embed")) {
      return s;
    }
    if (host === "google.com" && u.pathname.startsWith("/maps/embed")) {
      return s;
    }
    if (host === "maps.google.com") {
      return s;
    }
    return null;
  } catch {
    return null;
  }
}
