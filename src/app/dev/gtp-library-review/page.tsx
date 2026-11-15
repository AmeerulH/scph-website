import { notFound } from "next/navigation";
import { GtpNavbar } from "@/components/gtp/navbar";
import { ResourcesPage } from "@/components/gtp/library/resources-page";
import { VideosPage } from "@/components/gtp/library/videos-page";
import { resourceReviewData, videoReviewData } from "@/lib/gtp-library-review";
import type { VideoSearchParams } from "@/lib/gtp-videos";
import { canReviewGtpLibrary } from "@/lib/gtp-library-review-access";

export const dynamic = "force-dynamic";
export const metadata = {robots: {index: false, follow: false}};

export default async function GtpLibraryReview({searchParams}: {searchParams: Promise<VideoSearchParams>}) {
  if (!canReviewGtpLibrary()) notFound();
  const search = await searchParams;
  const value = (key: string) => typeof search[key] === "string" ? search[key] as string : "";
  return <><GtpNavbar /><div className="fixed bottom-3 left-3 z-60 rounded bg-white px-3 py-2 text-xs text-gtp-dark-teal-dark shadow-lg">Sample content · review only</div>
    {value("view") === "resources" ? <ResourcesPage data={resourceReviewData(value("case"))} /> :
      <VideosPage data={videoReviewData(search, value("case"))} action="/dev/gtp-library-review" retained={value("case") ? {case: value("case")} : {}} />}</>;
}
