import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import {
  ArticleCardGrid,
  type ArticleCardItem,
} from "@/components/sections/article-card-grid";
import { PlaceholderNotice } from "@/components/sections/placeholder-notice";
import { ScphPageHero } from "@/components/sections/heroes";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import { sectionBlocksMayRender } from "@/sanity/section-block-types";
import { getScphMediaPage } from "@/sanity/scph-pages";
import {
  mergeScphMediaPage,
  type MergedScphMediaPage,
} from "@/sanity/scph-media-page-merge";

export const metadata: Metadata = {
  title: "Media",
  description:
    "News, stories, and media resources from Sunway Centre for Planetary Health—planetary health updates from Malaysia and beyond.",
  alternates: { canonical: "/media" },
  openGraph: {
    title: "Media | Sunway Centre for Planetary Health",
    description:
      "Latest updates and media from the Sunway Centre for Planetary Health.",
    url: "/media",
  },
};

export const revalidate = 300;

function ArticlesSection({
  title,
  subtitle,
  items,
  viewAllUrl,
  viewAllLabel,
  readLabel,
  introNote,
}: {
  title: string;
  subtitle: string;
  items: ArticleCardItem[];
  viewAllUrl: string;
  viewAllLabel: string;
  readLabel: string;
  introNote: string;
}) {
  return (
    <SectionWrapper
      title={title}
      subtitle={subtitle}
      theme="scph"
      background="default"
    >
      <ArticleCardGrid
        items={items}
        articleHref={viewAllUrl}
        readLabel={readLabel}
      />

      <PlaceholderNotice className="mt-12">
        {introNote}{" "}
        <a
          href={viewAllUrl}
          target={
            /^https?:\/\//i.test(viewAllUrl) ? "_blank" : undefined
          }
          rel={
            /^https?:\/\//i.test(viewAllUrl)
              ? "noopener noreferrer"
              : undefined
          }
          className="font-semibold text-scph-blue hover:underline"
        >
          {viewAllLabel}
        </a>
      </PlaceholderNotice>
    </SectionWrapper>
  );
}

function MediaPageView({ page }: { page: MergedScphMediaPage }) {
  const showIntroSections = sectionBlocksMayRender(page.sections);

  return (
    <>
      <ScphPageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        lede={page.heroLede}
      />
      {showIntroSections ? (
        <RenderSectionBlocks blocks={page.sections} />
      ) : null}
      <ArticlesSection
        title={page.articlesSectionTitle}
        subtitle={page.articlesSectionSubtitle}
        items={page.articles}
        viewAllUrl={page.viewAllArticlesUrl}
        viewAllLabel={page.viewAllArticlesLabel}
        readLabel={page.readArticleLabel}
        introNote={page.articlesIntroNote}
      />
    </>
  );
}

async function MediaPageLoaded() {
  const mediaCms = await getScphMediaPage().catch(() => null);
  return <MediaPageView page={mergeScphMediaPage(mediaCms)} />;
}

export default function MediaPage() {
  return (
    <Suspense fallback={<MediaPageView page={mergeScphMediaPage(null)} />}>
      <MediaPageLoaded />
    </Suspense>
  );
}
