import type { Metadata } from "next";
import { Suspense } from "react";
import { buildActionWorkshopListing } from "@/components/gtp/programmes/action-workshop-listing";
import { ProgrammeActivityHero } from "@/components/gtp/programmes/programme-activity-page";
import { CombinedProgrammePage } from "@/components/gtp/programmes/combined-programme-page";
import type { GtpProgrammeActivityPage } from "@/data/gtp-programme-activity-defaults";
import { getGtp2026Programme } from "@/sanity/gtp-programme";
import { getGtpProgrammeActivityPage } from "@/sanity/gtp-stage2";
import { buildResearchSessionListing } from "@/components/gtp/programmes/research-session-listing";
import { getActivityRegistration } from "@/lib/gtp-activity-registration-server";

const description =
  "Action Workshops and Research Sessions run simultaneously on 13 and 14 October at Global Tipping Points Conference 2026 in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Action Workshops and Research Sessions",
  description,
  alternates: { canonical: "/events/gtp-2026/programmes/action-workshops" },
  openGraph: {
    title: "Action Workshops and Research Sessions | GTP 2026",
    description,
    url: "/events/gtp-2026/programmes/action-workshops",
  },
};

export const dynamic = "force-dynamic";

export default async function ActionWorkshopsPage() {
  const programmePromise = getGtp2026Programme();
  const page = await getGtpProgrammeActivityPage("action-workshops");
  return <>
    <ProgrammeActivityHero page={page} />
    <Suspense fallback={<section aria-busy aria-label="Loading workshops and research sessions" className="min-h-screen bg-gtp-paper px-4 py-8 sm:px-6 sm:py-10"><p className="mx-auto max-w-6xl text-sm text-gtp-dark-teal">Loading programme…</p></section>}>
      <CombinedProgrammeData page={page} programmePromise={programmePromise} />
    </Suspense>
  </>;
}

async function CombinedProgrammeData({page, programmePromise}: {
  page: GtpProgrammeActivityPage;
  programmePromise: ReturnType<typeof getGtp2026Programme>;
}) {
  const programme = await programmePromise;
  const actionWorkshops = buildActionWorkshopListing({
    entries: page.entries,
    day2: programme.day2,
    day3: programme.day3,
  });
  const researchSessions = programme.isPublished ? buildResearchSessionListing(programme) : [];
  const {status, label} = await getActivityRegistration(page);
  return (
    <CombinedProgrammePage
      page={page}
      workshops={actionWorkshops}
      hostedBy={programme.sessionModalHostedBy}
      research={researchSessions}
      registration={{status, label}}
    />
  );
}
