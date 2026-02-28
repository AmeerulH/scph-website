import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TrendingDown,
  Lightbulb,
  Zap,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { GtpHeroCarousel } from "@/components/gtp/hero-carousel";

// ─── What is Global Tipping Points ───────────────────────────────────────────

function WhatIsGtpSection() {
  return (
    <SectionWrapper
      title="What are Global Tipping Points?"
      subtitle="About GTP 2026"
      theme="gtp"
      background="default"
      id="about"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        {/* Left — text */}
        <div>
          <p className="text-lg leading-relaxed text-gray-600">
            The world is approaching a set of unavoidable decisions that will
            shape lives, economies and ecosystems for generations. Climate
            change is no longer a distant risk. Its impacts are already visible
            in food systems, health, cities and financial stability.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            What is less widely understood is that the future is not fixed.
            Research on tipping points shows that when the right mix of
            leadership, investment and public confidence comes together, change
            can accelerate very quickly.
          </p>
        </div>

        {/* Right — GTP logo + pull quote */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center rounded-2xl bg-gtp-dark-teal/5 p-8 ring-1 ring-gtp-dark-teal/10">
            <Image
              src="/images/gtp/logo.png"
              alt="Global Tipping Points 2026"
              width={200}
              height={80}
              className="h-auto w-48 object-contain"
            />
          </div>
          <blockquote className="rounded-2xl bg-gtp-teal/10 p-6 ring-1 ring-gtp-teal/20">
            <p className="font-heading text-lg font-semibold italic leading-snug text-gtp-dark-teal">
              &ldquo;Systems that once seemed immovable can suddenly
              shift.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Placeholder block helper ─────────────────────────────────────────────────

function ImgPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 ${className ?? ""}`}
    >
      <ImageIcon className="h-8 w-8 text-white/25" />
    </div>
  );
}

// ─── Why This Conference Matters ─────────────────────────────────────────────

function WhyItMattersSection() {
  return (
    <SectionWrapper
      title="Designed for This Moment"
      subtitle="Why It Matters"
      theme="gtp"
      background="dark"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — text */}
        <div>
          <p className="text-lg leading-relaxed text-white/80">
            The Global Tipping Points 2026 meeting is not about repeating
            warnings. It is about identifying where progress can move fastest,
            and how leaders can help unlock that momentum.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Hosted in Asia, the meeting brings together science, finance,
            culture and policy from a region already shaping the next phase of
            global growth.
          </p>
          <Button variant="gtpSecondary" size="lg" className="mt-8" asChild>
            <Link href="/events/gtp-2026/programmes">
              Learn About the Programme <ArrowRight />
            </Link>
          </Button>
        </div>

        {/* Right — bento placeholder grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          <ImgPlaceholder className="row-span-2 min-h-[280px]" />
          <ImgPlaceholder className="aspect-[4/3]" />
          <ImgPlaceholder className="aspect-[4/3]" />
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Themes ───────────────────────────────────────────────────────────────────

const themes = [
  {
    num: "01",
    icon: TrendingDown,
    title: "Understanding the Shift",
    body: "We begin by clarifying what is changing in the world today — climate risks, social pressures, and economic shifts that affect health, food security and stability.",
    iconBg: "bg-gtp-dark-teal/10",
    iconColour: "text-gtp-dark-teal",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Igniting Imagination",
    body: "Facts alone do not move societies. This part explores how culture, faith, creativity and moral leadership help people and institutions let go of the old ways.",
    iconBg: "bg-gtp-teal/10",
    iconColour: "text-gtp-teal",
  },
  {
    num: "03",
    icon: Zap,
    title: "Accelerating Action",
    body: "What policies, investments and partnerships can reinforce each other and create lasting momentum toward positive tipping points?",
    iconBg: "bg-gtp-green/15",
    iconColour: "text-gtp-dark-green",
  },
];

function ThemesSection() {
  return (
    <SectionWrapper
      title="Three Pathways to Change"
      subtitle="Conference Themes"
      theme="gtp"
      background="muted"
    >
      {/* Mobile: horizontal swipe carousel / Desktop: 3-col grid */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0">
        {themes.map(({ num, icon: Icon, title, body, iconBg, iconColour }) => (
          <div
            key={num}
            className="w-[85vw] max-w-[85vw] flex-shrink-0 snap-center flex flex-col rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto md:max-w-none"
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
              >
                <Icon className={`h-6 w-6 ${iconColour}`} />
              </div>
              <span className="font-heading text-sm font-bold text-gray-300">
                {num}
              </span>
            </div>
            <h3 className="font-heading text-xl font-bold text-gtp-dark-teal">
              {title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
              {body}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── Sponsors & Partners ──────────────────────────────────────────────────────

const partnerPlaceholders = Array.from({ length: 8 }, (_, i) => i + 1);

function SponsorLogoItem({ n }: { n: number }) {
  return (
    <div className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 mr-4">
      <span className="text-xs font-medium text-gray-400">Partner Logo</span>
    </div>
  );
}

function SponsorsSection() {
  return (
    <SectionWrapper
      title="Building a Global Coalition"
      subtitle="Sponsors & Partners"
      theme="gtp"
      background="default"
    >
      {/* Infinite 2-row marquee ticker */}
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Row 1 — scrolls left */}
        <div className="mb-4 flex animate-marquee will-change-transform">
          {partnerPlaceholders.map((n) => (
            <SponsorLogoItem key={`r1a-${n}`} n={n} />
          ))}
          {partnerPlaceholders.map((n) => (
            <SponsorLogoItem key={`r1b-${n}`} n={n} />
          ))}
        </div>
        {/* Row 2 — scrolls right */}
        <div className="flex animate-marquee-reverse will-change-transform">
          {partnerPlaceholders.map((n) => (
            <SponsorLogoItem key={`r2a-${n}`} n={n} />
          ))}
          {partnerPlaceholders.map((n) => (
            <SponsorLogoItem key={`r2b-${n}`} n={n} />
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        Partner and sponsor logos coming soon. Interested in partnering?{" "}
        <Link
          href="/events/gtp-2026/get-involved"
          className="font-semibold text-gtp-dark-teal hover:underline"
        >
          Get in touch →
        </Link>
      </p>
    </SectionWrapper>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function GallerySection() {
  return (
    <SectionWrapper
      title="Moments That Matter"
      subtitle="Gallery"
      theme="gtp"
      background="muted"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {/* First placeholder spans 2 columns */}
        <div className="col-span-2 aspect-[16/7] rounded-2xl bg-gtp-dark-teal/8 ring-1 ring-gtp-dark-teal/15 flex items-center justify-center md:col-span-2">
          <ImageIcon className="h-10 w-10 text-gtp-dark-teal/25" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl bg-gtp-dark-teal/8 ring-1 ring-gtp-dark-teal/15 flex items-center justify-center"
          >
            <ImageIcon className="h-7 w-7 text-gtp-dark-teal/25" />
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-gray-400">
        Photos from the conference will be added here.
      </p>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GtpAboutPage() {
  return (
    <>
      <GtpHeroCarousel />
      <WhatIsGtpSection />
      <WhyItMattersSection />
      <ThemesSection />
      <SponsorsSection />
      <GallerySection />
    </>
  );
}
