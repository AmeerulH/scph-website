import { defineQuery } from "next-sanity";
import { client } from "./client";
import { resolveResource, resolveResourceSettings, type RawResource, type RawResourceSettings, type Resource, type ResourcePageData } from "@/lib/gtp-resources";

const resourcesQuery = defineQuery(`{
  "settings": *[_id == "gtp2026ResourcesPage"][0]{title, intro, emptyTitle, emptyMessage, pendingLabel},
  "resources": *[_type == "gtp2026Resource" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
    _id, title, description, credit, order,
    "cover": {"url": cover.asset->url, "alt": cover.alt,
      "width": cover.asset->metadata.dimensions.width, "height": cover.asset->metadata.dimensions.height},
    downloads[]{_key, label, "url": file.asset->url, "mimeType": file.asset->mimeType,
      "size": file.asset->size, "filename": file.asset->originalFilename}
  }
}`);

export async function getGtpResourcesPage(): Promise<ResourcePageData> {
  try {
    const raw = await client.fetch<{ settings: RawResourceSettings | null; resources: RawResource[] }>(resourcesQuery, {}, { perspective: "published" });
    return { settings: resolveResourceSettings(raw.settings), resources: raw.resources.map(resolveResource)
      .filter((r): r is Resource => Boolean(r)).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)), unavailable: false };
  } catch {
    console.error("GTP resources could not be loaded.");
    return { settings: resolveResourceSettings(), resources: [], unavailable: true };
  }
}
