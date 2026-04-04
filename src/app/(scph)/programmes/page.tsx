import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Programmes and initiatives from Sunway Centre for Planetary Health—education, research, and action for planetary health.",
  alternates: { canonical: "/programmes" },
  openGraph: {
    title: "Programmes | Sunway Centre for Planetary Health",
    description:
      "SCPH programmes advancing planetary health in Malaysia and the region.",
    url: "/programmes",
  },
};

export default function ProgrammesPage() {
  return (
    <PlaceholderPage
      title="Programmes"
      description="Our programmes and initiatives are currently being developed. Check back soon."
      theme="scph"
    />
  );
}
