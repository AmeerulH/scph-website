import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import { GtpForestHero } from "@/components/sections/heroes";
import { getGtp2026MediaPage } from "@/sanity/gtp-stage2";
import { sectionBlocksMayRender } from "@/sanity/section-block-types";

const description =
  "Media resources and press information for Global Tipping Points Conference 2026, hosted by Sunway Centre for Planetary Health in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Media",
  description,
  alternates: { canonical: "/events/gtp-2026/media" },
  openGraph: {
    title: "Media | GTP 2026",
    description,
    url: "/events/gtp-2026/media",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 media",
    description,
  },
};

export const revalidate = 60;

const defaultPageTitle = "Media";

export default async function GtpMediaPage() {
  const cms = await getGtp2026MediaPage().catch(() => null);
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
