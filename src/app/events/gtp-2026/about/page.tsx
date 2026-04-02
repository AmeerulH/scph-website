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
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { GtpHeroGradient } from "@/components/gtp/hero-gradient";
import { GtpCountdown } from "@/components/gtp/countdown";
import { GtpEventsPreviewCarousel } from "@/components/gtp/events-preview-carousel";
import { ContactForm } from "@/app/events/gtp-2026/get-involved/contact-form";
import { GtpSiteExploreCardsGrid } from "@/components/gtp/gtp-site-explore-cards";
import { GtpSpeakersHighlightInner } from "@/components/gtp/gtp-speaker-highlight";
import { cn } from "@/lib/utils";

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
        <div>
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
              className="font-medium text-gtp-teal hover:underline"
            >
              global-tipping-points.org
            </a>
          </p>

          <blockquote className="mt-8 rounded-2xl bg-gtp-teal/10 p-6 ring-1 ring-gtp-teal/20">
            <Quote className="mb-3 h-6 w-6 text-gtp-teal/50" />
            <p className="font-heading text-lg font-semibold italic leading-snug text-gtp-dark-teal">
              &ldquo;Systems that once seemed immovable can suddenly
              shift.&rdquo;
            </p>
          </blockquote>
        </div>

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

      <GtpSiteExploreCardsGrid />
    </SectionWrapper>
  );
}

// ─── About Conference ─────────────────────────────────────────────────────────

function WhyItMattersSection() {
  return (
    <SectionWrapper
      title="The Idea behind Global Tipping Points Conference 2026"
      subtitle="Why This Meeting Matters"
      theme="gtp"
      background="dark"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="text-lg leading-relaxed text-white/80">
            The world is approaching decisions that will shape lives, economies
            and ecosystems for generations. Climate change is no longer a
            distant risk; its impacts are already visible in food systems,
            health, cities and financial stability.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Yet the future is not fixed. Research on tipping points shows that
            when leadership, investment and public confidence align, change can
            accelerate rapidly and systems that once seemed immovable can shift.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Global Tipping Points Conference 2026 (GTP 2026) focuses on where
            that momentum can be unlocked. Hosted in Asia for the first time,
            the meeting brings together leaders from science, finance, culture
            and policy in a region where climate risks are intensifying but
            where many of the solutions are already emerging at scale.
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
    body: "Clarifying what is changing in the world today, including climate and nature risks, as well as social and economic pressures that affect health, food security and stability.",
    cardClass: "bg-gtp-dark-teal text-white ring-white/10",
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Igniting Imagination",
    body: "Exploring how culture, faith, creativity and moral leadership help people, communities and institutions transition into reformation.",
    cardClass: "bg-gtp-teal text-white ring-white/10",
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  },
  {
    num: "03",
    icon: Zap,
    title: "Accelerating Action",
    body: "Identifying what policies, investments and partnerships can reinforce each other and create lasting momentum.",
    cardClass: "bg-gtp-dark-green text-white ring-white/10",
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
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
      <StaggerReveal
        className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-3"
        itemClassName="w-full min-w-0 flex-1 basis-0 md:flex-[1_1_0%] md:transition-[flex-grow] md:duration-500 md:ease-in-out md:hover:flex-grow-[1.45]"
      >
        {themes.map(
          ({
            num,
            icon: Icon,
            title,
            body,
            cardClass,
            iconWrap,
            iconColour,
            bodyClass,
            numClass,
            titleClass,
          }) => (
            <div
              key={num}
              className={`flex h-full min-h-[280px] w-full flex-col rounded-2xl p-6 shadow-md ring-1 md:min-h-[320px] ${cardClass}`}
            >
              <div className="mb-5 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconWrap}`}
                >
                  <Icon className={`h-6 w-6 ${iconColour}`} />
                </div>
                <span
                  className={`font-heading text-sm font-bold ${numClass}`}
                >
                  {num}
                </span>
              </div>
              <h3
                className={`font-heading text-xl font-bold ${titleClass}`}
              >
                {title}
              </h3>
              <p
                className={`mt-3 flex-1 text-sm leading-relaxed ${bodyClass}`}
              >
                {body}
              </p>
            </div>
          ),
        )}
      </StaggerReveal>
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-gray-500">
        The conference is designed for leaders who want clarity, confidence that
        they are not alone, and credible pathways forward.
      </p>
    </SectionWrapper>
  );
}

