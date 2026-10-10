import { client } from "./client";
import {
  GTP_MEDIA_DEFAULTS,
  type GtpMediaImage,
  type GtpMediaPageResolved,
  type GtpMediaPhotoAlbum,
  type GtpMediaPodcastEpisode,
  type GtpMediaVideo,
} from "@/data/gtp-media-page-defaults";
import { parseYouTubeId } from "@/lib/youtube";

type Str = string | null | undefined;

type RawImage = { src?: Str; alt?: Str; caption?: Str };

type RawMedia = {
  pageTitle?: Str;
  heroLede?: Str;
  heroImageUrl?: Str;
  heroImageAlt?: Str;
  photosTitle?: Str;
  photosIntro?: Str;
  photoAlbums?: {
    _key?: Str;
    title?: Str;
    dateLabel?: Str;
    photos?: (RawImage | null)[] | null;
    driveLinks?: ({ label?: Str; url?: Str } | null)[] | null;
  }[] | null;
  podcastsTitle?: Str;
  podcastsIntro?: Str;
  podcastCoverUrl?: Str;
  podcastCoverAlt?: Str;
  spotifyUrl?: Str;
  podcastYoutubeUrl?: Str;
  appleUrl?: Str;
  podcastEpisodes?: {
    _key?: Str;
    title?: Str;
    topic?: Str;
    publishedAt?: Str;
    duration?: Str;
    thumbnailUrl?: Str;
    thumbnailAlt?: Str;
    spotifyUrl?: Str;
    youtubeUrl?: Str;
    appleUrl?: Str;
  }[] | null;
  videosTitle?: Str;
  videosIntro?: Str;
  youtubeChannelUrl?: Str;
  videos?: {
    _key?: Str;
    title?: Str;
    topic?: Str;
    youtubeUrl?: Str;
    description?: Str;
    duration?: Str;
    thumbnailUrl?: Str;
    thumbnailAlt?: Str;
  }[] | null;
};

const mediaPageQuery = `*[_type == "gtp2026MediaPage"][0]{
  pageTitle, heroLede,
  "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt,
  photosTitle, photosIntro,
  photoAlbums[]{
    _key, title, dateLabel,
    photos[]{ "src": asset->url, alt, caption },
    driveLinks[]{ label, url }
  },
  podcastsTitle, podcastsIntro,
  "podcastCoverUrl": podcastCover.asset->url, "podcastCoverAlt": podcastCover.alt,
  spotifyUrl, podcastYoutubeUrl, appleUrl,
  podcastEpisodes[]{
    _key, title, topic, publishedAt, duration,
    "thumbnailUrl": thumbnail.asset->url, "thumbnailAlt": thumbnail.alt,
    spotifyUrl, youtubeUrl, appleUrl
  },
  videosTitle, videosIntro, youtubeChannelUrl,
  videos[]{
    _key, title, topic, youtubeUrl, description, duration,
    "thumbnailUrl": thumbnail.asset->url, "thumbnailAlt": thumbnail.alt
  }
}`;

export const s = (v: Str, fallback: string) => v?.trim() || fallback;
export const opt = (v: Str) => v?.trim() || undefined;
export const paragraphs = (v: Str, fallback: string[]) => {
  const parts = v?.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return parts?.length ? parts : fallback;
};
export const httpsUrl = (v: Str) => {
  const t = v?.trim();
  return t && /^https:\/\//i.test(t) ? t : undefined;
};

function mergeAlbums(raw: RawMedia["photoAlbums"]): GtpMediaPhotoAlbum[] {
  const defaults = GTP_MEDIA_DEFAULTS.photos.albums;
  if (!raw?.length) return defaults;
  return raw
    .filter((a) => a?.title?.trim())
    .map((a, i) => {
      const photos: GtpMediaImage[] = (a.photos ?? [])
        .filter((p): p is RawImage => Boolean(p?.src))
        .map((p) => ({
          src: p.src as string,
          alt: s(p.alt, `${a.title} photo`),
          caption: opt(p.caption),
        }));
      const fallback = defaults[i] ?? defaults[0];
      return {
        id: a._key || `album-${i}`,
        title: a.title!.trim(),
        dateLabel: opt(a.dateLabel) ?? defaults.find((d) => d.title === a.title?.trim())?.dateLabel,
        photos: photos.length ? photos : fallback.photos,
        driveLinks: (a.driveLinks ?? [])
          .map((l) => ({ label: s(l?.label, "For more photos: click here"), url: httpsUrl(l?.url) }))
          .filter((l): l is { label: string; url: string } => Boolean(l.url)),
        isPlaceholder: photos.length === 0,
      };
    });
}

