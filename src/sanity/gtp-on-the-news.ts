import { cache } from "react";
import { client } from "./client";
import {
  NEWS_DEFAULTS, parseNewsParams, resolveNewsArticle, selectNewsFeatured, selectNewsPage,
  type NewsArticle, type NewsPageData, type NewsSearchParams, type RawNewsArticle,
} from "@/lib/gtp-news";

const published = '_type == "gtp2026NewsArticle" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))';
const projection = `_id, title, publisher, url, category, publishedAt,
  "imageUrl": image.asset->url, "imageAlt": image.alt`;
type Settings = Partial<Record<"newsTitle" | "newsIntro" | "newsEmptyTitle" | "newsEmptyMessage", string | null>> & {
  newsFeaturedArticles?: { _ref?: string | null }[] | null;
};
const getIndex = cache(async () => client.fetch<{ settings: Settings | null; index: RawNewsArticle[] }>(`{
  "settings": *[_type == "gtp2026MediaPage" && _id == "gtp2026MediaPage"][0]{
    newsTitle, newsIntro, newsEmptyTitle, newsEmptyMessage, newsFeaturedArticles[]{_ref}
  },
  "index": *[${published}] | order(coalesce(publishedAt, _createdAt) desc, _id asc){${projection}}
}`, {}, { perspective: "published" }));

export async function getGtpNewsPage(search: NewsSearchParams = {}): Promise<NewsPageData> {
  const params = parseNewsParams(search);
  try {
    const raw = await getIndex();
    const index = raw.index.map(resolveNewsArticle).filter((a): a is NewsArticle => Boolean(a));
    const selection = selectNewsPage(index, params);
    const featured = selectNewsFeatured(index, (raw.settings?.newsFeaturedArticles ?? []).flatMap(ref => ref?._ref ? [ref._ref] : []));
    const ids = [...new Set([...selection.articles, ...featured].map(a => a.id))];
    // Hydrate only the current page + spotlight, at most fourteen images; never send the index to the browser.
    const details = ids.length ? await client.fetch<RawNewsArticle[]>(`*[${published} && _id in $ids]{
      ${projection}, imageCredit,
      "imageWidth": image.asset->metadata.dimensions.width,
      "imageHeight": image.asset->metadata.dimensions.height
    }`, { ids }, { perspective: "published" }) : [];
    const hydrated = new Map(details.map(resolveNewsArticle).filter((a): a is NewsArticle => Boolean(a)).map(a => [a.id, a]));
    const hydrate = (items: NewsArticle[]) => items.flatMap(a => hydrated.get(a.id) ? [hydrated.get(a.id)!] : []);
    const copy = (key: keyof typeof NEWS_DEFAULTS, field: keyof Settings) => {
      const value = raw.settings?.[field];
      return typeof value === "string" && value.trim() ? value.trim() : NEWS_DEFAULTS[key];
    };
    return { ...selection, articles: hydrate(selection.articles), featured: hydrate(featured),
      settings: { title: copy("title", "newsTitle"), intro: copy("intro", "newsIntro"),
        emptyTitle: copy("emptyTitle", "newsEmptyTitle"), emptyMessage: copy("emptyMessage", "newsEmptyMessage") },
      collectionTotal: index.length, unavailable: false };
  } catch {
    console.error("GTP news content could not be loaded.");
    return { settings: NEWS_DEFAULTS, params, featured: [], articles: [], total: 0,
      collectionTotal: 0, pages: 1, unavailable: true };
  }
}
