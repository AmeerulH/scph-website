import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

const description =
  "Business forum at Global Tipping Points Conference 2026—finance and private sector dialogue for positive tipping points in Kuala Lumpur.";

export const metadata: Metadata = {
  title: "Business forum",
  description,
  alternates: { canonical: "/events/gtp-2026/biz-forum" },
  openGraph: {
    title: "Business forum | GTP 2026",
    description,
    url: "/events/gtp-2026/biz-forum",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 business forum",
    description,
  },
};

export default function BizForumPage() {
  return <PlaceholderPage title="Biz Forum" theme="gtp" />;
}
