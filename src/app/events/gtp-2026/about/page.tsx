import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TrendingDown,
  Lightbulb,
  Zap,
  Download,
  Quote,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { GtpHeroCarousel } from "@/components/gtp/hero-carousel";

// ─── About GTP (New Reality) ──────────────────────────────────────────────────

function WhatIsGtpSection() {
  return (
    <SectionWrapper
      title="What are Global Tipping Points"
      subtitle="New Reality"
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
          <p className="mt-4 text-sm text-gray-400">
            To learn more about Global Tipping Points, visit{" "}
            <a
              href="https://global-tipping-points.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gtp-teal hover:underline"
            >
              global-tipping-points.org
            </a>
          </p>

          {/* Pull quote */}
          <blockquote className="mt-8 rounded-2xl bg-gtp-teal/10 p-6 ring-1 ring-gtp-teal/20">
            <Quote className="mb-3 h-6 w-6 text-gtp-teal/50" />
            <p className="font-heading text-lg font-semibold italic leading-snug text-gtp-dark-teal">
              &ldquo;Systems that once seemed immovable can suddenly
              shift.&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Right — GTP 2025 Report Cover + download */}
        <div className="flex flex-col items-center gap-5">
          <div className="mx-auto w-full max-w-[200px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-gtp-dark-teal/10">
            <Image
              src="/images/gtp/report-cover.avif"
              alt="Global Tipping Points 2025 Report Cover"
              width={200}
              height={266}
              className="h-auto w-full object-cover"
            />
          </div>
          <Button variant="gtpSecondary" size="default" asChild>
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
      </div>
    </SectionWrapper>
  );
}

// ─── About Conference ─────────────────────────────────────────────────────────

function WhyItMattersSection() {
  return (
    <SectionWrapper
      title="The Idea behind Global Tipping Points 2026"
      subtitle="Why This Meeting Matters"
      theme="gtp"
      background="dark"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
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
              Explore the Programme <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Right — bento photo grid using stock images */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          <div className="relative row-span-2 min-h-[280px] overflow-hidden rounded-2xl">
            <Image
              src="/images/gtp/conference/leaves.jpg"
              alt="Nature and sustainability"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/gtp/conference/river.jpg"
              alt="River ecosystem"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/gtp/conference/solar.jpg"
              alt="Solar energy transition"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Conference Themes ────────────────────────────────────────────────────────

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
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-gray-500">
        The conference is designed for leaders who want clarity, confidence that
        they are not alone, and credible pathways forward.
      </p>
    </SectionWrapper>
  );
}

// ─── Sponsors & Partners ──────────────────────────────────────────────────────

const partnerPlaceholders = Array.from({ length: 8 }, (_, i) => i + 1);

function SponsorLogoItem() {
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
      subtitle="Our Sponsors & Partners"
      theme="gtp"
      background="default"
    >
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="mb-4 flex animate-marquee will-change-transform">
          {partnerPlaceholders.map((n) => (
            <SponsorLogoItem key={`r1a-${n}`} />
          ))}
          {partnerPlaceholders.map((n) => (
            <SponsorLogoItem key={`r1b-${n}`} />
          ))}
        </div>
        <div className="flex animate-marquee-reverse will-change-transform">
          {partnerPlaceholders.map((n) => (
            <SponsorLogoItem key={`r2a-${n}`} />
          ))}
          {partnerPlaceholders.map((n) => (
            <SponsorLogoItem key={`r2b-${n}`} />
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        Partner and sponsor logos coming soon. Interested in partnering?{" "}
        <Link
          href="/events/gtp-2026/get-involved#partnership"
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
      subtitle="Our Gallery"
      theme="gtp"
      background="muted"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="col-span-2 aspect-[16/7] rounded-2xl bg-gtp-dark-teal/8 ring-1 ring-gtp-dark-teal/15 flex items-center justify-center md:col-span-2">
          <span className="text-xs font-medium text-gtp-dark-teal/30">
            Photos coming soon
          </span>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl bg-gtp-dark-teal/8 ring-1 ring-gtp-dark-teal/15 flex items-center justify-center"
          >
            <span className="text-xs font-medium text-gtp-dark-teal/30">
              Photo
            </span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-gray-400">
        Photos from the conference will be added here.{" "}
        <Link
          href="/events/gtp-2026/media"
          className="font-semibold text-gtp-dark-teal hover:underline"
        >
          See more →
        </Link>
      </p>
    </SectionWrapper>
  );
}

// ─── Quote Section ────────────────────────────────────────────────────────────

const coChairQuotes = [
  {
    name: "Tim Lenton",
    designation: "Co-Chair · Founding Director, Global Systems Institute, University of Exeter",
    quote: "TBC — Quote by Tim Lenton will be provided separately.",
    hasPhoto: false,
  },
  {
    name: "Johan Rockström",
    designation: "Co-Chair · Director, Potsdam Institute for Climate Impact Research",
    quote: "TBC — Quote by Johan Rockström will be provided separately.",
    hasPhoto: false,
  },
  {
    name: "Jemilah Mahmood",
    designation: "Co-Chair · Executive Director, Sunway Centre for Planetary Health, Sunway University",
    quote: "TBC — Quote by Jemilah Mahmood will be provided separately.",
    hasPhoto: true,
    photoSrc: "/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.jpg",
  },
];

function QuoteSection() {
  return (
    <SectionWrapper
      title="Words from Our Co-Chairs"
      subtitle="Leadership Voices"
      theme="gtp"
      background="dark"
    >
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0">
        {coChairQuotes.map(({ name, designation, quote, hasPhoto, photoSrc }) => (
          <div
            key={name}
            className="w-[85vw] max-w-[85vw] flex-shrink-0 snap-center flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:w-auto md:max-w-none"
          >
            {/* Quote icon */}
            <Quote className="mb-4 h-8 w-8 shrink-0 text-gtp-teal/60" />

            {/* Quote text */}
            <p className="flex-1 font-heading text-base font-semibold italic leading-relaxed text-white/90">
              &ldquo;{quote}&rdquo;
            </p>

            {/* Attribution */}
            <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-5">
              {hasPhoto && photoSrc ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-gtp-teal/30">
                  <Image
                    src={photoSrc}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gtp-teal/10 ring-2 ring-gtp-teal/20">
                  <UserCircle2 className="h-8 w-8 text-gtp-teal/40" />
                </div>
              )}
              <div>
                <p className="font-heading text-sm font-bold text-white">
                  {name}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                  {designation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
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
      <QuoteSection />
    </>
  );
}
