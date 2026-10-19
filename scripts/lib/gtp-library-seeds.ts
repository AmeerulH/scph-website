import { RESOURCE_DEFAULTS } from "../../src/lib/gtp-resources";
import { VIDEO_DEFAULTS } from "../../src/lib/gtp-videos";

export const resourceSeedDocuments = [
  { _id: "gtp2026ResourcesPage", _type: "gtp2026ResourcesPage", ...RESOURCE_DEFAULTS },
  ...[
    { id: "faith-based-toolkit", title: "Faith Based Toolkit", labels: ["Summary booklet", "Full toolkit"] },
    { id: "kl-tipping-points-declaration", title: "KL Tipping Points Declaration", labels: ["Declaration"] },
    { id: "potsdam-handover-outcome-report", title: "Outcome Report for Potsdam Handover", labels: ["Outcome report"] },
  ].map((r, i) => ({ _id: `gtp-resource-${r.id}`, _type: "gtp2026Resource", title: r.title, order: i * 10,
    downloads: r.labels.map((label, n) => ({ _type: "gtpResourceDownload", _key: `file-${n + 1}`, label })) })),
];

const { emptyMessage, pendingLabel } = VIDEO_DEFAULTS;
const collectionCopy = Object.fromEntries(Object.entries(VIDEO_DEFAULTS).filter(([key]) => !["title", "intro", "emptyMessage", "pendingLabel"].includes(key)));
export const videoSeedDocuments = [
  { _id: "gtp2026MediaPage", _type: "gtp2026MediaPage", ...collectionCopy,
    videosEmptyMessage: emptyMessage, videosPendingLabel: pendingLabel },
  ...[1, 2, 3, 4].map(day => ({ _id: `gtp-video-highlight-day-${day}`, _type: "gtp2026Video",
    title: `Day ${day} highlights`, collection: "dailyHighlights", day: String(day), order: day })),
];
