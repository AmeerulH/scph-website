import type { Metadata } from "next";
import { SCPH_COMMUNITY_HUB_PLACEHOLDER_DESCRIPTION } from "@/data/scph-placeholder-pages-defaults";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export const metadata: Metadata = {
  title: "Community hub",
  description:
    "A new Sunway Centre for Planetary Health community page is on the way.",
  alternates: { canonical: "/network/community-hub" },
  openGraph: {
    title: "Community hub | Sunway Centre for Planetary Health",
    description:
      "A new Sunway Centre for Planetary Health community page is on the way.",
    url: "/network/community-hub",
  },
};

export const revalidate = 300;

export default function CommunityHubPage() {
  return (
    <>
      <div className="pt-24" />
      <PlaceholderPage
        title="Community hub"
        description={SCPH_COMMUNITY_HUB_PLACEHOLDER_DESCRIPTION}
        theme="scph"
      />
    </>
  );
}
