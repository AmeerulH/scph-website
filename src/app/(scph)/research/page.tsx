import type { Metadata } from "next";
import type { ScphWhitePillarCardItem } from "@/components/sections/icon-card-grid";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { IconCardGrid } from "@/components/sections/icon-card-grid";
import { ScphPageHero } from "@/components/sections/heroes";
import {
  RenderSectionBlocks,
  SectionProseCtaFromCms,
  SectionStatsRowFromCms,
} from "@/components/sections/render-section-block";
import { sectionBlocksMayRender } from "@/sanity/section-block-types";
import { getScphResearchPage } from "@/sanity/scph-pages";
import { mergeScphResearchPageBands } from "@/sanity/scph-page-bands-merge";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Planetary Health Roadmap and research at Sunway Centre for Planetary Health—policy, cities, food systems, and climate-health action in Malaysia.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research | Sunway Centre for Planetary Health",
    description:
      "Explore our planetary health research themes and roadmap for real-world impact.",
    url: "/research",
  },
};

export const revalidate = 300;

function PillarsSection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: ScphWhitePillarCardItem[];
}) {
  return (
    <SectionWrapper
      title={title}
      subtitle={subtitle}
      theme="scph"
      background="muted"
    >
      <IconCardGrid
        variant="scph-white-pillar"
        staggerVariant="long"
        gridClassName="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        items={items}
      />
    </SectionWrapper>
  );
}

export default async function ResearchPage() {
  const researchCms = await getScphResearchPage().catch(() => null);
  const bands = mergeScphResearchPageBands(researchCms);
  const researchSections = bands.sections;
  const showOptionalResearchCms = sectionBlocksMayRender(researchSections);

  return (
    <>
      <ScphPageHero
        eyebrow="Research"
        title={<>Planetary Health Roadmap &amp; Action Plan</>}
        lede="Bridging Planetary Health discourse between academia and action via policy, political, and civil society spaces."
      />
      <SectionStatsRowFromCms block={bands.statsRow} />
      <SectionProseCtaFromCms block={bands.roadmapBlock} scrollProgress />
      <PillarsSection
        title={bands.pillarsSectionTitle}
        subtitle={bands.pillarsSectionSubtitle}
        items={bands.pillars}
      />
      {showOptionalResearchCms ? (
        <RenderSectionBlocks blocks={researchSections} />
      ) : null}
    </>
  );
}
