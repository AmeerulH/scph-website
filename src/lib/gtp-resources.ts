import { safeRegistrationUrl } from "./gtp-activity-registration";
import { libraryCopy, libraryImage, publishedId, sanityAssetUrl, type LibraryImage, type RawLibraryImage } from "./gtp-library";

export const FAITH_TOOLKIT_RESOURCE_ID = "gtp-resource-faith-based-toolkit";

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
  successStoryFormLabel?: string | null; successStoryFormUrl?: string | null;
  feedbackFormLabel?: string | null; feedbackFormUrl?: string | null;
};
export type ResourceDownload = { id: string; label: string; href?: string; size?: string };
export type ResourceForm = { id: string; label: string; href?: string };
export type Resource = { id: string; title: string; description?: string; credit?: string; order: number;
  cover?: LibraryImage; downloads: ResourceDownload[]; forms?: ResourceForm[] };
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
    forms: raw._id === FAITH_TOOLKIT_RESOURCE_ID ? [
      { id: "success-story", label: libraryCopy(raw.successStoryFormLabel, "Share a success story"), href: safeRegistrationUrl(raw.successStoryFormUrl ?? undefined) ?? undefined },
      { id: "feedback", label: libraryCopy(raw.feedbackFormLabel, "Share feedback"), href: safeRegistrationUrl(raw.feedbackFormUrl ?? undefined) ?? undefined },
    ] : undefined,
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
