import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { GtpForestHero } from "@/components/sections/heroes";
import { GtpFaqSectionClient } from "@/components/gtp/gtp-faq-section-client";
import { getGtp2026FaqGroupsWithItems } from "@/sanity/gtp-stage1";

const description =
  "Frequently asked questions about Global Tipping Points Conference 2026 in Kuala Lumpur—travel, registration, and the programme.";

export const metadata: Metadata = {
  title: "FAQ",
  description,
  alternates: { canonical: "/events/gtp-2026/faq" },
  openGraph: {
    title: "FAQ | GTP 2026",
    description,
    url: "/events/gtp-2026/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 FAQ",
    description,
  },
};

export const revalidate = 60;

export default async function GtpFaqPage() {
  const groups = await getGtp2026FaqGroupsWithItems().catch(() => []);

  if (groups.length === 0) {
    return <PlaceholderPage title="FAQ" theme="gtp" />;
  }

  return (
    <>
      <GtpForestHero
        title="Frequently asked questions"
        lede="Practical information about Global Tipping Points Conference 2026 in Kuala Lumpur."
        bottomSpacing="spacious"
      />
      <SectionWrapper theme="gtp" background="default" className="pb-20">
        <GtpFaqSectionClient groups={groups} />
      </SectionWrapper>
    </>
  );
}