// ─── Speaker Highlights ───────────────────────────────────────────────────────

function SpeakersSection() {
  return (
    <SectionWrapper
      title="Speakers Highlights"
      subtitle="Our Speakers"
      theme="gtp"
      background="default"
    >
      <GtpSpeakersHighlightInner staggerVariant="long" />
    </SectionWrapper>
  );
}

// ─── Event inquiry (above sponsors) ───────────────────────────────────────────

function EventInquirySection() {
  return (
    <SectionWrapper
      title="Questions about the event?"
      subtitle="Get in touch"
      theme="gtp"
      background="default"
      id="event-inquiry"
    >
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-gray-50/80 p-6 shadow-sm md:p-8">
        <p className="mb-6 text-center text-sm leading-relaxed text-gray-600">
          Send us a message about registration, programme details, or general
          enquiries. We&apos;ll respond as soon as we can.
        </p>
        <ContactForm />
      </div>
    </SectionWrapper>
  );
}

// ─── Sponsors & Partners ──────────────────────────────────────────────────────

function SponsorLogoPlaceholder() {
  return (
    <div className="mr-4 flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
      <span className="text-xs font-medium text-gray-400">Partner Logo</span>
    </div>
  );
}

function PikPartnerLogo() {
  return (
    <a
      href="https://www.pik-potsdam.de/"
      target="_blank"
      rel="noopener noreferrer"
      className="mr-4 flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm transition-opacity hover:opacity-90"
      aria-label="Potsdam Institute for Climate Impact Research (opens in new tab)"
    >
      <Image
        src="/images/gtp/logos/pik-logo.png"
        alt="Potsdam Institute for Climate Impact Research (PIK)"
        width={160}
        height={56}
        className="h-11 w-auto max-w-[10rem] object-contain"
      />
    </a>
  );
}

const sponsorRowSlots = [
  "pik",
  ...Array.from({ length: 7 }, (_, i) => `ph-${i}`),
] as const;

