import type { Metadata } from "next";
import { ScphNavbar } from "@/components/scph/navbar";
import { ScphFooter } from "@/components/scph/footer";
import { AtmosphericReveal } from "@/components/motion/AtmosphericReveal";

export const metadata: Metadata = {
  title: {
    default: "Sunway Centre for Planetary Health",
    template: "%s | Sunway Centre for Planetary Health",
  },
};

export default function ScphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScphNavbar />
      <main>
        <AtmosphericReveal>{children}</AtmosphericReveal>
      </main>
      <ScphFooter />
    </>
  );
}
