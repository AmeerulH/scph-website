import type { Metadata } from "next";
import { MediaHero } from "@/components/gtp/media/media-hero";
import { MediaSectionNav } from "@/components/gtp/media/media-section-nav";
import { PhotoAlbums } from "@/components/gtp/media/photo-albums";
import { PodcastSection } from "@/components/gtp/media/podcast-section";
import { VideoSection } from "@/components/gtp/media/video-section";
import { getGtpMediaPage } from "@/sanity/gtp-media-page";

const description =
  "Photos, podcasts and videos from the Global Tipping Points Conference 2026, hosted by Sunway Centre for Planetary Health in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Media",
  description,
  alternates: { canonical: "/events/gtp-2026/media" },
  openGraph: {
    title: "Media | GTP 2026",
    description,
    url: "/events/gtp-2026/media",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 media",
    description,
  },
};

export const dynamic = "force-dynamic";

export default async function GtpMediaPage() {
  const media = await getGtpMediaPage();

  return (
    <div className="bg-gtp-dark-teal-dark">
      <MediaHero
        hero={media.hero}
        counts={{
          albums: media.photos.albums.length,
          episodes: media.podcasts.episodes.length,
          videos: media.videos.items.length,
        }}
      />
      <MediaSectionNav />
      <PhotoAlbums
        title={media.photos.title}
        intro={media.photos.intro}
        albums={media.photos.albums}
      />
      <PodcastSection podcasts={media.podcasts} />
      <VideoSection videos={media.videos} />
    </div>
  );
}