function SponsorsSection() {
  return (
    <SectionWrapper
      title="Building a Global Coalition"
      subtitle="Our Sponsors & Partners"
      theme="gtp"
      background="default"
    >
      {/*
        Vertical padding so card shadows aren’t clipped by overflow-hidden (needed for horizontal mask).
      */}
      <div className="overflow-hidden px-1 py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:py-4">
        <div className="mb-5 flex w-max animate-marquee will-change-transform">
          {sponsorRowSlots.map((id) =>
            id === "pik" ? (
              <PikPartnerLogo key={`r1a-${id}`} />
            ) : (
              <SponsorLogoPlaceholder key={`r1a-${id}`} />
            ),
          )}
          {sponsorRowSlots.map((id) =>
            id === "pik" ? (
              <PikPartnerLogo key={`r1b-${id}`} />
            ) : (
              <SponsorLogoPlaceholder key={`r1b-${id}`} />
            ),
          )}
        </div>
        <div className="flex w-max animate-marquee-reverse will-change-transform">
          {sponsorRowSlots.map((id) =>
            id === "pik" ? (
              <PikPartnerLogo key={`r2a-${id}`} />
            ) : (
              <SponsorLogoPlaceholder key={`r2a-${id}`} />
            ),
          )}
          {sponsorRowSlots.map((id) =>
            id === "pik" ? (
              <PikPartnerLogo key={`r2b-${id}`} />
            ) : (
              <SponsorLogoPlaceholder key={`r2b-${id}`} />
            ),
          )}
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

// Each bento group is a fixed-height flex item; groups vary in width & layout.
// Height anchor: h-72 (288 px).
// The strip renders two identical copies wrapped in their own shrink-0 flex
// containers so the browser measures each copy as one concrete element.
// translateX(-50%) then equals EXACTLY one copy's width → seamless loop.

function GalleryImg({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 hover:scale-105"
      sizes={sizes}
    />
  );
}

function BentoGroups() {
  return (
    // Each group has mr-3 so the gap at the seam after each loop iteration
    // matches the gap between groups within a copy.
    <div className="flex h-72 shrink-0">
      {/* 1 — Main Photo: wide single */}
      <div className="relative mr-3 h-72 w-120 shrink-0 overflow-hidden rounded-2xl">
        <GalleryImg src="/images/gtp/gtp-2025/main-photo.avif" alt="GTP 2025 — Group Photo" sizes="480px" />
      </div>

      {/* 2 — tall-left + 2 stacked-right */}
      <div className="mr-3 flex h-72 w-85 shrink-0 gap-2">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <GalleryImg src="/images/gtp/gtp-2025/preview-004.avif" alt="GTP 2025 session" sizes="168px" />
        </div>
        <div className="flex w-40 flex-col gap-2">
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <GalleryImg src="/images/gtp/gtp-2025/networking.avif" alt="Networking" sizes="160px" />
          </div>
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <GalleryImg src="/images/gtp/gtp-2025/conf-7.avif" alt="Conference session" sizes="160px" />
          </div>
        </div>
      </div>

      {/* 3 — wide single */}
      <div className="relative mr-3 h-72 w-105 shrink-0 overflow-hidden rounded-2xl">
        <GalleryImg src="/images/gtp/gtp-2025/games-on-lawn.avif" alt="Outdoor activities" sizes="420px" />
      </div>

      {/* 4 — 2×2 grid */}
      <div className="mr-3 grid h-72 w-85 shrink-0 grid-cols-2 grid-rows-2 gap-2">
        <div className="relative overflow-hidden rounded-2xl">
          <GalleryImg src="/images/gtp/gtp-2025/conf-4.avif" alt="Conference session" sizes="168px" />
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <GalleryImg src="/images/gtp/gtp-2025/preview-117.avif" alt="GTP 2025 preview" sizes="168px" />
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <GalleryImg src="/images/gtp/gtp-2025/conf-15.jpg" alt="Conference session" sizes="168px" />
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <GalleryImg src="/images/gtp/gtp-2025/conf-9.avif" alt="Conference session" sizes="168px" />
        </div>
      </div>

      {/* 5 — tall-left + 2 stacked-right */}
      <div className="mr-3 flex h-72 w-85 shrink-0 gap-2">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <GalleryImg src="/images/gtp/gtp-2025/workshop.avif" alt="Workshop" sizes="168px" />
        </div>
        <div className="flex w-40 flex-col gap-2">
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <GalleryImg src="/images/gtp/gtp-2025/conf-18.jpg" alt="Conference session" sizes="160px" />
          </div>
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <GalleryImg src="/images/gtp/gtp-2025/conf-5.avif" alt="Conference session" sizes="160px" />
          </div>
        </div>
      </div>

      {/* 6 — wide single */}
      <div className="relative mr-3 h-72 w-105 shrink-0 overflow-hidden rounded-2xl">
        <GalleryImg src="/images/gtp/gtp-2025/preview-092.avif" alt="GTP 2025 preview" sizes="420px" />
      </div>

      {/* 7 — side-by-side equal */}
      <div className="mr-3 flex h-72 w-95 shrink-0 gap-2">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <GalleryImg src="/images/gtp/gtp-2025/preview-106.avif" alt="GTP 2025 preview" sizes="188px" />
        </div>
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <GalleryImg src="/images/gtp/gtp-2025/conf-12.avif" alt="Conference session" sizes="188px" />
        </div>
      </div>
    </div>
  );
}

function GalleryBentoStrip() {
  return (
    // overflow-hidden clips the scrolling strip; the fade mask softens edges.
    // The animated div holds TWO BentoGroups wrappers of equal width W.
    // translateX(-50%) = translateX(-W), snapping back to translateX(0) which
    // looks identical → perfectly seamless infinite loop.
    <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="flex w-max animate-marquee will-change-transform">
        <BentoGroups />
        <BentoGroups />
      </div>
    </div>
  );
}

function GallerySection() {
  return (
    <SectionWrapper
      title="Moments That Matter"
      subtitle="Our Gallery"
      theme="gtp"
      background="muted"
    >
      <GalleryBentoStrip />

      <p className="mt-6 text-center text-sm text-gray-400">
        Photos from GTP 2025.{" "}
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
    quote: "The Global Tipping Points Conference 2026 is a great opportunity for a bunch of us to come together as businesses, as thinkers, as policymakers, both to wrestle down the incredible risks we're running in crossing tipping points in the Earth system—our life support system—but also how can we together seize the positive tipping point opportunities to accelerate us out of trouble and into a healthier, happier, flourishing future together.",
    hasPhoto: true,
    photoSrc: "/images/gtp/co-chairs/tim-lenton.jpg",
    /** Fine-tune face in circular crop (object-fit: cover) */
    avatarObjectClass: "object-[50%_38%]",
  },
  {
    name: "Johan Rockström",
    designation: "Co-Chair · Director, Potsdam Institute for Climate Impact Research",
    quote: "Scientifically, we know we are moving towards profound challenges and risks at the planetary scale, with an increasing risk of tipping points in the Earth system. Against this backdrop, the Malaysian Global Tipping Point Conference offers a crucial forum to examine how positive societal tipping points can help build more equitable, stable and resilient societies.",
    hasPhoto: true,
    photoSrc: "/images/gtp/co-chairs/johan-rockstrom.jpg",
    avatarObjectClass: "object-[50%_22%]",
    avatarScaleClass: "scale-[1.35] origin-[50%_28%]",
  },
  {
    name: "Jemilah Mahmood",
    designation: "Co-Chair · Executive Director, Sunway Centre for Planetary Health, Sunway University",
    quote: "This year, the Sunway Centre for Planetary Health will proudly host the Global Tipping Points Conference at Sunway University, the first in Asia. Together, scientists, policymakers, business leaders, civil society, Indigenous voices, artists, and youth will unite to spotlight South and Southeast Asia's lived realities and accelerate the positive tipping points we need for a healthier planet and future. Join us in Sunway this October and we will see you there! Follow us on @sunwaycph to find out more!",
    hasPhoto: true,
    photoSrc: "/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.jpg",
    avatarObjectClass: "object-[50%_40%]",
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
      <StaggerReveal
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-4 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-x-visible md:px-0 md:pb-0"
      >
        {coChairQuotes.map(
          ({
            name,
            designation,
            quote,
            hasPhoto,
            photoSrc,
            avatarObjectClass,
            avatarScaleClass,
          }) => (
          <div
            key={name}
            className="w-[85vw] max-w-[85vw] flex-shrink-0 snap-center flex min-h-[320px] flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:w-auto md:max-w-none"
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
                    className={cn(
                      "object-cover",
                      avatarObjectClass ?? "object-center",
                      avatarScaleClass,
                    )}
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
      </StaggerReveal>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GtpAboutPage() {
  return (
    <>
      {/* Single gradient wrapper — hero, countdown and carousel share one continuous background */}
      <div className="relative overflow-hidden bg-linear-to-br from-gtp-dark-teal via-[#0a6070] to-gtp-dark-teal">
        {/* Shared dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Shared radial glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_30%,rgba(0,156,180,0.30),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_60%,rgba(134,188,37,0.13),transparent_48%)]" />
        <GtpHeroGradient />
        <GtpCountdown />
        <GtpEventsPreviewCarousel />
      </div>
      <WhatIsGtpSection />
      <WhyItMattersSection />
      <ThemesSection />
      <SpeakersSection />
      <QuoteSection />
      <GallerySection />
      <EventInquirySection />
      <SponsorsSection />
    </>
  );
}
