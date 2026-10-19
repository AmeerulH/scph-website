import { RESOURCE_DEFAULTS, type ResourcePageData } from "./gtp-resources";
import { VIDEO_DEFAULTS, selectVideoPage, type LibraryVideo, type VideoPageData, type VideoSearchParams } from "./gtp-videos";

/** Synthetic fixtures are imported only by the gated local/Vercel Preview review route. */
export function resourceReviewData(variant: string): ResourcePageData {
  const resources = [
    { id: "sample-toolkit", title: "Sample Faith Based Toolkit", order: 0, description: "Sample content for layout review. The final booklet, toolkit and descriptions will be supplied by the conference team.",
      downloads: [{ id: "summary", label: "Summary booklet", ...(variant === "partial" ? {href: "https://cdn.sanity.io/files/y0tkemxm/development/sample-booklet.pdf?dl=sample-booklet.pdf", size: "2.4 MB"} : {}) }, { id: "full", label: "Full toolkit" }] },
    { id: "sample-declaration", title: "Sample KL Tipping Points Declaration", order: 10, downloads: [{ id: "declaration", label: "Declaration" }] },
    { id: "sample-report", title: "Sample Outcome Report for Potsdam Handover", order: 20, downloads: [{ id: "report", label: "Outcome report" }] },
  ];
  if (variant === "long") resources[0].title = "Sample resource: " + "Collective action across communities and planetary health. ".repeat(8);
  return { settings: RESOURCE_DEFAULTS, resources: variant === "empty" || variant === "error" ? [] : resources, unavailable: variant === "error" };
}

export function videoReviewData(search: VideoSearchParams, variant: string): VideoPageData {
  const image = {src: "/images/gtp/gtp-2025/main-photo.avif", alt: "Sample thumbnail from GTP 2025", width: 1600, height: 900};
  const video = (i: number): LibraryVideo => ({id: `sample-${i}`, title: `Sample session ${i + 1}: ${i % 2 ? "Science and collective action" : "Positive tipping points"}`,
    collection: "sessionRecordings", day: String(i % 4 + 1) as LibraryVideo["day"], youtubeId: "IR0MfiOyHtk", order: i,
    speakers: [`Sample speaker ${i + 1}`], duration: "42 min", description: "Synthetic layout fixture. Session facts and durations are illustrative; the thumbnail is from GTP 2025.", thumbnail: image});
  const index: LibraryVideo[] = variant === "empty" || variant === "error" ? [] : [
    ...Array.from({length: variant === "many" ? 200 : 28}, (_, i) => video(i)),
    {...video(1001), title: "Sample Day 1 highlights", collection: "dailyHighlights", day: "1"},
    {...video(1002), title: "Sample recorded message", collection: "playlist", day: undefined, credit: "Sample contributor credit"},
  ];
  if (variant === "long" && index[0]) index[0].title = "Sample session: " + "A long conversation about planetary health across cultures. ".repeat(7);
  return {...selectVideoPage(index, search), settings: VIDEO_DEFAULTS, unavailable: variant === "error"};
}
