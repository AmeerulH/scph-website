import "server-only";
import { NEWS_DEFAULTS, parseNewsParams, selectNewsPage, type NewsArticle, type NewsPageData, type NewsSearchParams } from "./gtp-news";

/** Synthetic coverage with existing conference photos; called only by guarded review surfaces. */
export function newsReviewData(search: NewsSearchParams): NewsPageData {
  const scenario = search.case;
  const titles = ["The conversations shaping positive tipping points", "From understanding to collective action", "New perspectives on a thriving planet", "Ideas into action: highlights from the conference", "Nature and community at the heart of change", "A more connected and resilient future", "Collaboration for lasting change", "The people making positive tipping points possible", "Science, finance and culture come together", "From the plenary to the world: taking the conversation further", "Learning across borders", "Building pathways to a thriving planet"];
  const photos = ["main-photo.avif", "conf-4.avif", "networking.avif", "conf-6.avif", "conf-8.avif", "conf-5.avif"];
  const total = scenario === "empty" || scenario === "error" ? 0 : scenario === "one" ? 1 : 25;
  const index: NewsArticle[] = Array.from({ length: total }, (_, i) => ({
    id: `review-${i}`, title: scenario === "long" && i === 0 ? "Positive tipping points, collective action and the conversations connecting science, finance, culture and communities across the world for a thriving and resilient planet" : `${titles[i % titles.length]}${i >= titles.length ? `: a new perspective ${i + 1}` : ""}`,
    publisher: scenario === "long" ? "Example publication with an exceptionally long name to test the mobile reading experience" : "Example publication",
    url: `https://example.com/?sample-article=${i + 1}`, category: i % 3 ? "gtpConference" : "other",
    image: { src: `/images/gtp/gtp-2025/${photos[i % photos.length]}`, alt: "GTP 2025 conference photograph used for local layout review", width: 1600, height: 900 },
    ...(scenario === "long" ? { imageCredit: "Sample image credit to check long attribution and publication details" } : {}),
  }));
  const selection = selectNewsPage(index, parseNewsParams(search));
  return { ...selection, settings: NEWS_DEFAULTS, featured: index.slice(0, 3), collectionTotal: total, unavailable: scenario === "error" };
}
