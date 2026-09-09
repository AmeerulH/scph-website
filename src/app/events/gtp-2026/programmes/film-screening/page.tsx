import type { Metadata } from "next";
import { ProgrammeActivityPage } from "@/components/gtp/programmes/programme-activity-page";
import { getGtpProgrammeActivityPage } from "@/sanity/gtp-stage2";

const description =
  "Film screening at the Global Tipping Points Conference 2026 in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Film Screening",
  description,
  alternates: { canonical: "/events/gtp-2026/programmes/film-screening" },
  openGraph: {
    title: "Film Screening | GTP 2026",
    description,
    url: "/events/gtp-2026/programmes/film-screening",
  },
};

export const dynamic = "force-dynamic";

export default async function FilmScreeningPage() {
  const page = await getGtpProgrammeActivityPage("film-screening");
  return <ProgrammeActivityPage page={page} />;
}
