import type { Metadata } from "next";
import { Suspense } from "react";
import { ProgrammesHero } from "@/components/gtp/programmes/programmes-hero";
import { getGtp2026Programme } from "@/sanity/queries";
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

/** Refetch programme from Sanity on every request (no ISR cache). */
export const revalidate = 60;

/**
 * Approximates the client programme shell layout so the Suspense swap does not
 * collapse then expand the page (CLS). Mirrors sticky tab strip + `min-h-screen`
 * slate section from `programmes-page-client.tsx`.
 */
function ProgrammeClientFallback() {
  return (
    <div aria-busy aria-label="Loading programme">
      <div className="sticky top-18 z-40">
        <div className="flex items-center justify-center gap-3 px-4 py-3">
          <div className="flex gap-1 rounded-full border border-white/10 bg-gtp-dark-teal/50 p-1.5 shadow-lg backdrop-blur-xl [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="h-9 w-14 shrink-0 rounded-full bg-white/15 sm:w-20"
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gtp-teal/25 bg-white px-8 py-16 shadow-sm md:py-20">
            <div className="mx-auto flex max-w-md flex-col items-center">
              <div
                className="h-14 w-14 shrink-0 rounded-2xl bg-gtp-teal/10"
                aria-hidden
              />
              <div
                className="mt-6 h-7 w-56 rounded-lg bg-gray-200/90 sm:w-72"
                aria-hidden
              />
              <div className="mt-5 w-full space-y-2.5">
                <div className="h-3.5 w-full rounded bg-gray-100" aria-hidden />
                <div className="h-3.5 w-full rounded bg-gray-100" aria-hidden />
                <div className="mx-auto h-3.5 w-4/5 rounded bg-gray-100" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgrammesPage() {
  return (
    <>
      <ProgrammesHero />
      <Suspense fallback={<ProgrammeClientFallback />}>
        <ProgrammesPageData />
      </Suspense>
    </>
  );
}

async function ProgrammesPageData() {
  const programme = await getGtp2026Programme();
  return (
    <ProgrammesPageClient
      tabs={programme.tabs}
      sessionModalHostedBy={programme.sessionModalHostedBy}
      day1={programme.day1}
      day2={programme.day2}
      day3={programme.day3}
      day4={programme.day4}
    />
  );
}
