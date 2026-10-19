import type { Metadata } from "next";
import { VideosPage } from "@/components/gtp/library/videos-page";
import { getGtpVideoPage } from "@/sanity/gtp-videos";
import { GTP_VIDEOS_PATH } from "@/lib/gtp-library";
import type { VideoSearchParams } from "@/lib/gtp-videos";

export const metadata: Metadata = { title: "Videos", description: "Watch daily highlights, recorded sessions and the GTP2026 Playlist.",
  alternates: {canonical: GTP_VIDEOS_PATH}, openGraph: {title: "Videos | GTP 2026", url: GTP_VIDEOS_PATH} };
export const dynamic = "force-dynamic";

export default async function GtpVideosPage({ searchParams }: {searchParams: Promise<VideoSearchParams>}) {
  return <VideosPage data={await getGtpVideoPage(await searchParams)} />;
}
