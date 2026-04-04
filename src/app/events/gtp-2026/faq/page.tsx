import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

const description =
  "Frequently asked questions about Global Tipping Points Conference 2026 in Kuala Lumpur—travel, registration, and the programme.";

export const metadata: Metadata = {
  title: "FAQ",
  description,
  alternates: { canonical: "/events/gtp-2026/faq" },
  openGraph: {
    title: "FAQ | GTP 2026",
    description,
    url: "/events/gtp-2026/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 FAQ",
    description,
  },
};

export default function GtpFaqPage() {
  return <PlaceholderPage title="FAQ" theme="gtp" />;
}
