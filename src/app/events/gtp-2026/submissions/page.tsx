import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getGtp2026SubmissionsPage,
  mergeGtpSubmissionsCopy,
  type GtpSubmissionsResolvedCopy,
} from "@/sanity/gtp-stage2";
import { GtpForestHero } from "@/components/sections/heroes";
import { GtpSubmissionsStaticSections } from "./submissions-static";
import { SubmissionsFormsClient } from "./submissions-forms-client";

const description =
  "Submit abstracts and action workshop proposals for Global Tipping Points Conference 2026—oral, poster, and programme contributions in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Submissions",
  description,
  alternates: { canonical: "/events/gtp-2026/submissions" },
  openGraph: {
    title: "Submissions | GTP 2026",
    description,
    url: "/events/gtp-2026/submissions",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 submissions",
    description,
  },
};

export const revalidate = 60;

function GtpSubmissionsPageView({ copy }: { copy: GtpSubmissionsResolvedCopy }) {
  return (
    <>
      <GtpForestHero
        title={copy.heroTitle}
        lede={copy.heroLede}
        titleSize={copy.heroTitleSize}
      />
      <GtpSubmissionsStaticSections copy={copy} />
      <SubmissionsFormsClient copy={copy} />
    </>
  );
}

async function GtpSubmissionsLoaded() {
  const cms = await getGtp2026SubmissionsPage().catch(() => null);
  const copy = mergeGtpSubmissionsCopy(cms);
  return <GtpSubmissionsPageView copy={copy} />;
}

export default function GtpSubmissionsPage() {
  return (
    <Suspense
      fallback={
        <GtpSubmissionsPageView copy={mergeGtpSubmissionsCopy(null)} />
      }
    >
      <GtpSubmissionsLoaded />
    </Suspense>
  );
}
