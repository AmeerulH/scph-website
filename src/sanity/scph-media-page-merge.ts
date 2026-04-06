import {
  SCPH_MEDIA_ARTICLES_DEFAULT,
  SCPH_MEDIA_PAGE_DEFAULTS,
} from "@/data/scph-media-page-defaults";
import type { SectionBlock } from "@/sanity/section-block-types";
import type { ArticleCardItem } from "@/components/sections/article-card-grid";

function pickStr(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

export type ScphMediaArticleCms = {
  _key?: string;
  title?: string | null;
  tag?: string | null;
  href?: string | null;
  body?: string | null;
};

export type ScphMediaPageCms = {
  heroEyebrow?: string | null;
  heroTitle?: string | null;
  heroLede?: string | null;
  articlesSectionTitle?: string | null;
  articlesSectionSubtitle?: string | null;
  viewAllArticlesUrl?: string | null;
  viewAllArticlesLabel?: string | null;
  readArticleLabel?: string | null;
  articlesIntroNote?: string | null;
  articles?: ScphMediaArticleCms[] | null;
  sections?: SectionBlock[] | null;
};

function mergeArticles(
  cms: ScphMediaArticleCms[] | null | undefined,
  viewAllUrl: string,
): ArticleCardItem[] {
  const fromDefaults = () =>
    SCPH_MEDIA_ARTICLES_DEFAULT.map((item, index) => ({
      _key: `default-${index}`,
      title: item.title,
      tag: item.tag,
      excerpt: item.body,
      href: item.href?.trim() ? item.href : viewAllUrl,
    }));

  if (!cms?.length) return fromDefaults();

  const fromCms: ArticleCardItem[] = cms.map((c) => {
    const title = pickStr(c.title, "");
    const tag = pickStr(c.tag, "Article");
    const excerpt = pickStr(c.body, "");
    const hrefRaw = typeof c.href === "string" ? c.href.trim() : "";
    return {
      _key: c._key,
      title,
      tag,
      excerpt,
      href: hrefRaw || viewAllUrl,
    };
  });

  const withTitles = fromCms.filter((a) => a.title.length > 0);
  return withTitles.length > 0 ? withTitles : fromDefaults();
}

export function mergeScphMediaPage(cms: ScphMediaPageCms | null) {
  const d = SCPH_MEDIA_PAGE_DEFAULTS;
  const viewAllUrl = pickStr(cms?.viewAllArticlesUrl, d.viewAllArticlesUrl);

  return {
    heroEyebrow: pickStr(cms?.heroEyebrow, d.heroEyebrow),
    heroTitle: pickStr(cms?.heroTitle, d.heroTitle),
    heroLede: pickStr(cms?.heroLede, d.heroLede),
    articlesSectionTitle: pickStr(
      cms?.articlesSectionTitle,
      d.articlesSectionTitle,
    ),
    articlesSectionSubtitle: pickStr(
      cms?.articlesSectionSubtitle,
      d.articlesSectionSubtitle,
    ),
    viewAllArticlesUrl: viewAllUrl,
    viewAllArticlesLabel: pickStr(
      cms?.viewAllArticlesLabel,
      d.viewAllArticlesLabel,
    ),
    readArticleLabel: pickStr(cms?.readArticleLabel, d.readArticleLabel),
    articlesIntroNote: pickStr(cms?.articlesIntroNote, d.articlesIntroNote),
    articles: mergeArticles(cms?.articles ?? undefined, viewAllUrl),
    sections: cms?.sections ?? [],
  };
}

export type MergedScphMediaPage = ReturnType<typeof mergeScphMediaPage>;
