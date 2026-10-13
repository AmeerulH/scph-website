import type { Metadata } from "next";
import { NewsPageView } from "@/components/gtp/media/news/news-page";
import { GTP_NEWS_PATH, NEWS_DEFAULTS, type NewsSearchParams } from "@/lib/gtp-news";
import { newsReviewData } from "@/lib/gtp-news-review";
import { getGtpNewsPage } from "@/sanity/gtp-on-the-news";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "On the News",
  description: NEWS_DEFAULTS.intro,
  alternates: { canonical: GTP_NEWS_PATH },
  openGraph: { title: "On the News | GTP 2026", description: NEWS_DEFAULTS.intro, url: GTP_NEWS_PATH },
  twitter: { card: "summary_large_image", title: "On the News | GTP 2026", description: NEWS_DEFAULTS.intro },
};

export default async function GtpNewsPage({ searchParams }: { searchParams: Promise<NewsSearchParams> }) {
  const search = await searchParams;
  // Preview fixtures require Vercel's server-controlled environment and explicit opt-in.
  // Production deployments always read published CMS content, even with this query string.
  if (process.env.VERCEL_ENV === "preview" && search.review === "samples") {
    const scenario = typeof search.case === "string" && ["one", "empty", "error", "long"].includes(search.case) ? `&case=${search.case}` : "";
    return <NewsPageView review basePath={`${GTP_NEWS_PATH}?review=samples${scenario}`} data={newsReviewData(search)} />;
  }
  return <NewsPageView data={await getGtpNewsPage(search)} />;
}
