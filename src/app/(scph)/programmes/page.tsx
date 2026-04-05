import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import { getScphProgrammesPage } from "@/sanity/scph-pages";
import { sectionBlocksMayRender } from "@/sanity/section-block-types";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Programmes and initiatives from Sunway Centre for Planetary Health—education, research, and action for planetary health.",
  alternates: { canonical: "/programmes" },
  openGraph: {
    title: "Programmes | Sunway Centre for Planetary Health",
    description:
      "SCPH programmes advancing planetary health in Malaysia and the region.",
    url: "/programmes",
  },
};

export const dynamic = "force-dynamic";

const DEFAULT_PLACEHOLDER_DESCRIPTION =
  "Our programmes and initiatives are currently being developed. Check back soon.";

export default async function ProgrammesPage() {
  const cms = await getScphProgrammesPage().catch(() => null);
  const title = cms?.pageTitle?.trim() || "Programmes";
  const sections = cms?.sections ?? null;

  if (sectionBlocksMayRender(sections)) {
    return (
      <>
        <div className="pt-24" />
        <RenderSectionBlocks blocks={sections} />
      </>
    );
  }

  const description =
    cms?.placeholderDescription?.trim() || DEFAULT_PLACEHOLDER_DESCRIPTION;

  return (
    <PlaceholderPage
      title={title}
      description={description}
      theme="scph"
    />
  );
}
