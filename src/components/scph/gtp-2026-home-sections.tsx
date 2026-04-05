import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { GtpSiteExploreCardsGrid } from "@/components/gtp/gtp-site-explore-cards";
import { GtpSpeakersHighlightInner } from "@/components/gtp/gtp-speaker-highlight";
import { ContactForm } from "@/app/events/gtp-2026/get-involved/contact-form";
import { TwoColumnTextImages } from "@/components/sections/two-column-text-images";

/**
 * SCPH home GTP blocks — copy aligned with GTP microsite About:
 * `WhatIsGtpSection` + `WhyItMattersSection` (`about/page.tsx`), then explore cards + CTA.
 */
export function Gtp2026HomeSection() {
  return (
    <>
      <SectionWrapper
        title="What are Global Tipping Points"
        subtitle="New Reality"
        theme="scph"
        background="muted"
        id="gtp-2026"
      >
        <TwoColumnTextImages
          align="start"
          gapClassName="gap-10 lg:gap-12"
          text={
            <>
              <p className="text-lg leading-relaxed text-gray-600">
                The Global Tipping Points initiative, led by Prof. Tim Lenton, is a
                global research and policy effort focused on understanding critical
                thresholds in the Earth system where small changes can trigger
                large, irreversible shifts in climate, ecosystems, and human
                societies.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                It identifies both dangerous and positive tipping points that could
                rapidly accelerate solutions like clean energy adoption or ecosystem
                restoration. The initiative aims to translate cutting-edge science
                into actionable pathways for governments, finance, and society to
                trigger rapid transformations toward a stable climate and a
                healthier planet.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                To learn more about Global Tipping Points, visit{" "}
                <a
                  href="https://global-tipping-points.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-scph-blue hover:underline"
                >
                  global-tipping-points.org
                </a>
              </p>

              <blockquote className="mt-8 rounded-2xl bg-scph-blue/10 p-6 ring-1 ring-scph-blue/20">
                <Quote className="mb-3 h-6 w-6 text-scph-blue/50" />
                <p className="font-heading text-lg font-semibold italic leading-snug text-scph-blue">
                  &ldquo;Systems that once seemed immovable can suddenly
                  shift.&rdquo;
                </p>
              </blockquote>
            </>
          }
          media={
            <div className="flex flex-col items-center gap-5">
              <div className="mx-auto w-full max-w-50 overflow-hidden rounded-2xl shadow-lg ring-1 ring-scph-blue/10">
                <Image
                  src="/images/gtp/report-cover.avif"
                  alt="Global Tipping Points 2025 Report Cover"
                  width={200}
                  height={266}
                  className="h-auto w-full object-cover"
                />
              </div>
              <Button variant="scph" size="default" asChild>
                <a
                  href="https://global-tipping-points.org/download/1418/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download GTP 2025 Report
                </a>
              </Button>
            </div>
          }
        />

        <GtpSiteExploreCardsGrid
          className="mt-12 md:mt-14"
          labelClassName="text-scph-blue/70"
        />
      </SectionWrapper>

      <SectionWrapper
        title="The Idea behind Global Tipping Points Conference 2026"
        subtitle="Why This Meeting Matters"
        theme="scph"
        background="default"
        id="gtp-2026-why"
      >
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-600">
            The world is approaching decisions that will shape lives, economies
            and ecosystems for generations. Climate change is no longer a
            distant risk; its impacts are already visible in food systems,
            health, cities and financial stability.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Yet the future is not fixed. Research on tipping points shows that
            when leadership, investment and public confidence align, change can
            accelerate rapidly and systems that once seemed immovable can shift.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Global Tipping Points Conference 2026 (GTP 2026) focuses on where
            that momentum can be unlocked. Hosted in Asia for the first time, the
            meeting brings together leaders from science, finance, culture and
            policy in a region where climate risks are intensifying but where
            many of the solutions are already emerging at scale.
          </p>
          <MagneticButton className="mt-8">
            <Button variant="scph" size="lg" asChild>
              <Link href="/events/gtp-2026/about" prefetch={false}>
                GTP 2026 conference site <ArrowRight />
              </Link>
            </Button>
          </MagneticButton>
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Speaker Highlights"
        subtitle="Our Speakers"
        theme="scph"
        background="muted"
        id="gtp-2026-speakers"
      >
        <GtpSpeakersHighlightInner staggerVariant="long" />
      </SectionWrapper>
    </>
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
