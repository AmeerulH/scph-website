export const GTP_RESOURCES_PATH = "/events/gtp-2026/resources";
export const GTP_VIDEOS_PATH = "/events/gtp-2026/media/videos";

export type LibraryImage = { src: string; alt: string; width: number; height: number };
export type RawLibraryImage = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null };

export function publishedId(id?: string | null): id is string {
  return Boolean(id?.trim() && !id.startsWith("drafts.") && !id.startsWith("versions."));
}

export function sanityAssetUrl(value: string | null | undefined, kind: "images" | "files") {
  if (!value || /[\s\\\u0000-\u001f]/.test(value)) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname === "cdn.sanity.io" && !url.username && !url.password &&
      url.pathname.startsWith(`/${kind}/y0tkemxm/`)) return url.href;
  } catch { return; }
}

export function libraryImage(raw?: RawLibraryImage | null): LibraryImage | undefined {
  const src = sanityAssetUrl(raw?.url, "images");
  if (!src) return;
  return { src, alt: raw?.alt?.trim() || "", width: raw?.width && raw.width > 0 ? raw.width : 1200,
    height: raw?.height && raw.height > 0 ? raw.height : 1600 };
}

export function libraryCopy(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}
