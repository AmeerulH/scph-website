import type { Metadata } from "next";
import { ProgrammeActivityPage } from "@/components/gtp/programmes/programme-activity-page";
import { getGtpProgrammeActivityPage } from "@/sanity/gtp-stage2";

const description =
  "Sensorial Station at the Global Tipping Points Conference 2026 in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Sensorial Station",
  description,
  alternates: { canonical: "/events/gtp-2026/programmes/sensorial-station" },
  openGraph: {
    title: "Sensorial Station | GTP 2026",
    description,
    url: "/events/gtp-2026/programmes/sensorial-station",
  },
};

export const dynamic = "force-dynamic";

export default async function SensorialStationPage() {
  const page = await getGtpProgrammeActivityPage("sensorial-station");
  return <ProgrammeActivityPage page={page} />;
}
