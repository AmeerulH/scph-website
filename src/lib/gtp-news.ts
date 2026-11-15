export const GTP_NEWS_PATH = "/events/gtp-2026/media/on-the-news";
export const NEWS_PAGE_SIZE = 9;
export const NEWS_DEFAULTS = {
  title: "ON THE NEWS",
  intro: "Stories, ideas and coverage from GTP 2026 and beyond.",
  emptyTitle: "More stories are on their way.",
  emptyMessage: "Explore the conference in pictures, podcasts and videos while we bring together the latest articles.",
};
export const NEWS_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "gtpConference", label: "GTP conference" },
  { id: "other", label: "Other articles" },
] as const;
export type NewsCategory = "gtpConference" | "other";
export type NewsParams = { category: NewsCategory | "all"; q: string; page: number };
export type NewsSearchParams = Record<string, string | string[] | undefined>;
export type NewsArticle = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  category: NewsCategory;
  publishedAt?: string;
  imageCredit?: string;
  image: { src: string; alt: string; width: number; height: number };
};
export type RawNewsArticle = {
  _id?: string | null;
  title?: string | null;
  publisher?: string | null;
  url?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  imageCredit?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
};
export type NewsPageData = {
  settings: typeof NEWS_DEFAULTS;
  featured: NewsArticle[];
  articles: NewsArticle[];
  total: number;
  collectionTotal: number;
  pages: number;
  params: NewsParams;
  unavailable: boolean;
};

export function newsHttpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || /[\s\\\u0000-\u001f\u007f]/.test(value)) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return;
    return url.href;
  } catch { return; }
}

export function resolveNewsArticle(raw: RawNewsArticle): NewsArticle | undefined {
  const id = raw._id?.trim();
  const title = raw.title?.trim();
  const publisher = raw.publisher?.trim();
  const url = newsHttpsUrl(raw.url);
  const src = newsHttpsUrl(raw.imageUrl);
  const alt = raw.imageAlt?.trim();
  if (!id || id.startsWith("drafts.") || id.startsWith("versions.") || !title || !publisher || !url || !src || !alt ||
      !["gtpConference", "other"].includes(raw.category ?? "")) return;
  const imageUrl = new URL(src);
  if (imageUrl.hostname !== "cdn.sanity.io" || !imageUrl.pathname.startsWith("/images/")) return;
  const date = raw.publishedAt;
  const publishedAt = date && /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date ? date : undefined;
  return {
    id, title, publisher, url, category: raw.category as NewsCategory,
    publishedAt, imageCredit: raw.imageCredit?.trim() || undefined,
    image: { src, alt, width: raw.imageWidth && raw.imageWidth > 0 ? raw.imageWidth : 1600,
      height: raw.imageHeight && raw.imageHeight > 0 ? raw.imageHeight : 900 },
  };
}

export function parseNewsParams(search: NewsSearchParams): NewsParams {
  const first = (key: string) => Array.isArray(search[key]) ? search[key][0] : search[key];
  const category = first("category");
  const page = Number(first("page"));
  return {
    category: category === "gtpConference" || category === "other" ? category : "all",
    q: (first("q") ?? "").trim().slice(0, 120),
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 100000) : 1,
  };
}

export function newsHref(params: NewsParams, basePath = GTP_NEWS_PATH) {
  const [path, initialQuery] = basePath.split("?");
  const search = new URLSearchParams(initialQuery);
  if (params.category !== "all") search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.page > 1) search.set("page", String(params.page));
  return `${path}${search.size ? `?${search}` : ""}#articles`;
}

/** The small metadata index keeps counts, search and omitted invalid records consistent. */
export function selectNewsPage(index: NewsArticle[], params: NewsParams) {
  const words = params.q.toLocaleLowerCase("en").split(/\s+/).filter(Boolean);
  const matching = index.filter(article =>
    (params.category === "all" || article.category === params.category) &&
    words.every(word => `${article.title} ${article.publisher}`.toLocaleLowerCase("en").includes(word)));
  const pages = Math.max(1, Math.ceil(matching.length / NEWS_PAGE_SIZE));
  const page = Math.min(params.page, pages);
  return { params: { ...params, page }, pages, total: matching.length,
    articles: matching.slice((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE) };
}

export function selectNewsFeatured(index: NewsArticle[], refs: string[]) {
  const byId = new Map(index.map(article => [article.id, article]));
  const selected = [...new Set(refs)].map(id => byId.get(id)).filter((a): a is NewsArticle => Boolean(a)).slice(0, 5);
  return selected.length ? selected : index.slice(0, 3);
}

export function newsDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
