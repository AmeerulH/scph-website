import type { Metadata } from "next";
import type { ReactNode } from "react";

const description =
  "Submit an abstract or action workshop proposal for Global Tipping Points Conference 2026 in Kuala Lumpur—hosted by Sunway Centre for Planetary Health.";

export const metadata: Metadata = {
  title: "Abstract and workshop submissions",
  description,
  alternates: { canonical: "/events/gtp-2026/submissions" },
  openGraph: {
    title: "Abstract and workshop submissions | GTP 2026",
    description,
    url: "/events/gtp-2026/submissions",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 submissions",
    description,
  },
};

export default function GtpSubmissionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
