import type { Metadata } from "next";
import { ScphPageHero } from "@/components/sections/heroes";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { PLANETARY_HEALTH_ASSESSMENT_DESCRIPTION } from "@/components/scph/planetary-health-index/copy";
import { PlanetaryHealthTabs } from "@/components/scph/planetary-health-index/planetary-health-tabs";

export const metadata: Metadata = {
  title: "Planetary Health Assessment",
  description:
    "Explore country-level composite scores across environmental, societal, and human health — based on PDC 2025 data from the Planetary Health Assessment.",
  alternates: { canonical: "/planetary-health" },
  openGraph: {
    title: "Planetary Health Assessment | Sunway Centre for Planetary Health",
    description:
      "Country-level planetary health assessment scores across environmental, societal, and human health — PDC 2025 data.",
    url: "/planetary-health",
  },
};

export const revalidate = 3600;

export default function PlanetaryHealthPage() {
  return (
    <>
      <ScphPageHero
        eyebrow="Data & Assessment"
        title="Planetary Health Assessment"
        lede="A composite index of environmental, societal, and human health — country-level scores from PDC 2025 data."
        variant="solid-blue"
      />
      <SectionWrapper
        theme="scph"
        scrollReveal={false}
        className="overflow-x-hidden !py-12 md:!py-16"
      >
        <div className="mb-16 max-w-3xl md:mb-20">
          <h2 className="font-heading text-xl font-bold text-scph-blue md:text-2xl">
            About the assessment
          </h2>
          <div className="mt-3 h-1 w-12 rounded-full bg-scph-green" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {PLANETARY_HEALTH_ASSESSMENT_DESCRIPTION}
          </p>
        </div>
        <PlanetaryHealthTabs />
      </SectionWrapper>
    </>
  );
}
