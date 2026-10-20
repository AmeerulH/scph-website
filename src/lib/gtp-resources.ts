import { libraryCopy, libraryImage, publishedId, sanityAssetUrl, type LibraryImage, type RawLibraryImage } from "./gtp-library";

export const RESOURCE_DEFAULTS = {
  title: "Resources",
  intro: "Toolkits, declarations and reports from the Global Tipping Points Conference 2026.",
  emptyTitle: "Resources are being prepared",
  emptyMessage: "Conference documents will be available here as they are published.",
  pendingLabel: "Coming soon",
};
export type ResourceSettings = typeof RESOURCE_DEFAULTS;
export type RawResourceSettings = Partial<Record<keyof ResourceSettings, string | null>>;
export type RawResource = {
  _id?: string | null; title?: string | null; description?: string | null; credit?: string | null;
  order?: number | null; cover?: RawLibraryImage | null;
  downloads?: ({ _key?: string | null; label?: string | null; url?: string | null;
    mimeType?: string | null; size?: number | null; filename?: string | null } | null)[] | null;
};
export type ResourceDownload = { id: string; label: string; href?: string; size?: string };
export type Resource = { id: string; title: string; description?: string; credit?: string; order: number;
  cover?: LibraryImage; downloads: ResourceDownload[] };
export type ResourcePageData = { settings: ResourceSettings; resources: Resource[]; unavailable: boolean };

export function resolveResourceSettings(raw?: RawResourceSettings | null): ResourceSettings {
  return Object.fromEntries(Object.entries(RESOURCE_DEFAULTS).map(([key, value]) =>
    [key, libraryCopy(raw?.[key as keyof ResourceSettings], value)])) as ResourceSettings;
}

export function resolveResource(raw: RawResource): Resource | undefined {
  const title = raw.title?.trim();
  if (!publishedId(raw._id) || !title) return;
  return {
    id: raw._id, title, description: raw.description?.trim() || undefined, credit: raw.credit?.trim() || undefined,
    order: Number.isFinite(raw.order) ? raw.order! : 1000, cover: libraryImage(raw.cover),
    downloads: (raw.downloads ?? []).flatMap((file, i) => {
      const label = file?.label?.trim();
      if (!file || !label) return [];
      const src = sanityAssetUrl(file.url, "files");
      const validPdf = src && file.mimeType === "application/pdf" && new URL(src).pathname.endsWith(".pdf");
      let href: string | undefined;
      if (validPdf) {
        const url = new URL(src);
        url.searchParams.set("dl", file.filename || "");
        href = url.href;
      }
      const bytes = file.size;
      return [{ id: file._key || `download-${i}`, label, href,
        size: href && bytes && bytes > 0 ? (bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`) : undefined }];
    }),
  };
}
