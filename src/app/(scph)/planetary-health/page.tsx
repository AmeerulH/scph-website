import type { Metadata } from "next";
import { ScphPageHero } from "@/components/sections/heroes";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { PlanetaryHealthTabs } from "@/components/scph/planetary-health-index/planetary-health-tabs";

export const metadata: Metadata = {
  title: "Planetary Health Index",
  description:
    "Explore country-level scores across environmental, societal, and human health dimensions — based on PDC 2025 data from the Planetary Health Index.",
  alternates: { canonical: "/planetary-health" },
  openGraph: {
    title: "Planetary Health Index | Sunway Centre for Planetary Health",
    description:
      "Country-level planetary health scores across environmental, societal, and human health — PDC 2025 data.",
    url: "/planetary-health",
  },
};

export const revalidate = 300;

export default function PlanetaryHealthPage() {
  return (
    <>
      <ScphPageHero
        eyebrow="Data & Index"
        title="Planetary Health Index"
        lede="Country-level scores across environmental, societal, and human health — based on PDC 2025 data."
        variant="solid-blue"
      />
      <SectionWrapper theme="scph" scrollReveal={false}>
        <PlanetaryHealthTabs />
      </SectionWrapper>
    </>
  );
}
