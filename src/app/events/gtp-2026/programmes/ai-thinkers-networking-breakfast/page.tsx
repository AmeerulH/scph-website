import type { Metadata } from "next";
import { ProgrammeActivityPage } from "@/components/gtp/programmes/programme-activity-page";
import { getGtpProgrammeActivityPage } from "@/sanity/gtp-stage2";

const description =
  "AI Thinkers Networking Breakfast at Global Tipping Points Conference 2026: curating a hybrid future for people, planet and potential.";

export const metadata: Metadata = {
  title: "AI Thinkers Networking Breakfast",
  description,
  alternates: {
    canonical: "/events/gtp-2026/programmes/ai-thinkers-networking-breakfast",
  },
  openGraph: {
    title: "AI Thinkers Networking Breakfast | GTP 2026",
    description,
    url: "/events/gtp-2026/programmes/ai-thinkers-networking-breakfast",
  },
};

export const dynamic = "force-dynamic";

export default async function AiThinkersNetworkingBreakfastPage() {
  const page = await getGtpProgrammeActivityPage("ai-thinkers-networking-breakfast");
  return <ProgrammeActivityPage page={page} />;
}
