import { createHash } from "node:crypto";
import { parseYouTubeId } from "../../src/lib/youtube";

export type MigrationDocument = { _id: string; _type: string; _rev?: string; useVideoLibrary?: boolean;
  videos?: ({ _key?: string; title?: string; youtubeUrl?: string; [key: string]: unknown })[]; [key: string]: unknown };

export function migrationVideoDocuments(source: MigrationDocument): MigrationDocument[] {
  const keys = new Set<string>();
  return (source.videos ?? []).map((video, order) => {
    if (!video._key || keys.has(video._key) || !video.title?.trim() || !parseYouTubeId(video.youtubeUrl)) {
      throw new Error("Every original video needs a unique key, title and valid YouTube link. Fix the source before migrating.");
    }
    keys.add(video._key);
    const { _key, ...content } = video;
    delete content._type;
    return { ...content, _id: `gtp-video-legacy-${createHash("sha256").update(_key).digest("hex").slice(0, 24)}`,
      _type: "gtp2026Video", collection: "playlist", order, legacyKey: _key };
  });
}

export function canonicalContent(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalContent).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).filter(([key]) => !["_rev", "_createdAt", "_updatedAt"].includes(key))
    .sort(([a], [b]) => a.localeCompare(b)).map(([key, val]) => `${JSON.stringify(key)}:${canonicalContent(val)}`).join(",")}}`;
  return JSON.stringify(value);
}

export function assertMigrationParity(expected: MigrationDocument[], existing: MigrationDocument[]) {
  for (const target of expected) {
    if (existing.some(d => d._id === `drafts.${target._id}`)) throw new Error(`Target ${target._id} has a draft. Resolve it before cutover.`);
    const found = existing.find(d => d._id === target._id);
    if (found && canonicalContent(found) !== canonicalContent(target)) throw new Error(`Target ${target._id} differs from the reviewed source. No content will be overwritten.`);
  }
}
