import type { Metadata } from "next";
import { buildActionWorkshopListing } from "@/components/gtp/programmes/action-workshop-listing";
import { ProgrammeActivityPage } from "@/components/gtp/programmes/programme-activity-page";
import { getGtp2026Programme } from "@/sanity/gtp-programme";
import { getGtpProgrammeActivityPage } from "@/sanity/gtp-stage2";

const description =
  "Action Workshops at Global Tipping Points Conference 2026, taking place on 13 and 14 October in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Action Workshops",
  description,
  alternates: { canonical: "/events/gtp-2026/programmes/action-workshops" },
  openGraph: {
    title: "Action Workshops | GTP 2026",
    description,
    url: "/events/gtp-2026/programmes/action-workshops",
  },
};

export const dynamic = "force-dynamic";

export default async function ActionWorkshopsPage() {
  const [page, programme] = await Promise.all([
    getGtpProgrammeActivityPage("action-workshops"),
    getGtp2026Programme(),
  ]);
  const actionWorkshops = buildActionWorkshopListing({
    entries: page.entries,
    day2: programme.day2,
    day3: programme.day3,
  });
  return (
    <ProgrammeActivityPage
      page={page}
      actionWorkshops={actionWorkshops}
      hostedBy={programme.sessionModalHostedBy}
    />
  );
}
