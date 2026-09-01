import type { Metadata } from "next";
import { ScphSiteChrome } from "@/components/scph/scph-site-chrome";
import { ScphFooter } from "@/components/scph/footer";
import { AtmosphericReveal } from "@/components/motion/AtmosphericReveal";
import { getMergedScphFooter } from "@/sanity/footer";

export const metadata: Metadata = {
  title: {
    default: "Sunway Centre for Planetary Health",
    template: "%s | Sunway Centre for Planetary Health",
  },
};

export default async function ScphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getMergedScphFooter();

  return (
    <ScphSiteChrome footer={<ScphFooter data={footerData} />}>
      <AtmosphericReveal disableEntrance>{children}</AtmosphericReveal>
    </ScphSiteChrome>
  );
}
