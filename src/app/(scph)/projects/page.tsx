import type { Metadata } from "next";
import { SCPH_PROJECTS_PLACEHOLDER_DESCRIPTION } from "@/data/scph-placeholder-pages-defaults";
import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import { getScphProjectsPage } from "@/sanity/scph-pages";
import { sectionBlocksMayRender } from "@/sanity/section-block-types";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Research and action projects at Sunway Centre for Planetary Health—planetary health impact across priority areas.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Sunway Centre for Planetary Health",
    description:
      "Explore SCPH projects at the intersection of health, climate, and equity.",
    url: "/projects",
  },
};

export const revalidate = 300;

export default async function ProjectsPage() {
  const cms = await getScphProjectsPage().catch(() => null);
  const title = cms?.pageTitle?.trim() || "Projects";
  const sections = cms?.sections ?? null;

  if (sectionBlocksMayRender(sections)) {
    return (
      <>
        <div className="pt-24" />
        <RenderSectionBlocks blocks={sections} />
      </>
    );
  }

  const customDesc = cms?.placeholderDescription?.trim();

  return (
    <PlaceholderPage
      title={title}
      description={customDesc || SCPH_PROJECTS_PLACEHOLDER_DESCRIPTION}
      theme="scph"
    />
  );
}
