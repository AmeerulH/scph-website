/**
 * Code defaults for /events/gtp-2026/media. Studio fields win per field when populated;
 * these only fill gaps (copy from the GTP2026 Media Page brief + placeholder imagery).
 */

export type GtpMediaImage = { src: string; alt: string; caption?: string };

export type GtpMediaDriveLink = { label: string; url: string };

export type GtpMediaPhotoAlbum = {
  id: string;
  title: string;
  dateLabel?: string;
  photos: GtpMediaImage[];
  driveLinks: GtpMediaDriveLink[];
  /** True when the photos are GTP 2025 stand-ins, not uploaded 2026 photos. */
  isPlaceholder: boolean;
};

export type GtpMediaPodcastEpisode = {
  id: string;
  title: string;
  topic?: string;
  publishedAt?: string;
  duration?: string;
  thumbnail?: GtpMediaImage;
  spotifyUrl?: string;
  youtubeUrl?: string;
  appleUrl?: string;
};

export type GtpMediaVideo = {
  id: string;
  title: string;
  topic?: string;
  description?: string;
  duration?: string;
  youtubeId: string;
  thumbnail?: GtpMediaImage;
};

export type GtpMediaPageResolved = {
  hero: { title: string; lede: string; image: GtpMediaImage };
  photos: { title: string; intro: string[]; albums: GtpMediaPhotoAlbum[] };
  podcasts: {
    title: string;
    intro: string[];
    cover: GtpMediaImage;
    coverIsPlaceholder: boolean;
    platforms: { spotifyUrl?: string; youtubeUrl?: string; appleUrl?: string };
    episodes: GtpMediaPodcastEpisode[];
  };
  videos: {
    title: string;
    intro: string[];
    channelUrl?: string;
    items: GtpMediaVideo[];
  };
};

const P25 = "/images/gtp/gtp-2025";
const PLACEHOLDER_ALT = "Preview photo from GTP 2025";

function ph(files: string[]): GtpMediaImage[] {
  return files.map((f) => ({ src: `${P25}/${f}`, alt: PLACEHOLDER_ALT }));
}

export const GTP_MEDIA_HERO_FALLBACK: GtpMediaImage = {
  src: `${P25}/main-photo.avif`,
  alt: "Delegates gathered at the Global Tipping Points Conference",
};

export const GTP_MEDIA_PODCAST_COVER_FALLBACK: GtpMediaImage = {
  src: "/images/gtp/media/podcast-cover-placeholder.svg",
  alt: "Global Tipping Points podcast cover art",
};

const driveLinkPlaceholder = (): GtpMediaDriveLink[] => [];

/** Six albums from the brief. Each has its own stand-in photo set until uploads arrive. */
export const GTP_MEDIA_DEFAULT_ALBUMS: GtpMediaPhotoAlbum[] = [
  {
    id: "day-1",
    title: "Day 1",
    dateLabel: "12 October 2026",
    photos: ph(["main-photo.avif", "conf-4.avif", "conf-5.avif", "conf-6.avif", "conf-7.avif", "conf-8.avif", "networking.avif", "conf-9.avif", "conf-10.avif"]),
    driveLinks: driveLinkPlaceholder(),
    isPlaceholder: true,
  },
  {
    id: "day-2",
    title: "Day 2",
    dateLabel: "13 October 2026",
    photos: ph(["conf-12.avif", "preview-004.avif", "conf-14.avif", "preview-092.avif", "conf-16.avif", "preview-106.avif", "conf-19.avif", "preview-117.avif", "conf-8.avif"]),
    driveLinks: driveLinkPlaceholder(),
    isPlaceholder: true,
  },
  {
    id: "day-3",
    title: "Day 3",
    dateLabel: "14 October 2026",
    photos: ph(["conf-6.avif", "conf-9.avif", "networking.avif", "conf-12.avif", "conf-10.avif", "preview-092.avif", "conf-14.avif", "conf-5.avif", "preview-004.avif"]),
    driveLinks: driveLinkPlaceholder(),
    isPlaceholder: true,
  },
  {
    id: "day-4",
    title: "Day 4",
    dateLabel: "15 October 2026",
    photos: ph(["conf-16.avif", "conf-19.avif", "preview-117.avif", "conf-7.avif", "conf-4.avif", "preview-106.avif", "main-photo.avif", "conf-8.avif", "conf-12.avif"]),
    driveLinks: driveLinkPlaceholder(),
    isPlaceholder: true,
  },
  {
    id: "special-events",
    title: "Special Events",
    photos: ph(["games-on-lawn.avif", "networking.avif", "conf-10.avif", "conf-9.avif", "preview-092.avif", "conf-14.avif", "conf-19.avif", "preview-004.avif", "conf-5.avif"]),
    driveLinks: driveLinkPlaceholder(),
    isPlaceholder: true,
  },
  {
    id: "action-workshops",
    title: "Action Workshops",
    dateLabel: "13 to 14 October 2026",
    photos: ph(["workshop.avif", "conf-6.avif", "conf-12.avif", "preview-106.avif", "conf-16.avif", "submission-1.avif", "conf-7.avif", "preview-117.avif", "conf-4.avif"]),
    driveLinks: driveLinkPlaceholder(),
    isPlaceholder: true,
  },
];

export const GTP_MEDIA_DEFAULTS: GtpMediaPageResolved = {
  hero: {
    title: "Media",
    lede: "Photos, podcasts and films from the Global Tipping Points Conference 2026.",
    image: GTP_MEDIA_HERO_FALLBACK,
  },
  photos: {
    title: "Photo Gallery",
    intro: [
      "Explore moments from the Global Tipping Points Conference 2026, from thought-provoking discussions and inspiring exchanges to the people, ideas, and experiences shaping the journey towards positive tipping points.",
      "Browse highlights from across the conference and discover the conversations, connections, and collective action that brought the global tipping points community together in Malaysia.",
    ],
    albums: GTP_MEDIA_DEFAULT_ALBUMS,
  },
  podcasts: {
    title: "Podcasts",
    intro: [
      "Tune in to conversations exploring science, ideas, and real-world action behind positive tipping points. Hear from leading voices across research, policy, communities, and practice as they share perspectives on how we can accelerate transformative change for a healthier and more sustainable future.",
    ],
    cover: GTP_MEDIA_PODCAST_COVER_FALLBACK,
    coverIsPlaceholder: true,
    platforms: {},
    episodes: [],
  },
  videos: {
    title: "Videos",
    intro: [
      "Watch highlights, conversations, and stories from the Global Tipping Points Conference 2026. From key sessions and expert insights to behind-the-scenes moments, explore the ideas and experiences that brought the global tipping points community together in Malaysia.",
    ],
    channelUrl: "https://www.youtube.com/@sunwaycentreforplanetaryhe8898",
    items: [],
  },
};
