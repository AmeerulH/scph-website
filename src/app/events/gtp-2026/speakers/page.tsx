import type { Metadata } from "next";
import {
  getGtp2026HighlightSpeakers,
  mapSanityHighlightToProps,
} from "@/sanity/gtp-stage1";
import { gtpHighlightSpeakers } from "@/data/gtp-highlight-speakers";
import { GtpSpeakersPageClient } from "@/components/gtp/gtp-speakers-page-client";

const description =
  "Meet the speakers at Global Tipping Points Conference 2026 — scientists, policymakers, and leaders shaping planetary health in Kuala Lumpur, October 2026.";

export const metadata: Metadata = {
  title: "Speakers",
  description,
  alternates: { canonical: "/events/gtp-2026/speakers" },
  openGraph: {
    title: "Speakers | GTP 2026",
    description,
    url: "/events/gtp-2026/speakers",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 Speakers",
    description,
  },
};

export const revalidate = 3600;

export default async function SpeakersPage() {
  const rows = await getGtp2026HighlightSpeakers().catch(() => []);
  const speakers =
    rows.length > 0 ? mapSanityHighlightToProps(rows) : gtpHighlightSpeakers;

  return <GtpSpeakersPageClient speakers={speakers} />;
}
