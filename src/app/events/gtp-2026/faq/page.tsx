import type { Metadata } from "next";
import { Suspense } from "react";
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

function FaqBodyFallback() {
  return (
    <SectionWrapper theme="gtp" background="default" className="pb-20">
      <div
        className="mx-auto max-w-3xl space-y-4"
        aria-busy="true"
        aria-label="Loading FAQ content"
      >
        <div className="h-10 w-48 rounded-lg bg-gtp-dark-teal/10" />
        <div className="h-24 rounded-xl bg-gray-100" />
        <div className="h-24 rounded-xl bg-gray-100" />
        <div className="h-24 rounded-xl bg-gray-100" />
      </div>
    </SectionWrapper>
  );
}

async function GtpFaqBody() {
  const groups = await getGtp2026FaqGroupsWithItems().catch(() => []);

  if (groups.length === 0) {
    return (
      <SectionWrapper theme="gtp" background="default" className="pb-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-gtp-teal/20 bg-white p-10 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gtp-dark-teal/70">
            Coming Soon
          </p>
          <h2 className="mt-3 font-heading text-2xl font-bold text-gtp-dark-teal">
            FAQ
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            This section is currently being developed. Check back soon.
          </p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper theme="gtp" background="default" className="pb-20">
      <GtpFaqSectionClient groups={groups} />
    </SectionWrapper>
  );
}

export default function GtpFaqPage() {
  return (
    <>
      <GtpForestHero
        title="Frequently asked questions"
        lede="Practical information about Global Tipping Points Conference 2026 in Kuala Lumpur."
        bottomSpacing="spacious"
      />
      <Suspense fallback={<FaqBodyFallback />}>
        <GtpFaqBody />
      </Suspense>
    </>
  );
}
