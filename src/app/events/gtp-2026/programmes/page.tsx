import type { Metadata } from "next";
import { Suspense } from "react";
import { ProgrammesHero } from "@/components/gtp/programmes/programmes-hero";
import { ProgrammesPageClient } from "./programmes-page-client";

const description =
  "Programme overview for Global Tipping Points Conference 2026—sessions, themes, and schedule highlights in Kuala Lumpur, hosted by Sunway Centre for Planetary Health.";

export const metadata: Metadata = {
  title: "Programme",
  description,
  alternates: { canonical: "/events/gtp-2026/programmes" },
  openGraph: {
    title: "Programme | GTP 2026",
    description,
    url: "/events/gtp-2026/programmes",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 programme",
    description,
  },
};

/** Keeps the dark hero band visually continuous if the client shell is still loading. */
function ProgrammeClientFallback() {
  return (
    <div
      className="min-h-[120px] bg-gtp-dark-teal"
      aria-busy
      aria-label="Loading programme"
    />
  );
}

export default function ProgrammesPage() {
  return (
    <>
      <ProgrammesHero />
      <Suspense fallback={<ProgrammeClientFallback />}>
        <ProgrammesPageClient />
      </Suspense>
    </>
  );
}
