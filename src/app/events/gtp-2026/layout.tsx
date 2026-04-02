import type { Metadata } from "next";
import { GtpNavbar } from "@/components/gtp/navbar";
import { GtpFooter } from "@/components/gtp/footer";
import { AtmosphericReveal } from "@/components/motion/AtmosphericReveal";

export const metadata: Metadata = {
  title: {
    default: "Global Tipping Points Conference 2026 | GTP 2026",
    template: "%s | GTP 2026",
  },
  description:
    "12–15 October 2026 · Kuala Lumpur, Malaysia. Science, finance, culture and policy for positive tipping points — hosted by Sunway Centre for Planetary Health.",
  openGraph: {
    title: "Global Tipping Points Conference 2026",
    description:
      "Join us in Kuala Lumpur for GTP 2026 — crossing thresholds for a thriving planet.",
    type: "website",
  },
};

export default function GtpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GtpNavbar />
      {/*
        Footer is outside <main>. Reserve minimum height so the footer does not sit
        directly under the nav while the route streams in (CLS). Use GTP base colour so
        this area is not a blank white band before the hero paints.
      */}
      <main className="min-h-[52dvh] bg-gtp-dark-teal">
        <AtmosphericReveal disableEntrance>
          {children}
        </AtmosphericReveal>
      </main>
      <GtpFooter />
    </>
  );
}
