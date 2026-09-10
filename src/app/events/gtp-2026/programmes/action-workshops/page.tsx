import type { Metadata } from "next";
import { ProgrammeActivityPage } from "@/components/gtp/programmes/programme-activity-page";
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
  const page = await getGtpProgrammeActivityPage("action-workshops");
  return <ProgrammeActivityPage page={page} />;
}
