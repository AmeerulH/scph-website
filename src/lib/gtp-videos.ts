import { GTP_VIDEOS_PATH, libraryImage, publishedId, type LibraryImage, type RawLibraryImage } from "./gtp-library";
import { parseYouTubeId } from "./youtube";

export const VIDEO_PAGE_SIZE = 12;
export const VIDEO_COLLECTIONS = [
  { id: "dailyHighlights", anchor: "daily-highlights", title: "Daily Highlights" },
  { id: "sessionRecordings", anchor: "session-recordings", title: "Session Recordings" },
  { id: "playlist", anchor: "gtp2026-playlist", title: "GTP2026 Playlist" },
] as const;
export const VIDEO_DEFAULTS = {
  title: "Videos",
  intro: "Highlights, recorded sessions and films from the Global Tipping Points Conference 2026.",
  dailyHighlightsTitle: "Daily Highlights", dailyHighlightsIntro: "Four days of ideas, people and moments. Watch each day's highlights as they become available.",
  sessionRecordingsTitle: "Session Recordings", sessionRecordingsIntro: "Find a conversation by conference day, session title or speaker.",
  playlistTitle: "GTP2026 Playlist", playlistIntro: "Films, messages and music shared throughout the conference.",
  emptyMessage: "Videos will appear here as they are published.", pendingLabel: "Coming soon",
};
export type VideoSettings = typeof VIDEO_DEFAULTS & { channelUrl?: string };
export type VideoCollection = typeof VIDEO_COLLECTIONS[number]["id"];
export type ConferenceDay = "1" | "2" | "3" | "4";
export type RawVideo = {
  _id?: string | null; title?: string | null; collection?: string | null; day?: string | null;
  youtubeUrl?: string | null; topic?: string | null; description?: string | null;
  duration?: string | null; credit?: string | null; speakers?: string[] | null; order?: number | null;
  thumbnail?: RawLibraryImage | null;
};
export type LibraryVideo = { id: string; title: string; collection: VideoCollection; day?: ConferenceDay;
  youtubeId?: string; topic?: string; description?: string; duration?: string; credit?: string;
  speakers: string[]; order: number; thumbnail?: LibraryImage };
export type VideoSearchParams = Record<string, string | string[] | undefined>;
export type VideoParams = { q: string; day: ConferenceDay | "all"; page: number };
export type VideoPageData = { settings: VideoSettings; highlights: LibraryVideo[]; recordings: LibraryVideo[];
  playlist: LibraryVideo[]; total: number; pages: number; params: VideoParams; unavailable: boolean };

export function conferenceDay(value?: string | null): ConferenceDay | undefined {
  return ["1", "2", "3", "4"].includes(value ?? "") ? value as ConferenceDay : undefined;
}

export function resolveVideo(raw: RawVideo): LibraryVideo | undefined {
  const title = raw.title?.trim();
  const collection = VIDEO_COLLECTIONS.find(c => c.id === raw.collection)?.id;
  const day = conferenceDay(raw.day);
  const youtubeId = parseYouTubeId(raw.youtubeUrl) || undefined;
  if (!publishedId(raw._id) || !title || !collection ||
    (collection !== "playlist" && !day) || (collection !== "dailyHighlights" && !youtubeId)) return;
  // A malformed URL is never presented as a playable highlight.
  return { id: raw._id, title, collection, day, youtubeId, topic: raw.topic?.trim() || undefined,
    description: raw.description?.trim() || undefined, duration: raw.duration?.trim() || undefined,
    credit: raw.credit?.trim() || undefined, speakers: (raw.speakers ?? []).filter(s => typeof s === "string").map(s => s.trim()).filter(Boolean),
    order: Number.isFinite(raw.order) ? raw.order! : 1000, thumbnail: libraryImage(raw.thumbnail) };
}

export function videoOrder(a: LibraryVideo, b: LibraryVideo) {
  return (Number(a.day || 5) - Number(b.day || 5)) || a.order - b.order || a.id.localeCompare(b.id);
}

export function resolveVideoIndex(enabled: boolean, documents: RawVideo[], legacy: (Omit<RawVideo, "_id"> & { _key?: string | null })[] = []) {
  const source: RawVideo[] = enabled ? documents : legacy.map((v, i) => ({
    ...v, _id: `legacy-${v._key || i}`, collection: "playlist", order: i,
  }));
  return source.map(resolveVideo).filter((v): v is LibraryVideo => Boolean(v));
}

export function parseVideoParams(search: VideoSearchParams): VideoParams {
  const first = (key: string) => Array.isArray(search[key]) ? search[key][0] : search[key];
  const page = Number(first("page"));
  return { q: (first("q") ?? "").trim().slice(0, 120), day: conferenceDay(first("day")) ?? "all",
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 100000) : 1 };
}

export function selectVideoPage(index: LibraryVideo[], search: VideoSearchParams = {}) {
  const params = parseVideoParams(search);
  const words = params.q.toLocaleLowerCase("en").split(/\s+/).filter(Boolean);
  const matching = index.filter(v => v.collection === "sessionRecordings" &&
    (params.day === "all" || v.day === params.day) && words.every(w =>
      `${v.title} ${v.speakers.join(" ")} ${v.description ?? ""}`.toLocaleLowerCase("en").includes(w))).sort(videoOrder);
  const pages = Math.max(1, Math.ceil(matching.length / VIDEO_PAGE_SIZE));
  const page = Math.min(params.page, pages);
  const highlights = (["1", "2", "3", "4"] as const).map(day =>
    index.filter(v => v.collection === "dailyHighlights" && v.day === day).sort(videoOrder)[0] ?? {
      id: `pending-day-${day}`, title: `Day ${day} highlights`, collection: "dailyHighlights" as const, day, speakers: [], order: Number(day),
    });
  return { highlights, recordings: matching.slice((page - 1) * VIDEO_PAGE_SIZE, page * VIDEO_PAGE_SIZE),
    playlist: index.filter(v => v.collection === "playlist").sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)),
    total: matching.length, pages, params: { ...params, page } };
}

export function videoHref(params: VideoParams, basePath = GTP_VIDEOS_PATH, retained: Record<string, string> = {}) {
  const query = new URLSearchParams(retained);
  if (params.q) query.set("q", params.q);
  if (params.day !== "all") query.set("day", params.day);
  if (params.page > 1) query.set("page", String(params.page));
  return `${basePath}${query.size ? `?${query}` : ""}#session-recordings`;
}
