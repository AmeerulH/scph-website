import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Research and action projects at Sunway Centre for Planetary Health—planetary health impact across priority areas.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Sunway Centre for Planetary Health",
    description:
      "Explore SCPH projects at the intersection of health, climate, and equity.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return <PlaceholderPage title="Projects" theme="scph" />;
}
