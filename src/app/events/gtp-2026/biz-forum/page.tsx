import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import { GtpForestHero } from "@/components/sections/heroes";
import { getGtp2026BizForumPage } from "@/sanity/gtp-stage2";
import { sectionBlocksMayRender } from "@/sanity/section-block-types";

const description =
  "Business forum at Global Tipping Points Conference 2026—finance and private sector dialogue for positive tipping points in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Business forum",
  description,
  alternates: { canonical: "/events/gtp-2026/biz-forum" },
  openGraph: {
    title: "Business forum | GTP 2026",
    description,
    url: "/events/gtp-2026/biz-forum",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 business forum",
    description,
  },
};

export const dynamic = "force-dynamic";

const defaultPageTitle = "Biz Forum";

export default async function BizForumPage() {
  const cms = await getGtp2026BizForumPage().catch(() => null);
  const title = cms?.pageTitle?.trim() || defaultPageTitle;
  const sections = cms?.sections ?? null;
  const heroLede = cms?.heroLede?.trim();

  if (sectionBlocksMayRender(sections)) {
    return (
      <>
        <GtpForestHero
          title={title}
          lede={heroLede || undefined}
          bottomSpacing="spacious"
        />
        <RenderSectionBlocks blocks={sections ?? []} />
      </>
    );
  }

  return (
    <PlaceholderPage
      title={title}
      description={cms?.placeholderDescription?.trim() || undefined}
      theme="gtp"
    />
  );
}
