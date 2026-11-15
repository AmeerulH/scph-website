import type { Metadata } from "next";
import { ProgrammeActivityPage } from "@/components/gtp/programmes/programme-activity-page";
import { getGtpProgrammeActivityPage } from "@/sanity/gtp-stage2";

const PATH = "/events/gtp-2026/programmes/artificial-intelligence-sessions";
const description =
  "Artificial Intelligence Sessions at Global Tipping Points Conference 2026: networking breakfasts and workshops on curating a hybrid future for people, planet and potential.";

export const metadata: Metadata = {
  title: "Artificial Intelligence Sessions",
  description,
  alternates: { canonical: PATH },
  openGraph: {
    title: "Artificial Intelligence Sessions | GTP 2026",
    description,
    url: PATH,
  },
};

export const dynamic = "force-dynamic";

export default async function ArtificialIntelligenceSessionsPage() {
  const page = await getGtpProgrammeActivityPage("ai-thinkers-networking-breakfast");
  return <ProgrammeActivityPage page={page} />;
}
