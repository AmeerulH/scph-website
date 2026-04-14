import type { Metadata } from "next";
import { SCPH_JOURNALIST_WORKSHOPS_PLACEHOLDER_DESCRIPTION } from "@/data/scph-placeholder-pages-defaults";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export const metadata: Metadata = {
  title: "Journalist workshops",
  description:
    "Sunway Centre for Planetary Health journalist workshops — page under construction.",
  alternates: { canonical: "/network/journalist-workshops" },
  openGraph: {
    title: "Journalist workshops | Sunway Centre for Planetary Health",
    description:
      "Sunway Centre for Planetary Health journalist workshops — page under construction.",
    url: "/network/journalist-workshops",
  },
};

export const revalidate = 300;

export default function JournalistWorkshopsPage() {
  return (
    <>
      <div className="pt-24" />
      <PlaceholderPage
        title="Journalist workshops"
        description={SCPH_JOURNALIST_WORKSHOPS_PLACEHOLDER_DESCRIPTION}
        theme="scph"
      />
    </>
  );
}
