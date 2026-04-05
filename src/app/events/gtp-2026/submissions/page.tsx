import type { Metadata } from "next";
import {
  getGtp2026SubmissionsPage,
  mergeGtpSubmissionsCopy,
} from "@/sanity/gtp-stage2";
import { GtpSubmissionsPageClient } from "./submissions-page-client";

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

export const dynamic = "force-dynamic";

export default async function GtpSubmissionsPage() {
  const cms = await getGtp2026SubmissionsPage().catch(() => null);
  const copy = mergeGtpSubmissionsCopy(cms);
  return <GtpSubmissionsPageClient copy={copy} />;
}
