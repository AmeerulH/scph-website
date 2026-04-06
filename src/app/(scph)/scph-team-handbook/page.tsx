import type { Metadata } from "next";
import { TeamHandbookContent } from "@/components/scph/team-handbook/team-handbook-content";

/**
 * Internal team handbook: design system + Sanity CMS guide.
 * Not linked from the navbar—share URL only with editors.
 * @see /scph-team-handbook
 */
export const metadata: Metadata = {
  title: "Team handbook (internal)",
  description:
    "Internal SCPH + GTP 2026 design reference and Sanity CMS editing guide for the content team.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/scph-team-handbook" },
};

export default function ScphTeamHandbookPage() {
  return <TeamHandbookContent />;
}
