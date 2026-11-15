import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GtpNavbar } from "@/components/gtp/navbar";
import { GtpFooter } from "@/components/gtp/footer";
import { NewsPageView } from "@/components/gtp/media/news/news-page";
import { gtpFooterDefaults } from "@/data/gtp-footer-defaults";
import { type NewsSearchParams } from "@/lib/gtp-news";
import { newsReviewData } from "@/lib/gtp-news-review";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Local news design review", robots: { index: false, follow: false } };

export default async function NewsReview({ searchParams }: { searchParams: Promise<NewsSearchParams> }) {
  if (process.env.NODE_ENV !== "development" || process.env.GTP_NEWS_REVIEW_MODE !== "1") notFound();
  const search = await searchParams;
  return <><GtpNavbar /><main><NewsPageView review basePath="/dev/on-the-news-review" data={newsReviewData(search)} /></main><GtpFooter data={gtpFooterDefaults} /></>;
}