function mergeEpisodes(raw: RawMedia["podcastEpisodes"]): GtpMediaPodcastEpisode[] {
  return (raw ?? [])
    .filter((e) => e?.title?.trim())
    .map((e, i) => ({
      id: e._key || `episode-${i}`,
      title: e.title!.trim(),
      topic: opt(e.topic),
      publishedAt: opt(e.publishedAt),
      duration: opt(e.duration),
      thumbnail: e.thumbnailUrl
        ? { src: e.thumbnailUrl, alt: s(e.thumbnailAlt, e.title!.trim()) }
        : undefined,
      spotifyUrl: httpsUrl(e.spotifyUrl),
      youtubeUrl: httpsUrl(e.youtubeUrl),
      appleUrl: httpsUrl(e.appleUrl),
    }));
}

function mergeVideos(raw: RawMedia["videos"]): GtpMediaVideo[] {
  const out: GtpMediaVideo[] = [];
  (raw ?? []).forEach((v, i) => {
    const youtubeId = parseYouTubeId(v?.youtubeUrl);
    if (!v?.title?.trim() || !youtubeId) return;
    out.push({
      id: v._key || `video-${i}`,
      title: v.title.trim(),
      topic: opt(v.topic),
      description: opt(v.description),
      duration: opt(v.duration),
      youtubeId,
      thumbnail: v.thumbnailUrl
        ? { src: v.thumbnailUrl, alt: s(v.thumbnailAlt, v.title.trim()) }
        : undefined,
    });
  });
  return out;
}

export function mergeGtpMediaPage(raw: RawMedia | null): GtpMediaPageResolved {
  const d = GTP_MEDIA_DEFAULTS;
  if (!raw) return d;
  return {
    hero: {
      title: s(raw.pageTitle, d.hero.title),
      lede: s(raw.heroLede, d.hero.lede),
      image: raw.heroImageUrl
        ? { src: raw.heroImageUrl, alt: s(raw.heroImageAlt, d.hero.image.alt) }
        : d.hero.image,
    },
    photos: {
      title: s(raw.photosTitle, d.photos.title),
      intro: paragraphs(raw.photosIntro, d.photos.intro),
      albums: mergeAlbums(raw.photoAlbums),
    },
    podcasts: {
      title: s(raw.podcastsTitle, d.podcasts.title),
      intro: paragraphs(raw.podcastsIntro, d.podcasts.intro),
      cover: raw.podcastCoverUrl
        ? { src: raw.podcastCoverUrl, alt: s(raw.podcastCoverAlt, d.podcasts.cover.alt) }
        : d.podcasts.cover,
      coverIsPlaceholder: !raw.podcastCoverUrl,
      platforms: {
        spotifyUrl: httpsUrl(raw.spotifyUrl),
        youtubeUrl: httpsUrl(raw.podcastYoutubeUrl),
        appleUrl: httpsUrl(raw.appleUrl),
      },
      episodes: mergeEpisodes(raw.podcastEpisodes),
    },
    videos: {
      title: s(raw.videosTitle, d.videos.title),
      intro: paragraphs(raw.videosIntro, d.videos.intro),
      channelUrl: httpsUrl(raw.youtubeChannelUrl) ?? d.videos.channelUrl,
      items: mergeVideos(raw.videos),
    },
  };
}

export async function getGtpMediaPage(): Promise<GtpMediaPageResolved> {
  const raw = await client.fetch<RawMedia | null>(mediaPageQuery).catch(() => null);
  return mergeGtpMediaPage(raw);
}
