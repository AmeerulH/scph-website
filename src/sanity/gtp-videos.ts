import { cache } from "react";
import { defineQuery } from "next-sanity";
import { client } from "./client";
import { VIDEO_DEFAULTS, resolveVideo, resolveVideoIndex, selectVideoPage, type RawVideo, type LibraryVideo, type VideoSettings, type VideoPageData, type VideoSearchParams } from "@/lib/gtp-videos";
import { libraryCopy } from "@/lib/gtp-library";

type Settings = Partial<Record<keyof typeof VIDEO_DEFAULTS, string | null>> & {
  videosTitle?: string | null; videosIntro?: string | null; youtubeChannelUrl?: string | null; useVideoLibrary?: boolean;
  videos?: (Omit<RawVideo, "_id"> & { _key?: string | null })[] | null;
};
const imageFields = `"thumbnail": {"url": thumbnail.asset->url, "alt": thumbnail.alt,
  "width": thumbnail.asset->metadata.dimensions.width, "height": thumbnail.asset->metadata.dimensions.height}`;
const videoIndexQuery = defineQuery(`{
  "settings": *[_id == "gtp2026MediaPage"][0]{
    videosTitle, videosIntro, youtubeChannelUrl, useVideoLibrary,
    dailyHighlightsTitle, dailyHighlightsIntro, sessionRecordingsTitle, sessionRecordingsIntro,
    playlistTitle, playlistIntro, "emptyMessage": videosEmptyMessage, "pendingLabel": videosPendingLabel,
    videos[]{_key, title, topic, youtubeUrl, description, duration, ${imageFields}}
  },
  "videos": *[_type == "gtp2026Video" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
    _id, title, collection, day, youtubeUrl, description, duration, credit, speakers, order, topic
  }
}`);

const getVideoIndex = cache(async () => {
  const raw = await client.fetch<{settings: Settings | null; videos: RawVideo[]}>(videoIndexQuery, {}, { perspective: "published" });
  const s = raw.settings;
  const settings = Object.fromEntries(Object.entries(VIDEO_DEFAULTS).map(([key, value]) =>
    [key, libraryCopy(s?.[key as keyof typeof VIDEO_DEFAULTS], value)])) as VideoSettings;
  settings.title = libraryCopy(s?.videosTitle, VIDEO_DEFAULTS.title);
  settings.intro = libraryCopy(s?.videosIntro, VIDEO_DEFAULTS.intro);
  try {
    if (s?.youtubeChannelUrl && new URL(s.youtubeChannelUrl).protocol === "https:") settings.channelUrl = s.youtubeChannelUrl;
  } catch { /* An invalid channel link is omitted. */ }
  const index = resolveVideoIndex(s?.useVideoLibrary === true, raw.videos, s?.videos ?? []);
  return { settings, index, useVideoLibrary: s?.useVideoLibrary === true };
});

async function hydrateVideos(items: LibraryVideo[], library: boolean) {
  if (!library || !items.length) return items;
  const images = await client.fetch<RawVideo[]>(`*[_type == "gtp2026Video" && _id in $ids]{_id, ${imageFields}}`,
    { ids: items.map(v => v.id) }, { perspective: "published" });
  const byId = new Map(images.map(v => [v._id, v.thumbnail]));
  // Only displayed videos receive image hydration; the metadata index stays on the server.
  return items.flatMap(v => byId.has(v.id) ? [{ ...v, thumbnail: resolveVideo({
    _id: v.id, title: v.title, collection: v.collection, day: v.day,
    youtubeUrl: v.youtubeId, thumbnail: byId.get(v.id),
  })?.thumbnail }] : []);
}

export async function getGtpVideoPage(search: VideoSearchParams = {}): Promise<VideoPageData> {
  try {
    const { settings, index, useVideoLibrary } = await getVideoIndex();
    const selected = selectVideoPage(index, search);
    const realHighlights = selected.highlights.filter(v => !v.id.startsWith("pending-day-"));
    const hydrated = await hydrateVideos([...realHighlights, ...selected.recordings, ...selected.playlist], useVideoLibrary);
    const byId = new Map(hydrated.map(v => [v.id, v]));
    return { ...selected, settings, highlights: selected.highlights.map(v => byId.get(v.id) ?? { ...v, youtubeId: undefined }),
      recordings: selected.recordings.flatMap(v => byId.get(v.id) ?? []), playlist: selected.playlist.flatMap(v => byId.get(v.id) ?? []), unavailable: false };
  } catch {
    console.error("GTP videos could not be loaded.");
    return { ...selectVideoPage([], search), settings: { ...VIDEO_DEFAULTS }, unavailable: true };
  }
}

export async function getGtpVideoPreview() {
  try {
    const { index, useVideoLibrary } = await getVideoIndex();
    const available = index.filter(v => v.youtubeId);
    return { items: await hydrateVideos(available.slice().sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)).slice(0, 3), useVideoLibrary), total: available.length, unavailable: false };
  } catch {
    return { items: [], total: 0, unavailable: true };
  }
}
