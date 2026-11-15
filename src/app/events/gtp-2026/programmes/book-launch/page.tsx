import type { Metadata } from "next";
import { BookLaunchPage } from "@/components/gtp/book-launch/book-launch-page";
import { GTP_BOOK_LAUNCH_PATH } from "@/data/gtp-book-launch-page-defaults";
import { getGtpBookLaunchPage } from "@/sanity/gtp-book-launch-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGtpBookLaunchPage();
  const title = page.bookTitle ? `${page.pageTitle}: ${page.bookTitle}` : page.pageTitle;
  const images = page.cover ? [{ url: page.cover.src, alt: page.cover.alt }] : undefined;
  return {
    title,
    description: page.seoDescription,
    alternates: { canonical: GTP_BOOK_LAUNCH_PATH },
    openGraph: {
      title: `${title} | GTP 2026`,
      description: page.seoDescription,
      url: GTP_BOOK_LAUNCH_PATH,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | GTP 2026`,
      description: page.seoDescription,
      images: images?.map((image) => image.url),
    },
  };
}

export default async function GtpBookLaunchRoute() {
  const page = await getGtpBookLaunchPage();
  return <BookLaunchPage page={page} />;
}
