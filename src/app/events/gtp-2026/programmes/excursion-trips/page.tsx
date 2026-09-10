import type { Metadata } from "next";
import { ProgrammeActivityPage } from "@/components/gtp/programmes/programme-activity-page";
import { getGtpProgrammeActivityPage } from "@/sanity/gtp-stage2";

const description =
  "Excursion Trips for Global Tipping Points Conference 2026 participants in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Excursion Trips",
  description,
  alternates: { canonical: "/events/gtp-2026/programmes/excursion-trips" },
  openGraph: {
    title: "Excursion Trips | GTP 2026",
    description,
    url: "/events/gtp-2026/programmes/excursion-trips",
  },
};

export const dynamic = "force-dynamic";

export default async function ExcursionTripsPage() {
  const page = await getGtpProgrammeActivityPage("excursion-trips");
  return <ProgrammeActivityPage page={page} />;
}
