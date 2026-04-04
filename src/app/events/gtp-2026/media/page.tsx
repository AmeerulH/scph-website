import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

const description =
  "Media resources and press information for Global Tipping Points Conference 2026, hosted by Sunway Centre for Planetary Health in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Media",
  description,
  alternates: { canonical: "/events/gtp-2026/media" },
  openGraph: {
    title: "Media | GTP 2026",
    description,
    url: "/events/gtp-2026/media",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 media",
    description,
  },
};

export default function GtpMediaPage() {
  return <PlaceholderPage title="Media" theme="gtp" />;
}
