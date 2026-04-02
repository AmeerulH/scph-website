import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { GtpSiteExploreCardsGrid } from "@/components/gtp/gtp-site-explore-cards";
import { ContactForm } from "@/app/events/gtp-2026/get-involved/contact-form";

/** GTP 2026 teaser + same three global-tipping-points.org explore cards as the conference microsite (Phase 3 parity). */
export function Gtp2026HomeSection() {
  return (
    <SectionWrapper
      title="Global Tipping Points Conference 2026"
      subtitle="Why This Meeting Matters"
      theme="scph"
      background="muted"
      id="gtp-2026"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-scph-blue">
          New Reality
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          The world is approaching decisions that will shape lives, economies
          and ecosystems for generations. Climate change is no longer a
          distant risk; its impacts are already visible in food systems,
          health, cities and financial stability.
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Yet the future is not fixed. Research on tipping points shows that
          when leadership, investment and public confidence align, change can
          accelerate rapidly and systems that once seemed immovable can shift.
          Global Tipping Points Conference 2026 (GTP 2026) focuses on where
          that momentum can be unlocked. Hosted in Asia for the first time, the
          meeting brings together leaders from science, finance, culture and
          policy in a region where climate risks are intensifying but where many
          of the solutions are already emerging at scale.
        </p>
        <MagneticButton className="mt-8">
          <Button variant="scph" size="lg" asChild>
            <Link href="/events/gtp-2026/about">
              GTP 2026 conference site <ArrowRight />
            </Link>
          </Button>
        </MagneticButton>
      </div>

      <GtpSiteExploreCardsGrid
        className="mt-12 md:mt-14"
        labelClassName="text-scph-blue/70"
      />
    </SectionWrapper>
  );
}

export function Gtp2026HomeEventInquirySection() {
  return (
    <SectionWrapper
      title="Questions about the event?"
      subtitle="Get in touch"
      theme="scph"
      background="default"
      id="gtp-2026-inquiry"
    >
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-gray-50/80 p-6 shadow-sm md:p-8">
        <p className="mb-6 text-center text-sm leading-relaxed text-gray-600">
          Send us a message about registration, programme details, or general
          enquiries for GTP 2026. We&apos;ll respond as soon as we can.
        </p>
        <ContactForm appearance="scph" />
      </div>
    </SectionWrapper>
  );
}
