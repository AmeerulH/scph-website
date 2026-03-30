"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
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
  X,
  Plus,
  CalendarDays,
  Presentation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
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
    body: "Clarifying what is changing in the world today, including climate and nature risks, as well as social and economic pressures that affect health, food security and stability.",
    iconBg: "bg-gtp-dark-teal/10",
    iconColour: "text-gtp-dark-teal",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Igniting Imagination",
    body: "Exploring how culture, faith, creativity and moral leadership help people, communities and institutions transition into reformation.",
    iconBg: "bg-gtp-teal/10",
    iconColour: "text-gtp-teal",
  },
  {
    num: "03",
    icon: Zap,
    title: "Accelerating Action",
    body: "Identifying what policies, investments and partnerships can reinforce each other and create lasting momentum.",
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
      <StaggerReveal
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-x-visible md:px-0 md:pb-0"
      >
        {themes.map(({ num, icon: Icon, title, body, iconBg, iconColour }) => (
          <div
            key={num}
            className="w-[85vw] max-w-[85vw] flex-shrink-0 snap-center flex min-h-[320px] flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto md:max-w-none"
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
      </StaggerReveal>
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-gray-500">
        The conference is designed for leaders who want clarity, confidence that
        they are not alone, and credible pathways forward.
      </p>
    </SectionWrapper>
  );
}

// ─── Speaker Highlights ───────────────────────────────────────────────────────

type Speaker = {
  name: string;
  role: string;
  organisation: string;
  bio: string;
  session: string;
  sessionDate: string;
  photoSrc?: string;
};

const speakers: Speaker[] = [
  {
    name: "Prof. Jeffrey Sachs",
    role: "Honorary Distinguished Jeffrey Cheah Professor",
    organisation: "Sunway University",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "H.E. Dato' Astanah Abdul Aziz",
    role: "Deputy Secretary-General (DSG) of ASEAN for Political-Security Community",
    organisation: "ASEAN",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Jaya Shreedhar",
    role: "Senior Health Media Advisor",
    organisation: "Internews",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Shweta Narayan",
    role: "Global Climate Health Alliance",
    organisation: "Global Climate Health and Alliance",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Cornelia C. Walther",
    role: "Senior Fellow",
    organisation: "Sunway Centre for Planetary Health",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Kirsten Dunlop",
    role: "Chief Executive Officer",
    organisation: "EIT Climate-KIC",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 1 && !/^(H\.E\.|Prof\.|Dr\.|Dato')$/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}


function SpeakerModal({
  speaker,
  onClose,
}: {
  speaker: Speaker;
  onClose: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      className="flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={speaker.name}
    >
      {/* Backdrop */}
      <motion.div
        style={{ position: "absolute", inset: 0 }}
        className="bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Modal panel */}
      <motion.div
        className="relative flex w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        {/* Close button — top-right of entire modal */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left — photo panel */}
        <div className="relative hidden w-52 shrink-0 flex-col items-center justify-end overflow-hidden bg-gtp-dark-teal/8 sm:flex lg:w-64">
          <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 translate-y-10 rounded-full bg-gtp-teal/15" />
          {speaker.photoSrc ? (
            <div className="relative mb-0 h-52 w-44 overflow-hidden rounded-t-full lg:h-60 lg:w-52">
              <Image
                src={speaker.photoSrc}
                alt={speaker.name}
                fill
                className="object-cover object-top"
                sizes="208px"
              />
            </div>
          ) : (
            <div className="relative mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-gtp-dark-teal/15 text-4xl ring-4 ring-white/60 lg:h-44 lg:w-44 lg:text-5xl">
              <span className="font-heading font-bold text-gtp-dark-teal">
                {getInitials(speaker.name)}
              </span>
            </div>
          )}
        </div>

        {/* Right — content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between p-7 lg:p-10">
          <div className="mb-5 pr-10">
            <p className="font-heading text-2xl font-bold leading-tight text-gtp-dark-teal lg:text-3xl">
              {speaker.name}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-gtp-teal">
              {speaker.role}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">{speaker.organisation}</p>
          </div>

          {/* Session & date */}
          <div className="mb-5 grid grid-cols-1 gap-3 rounded-xl bg-gtp-dark-teal/5 p-4 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <Presentation className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Session
                </p>
                <p className="mt-0.5 text-sm font-medium text-gtp-dark-teal">
                  {speaker.session}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Date &amp; Time
                </p>
                <p className="mt-0.5 text-sm font-medium text-gtp-dark-teal">
                  {speaker.sessionDate}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Bio
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {speaker.bio}
            </p>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

function SpeakerCard({
  speaker,
  onClick,
}: {
  speaker: Speaker;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex w-full min-h-[260px] flex-col overflow-hidden rounded-2xl bg-gtp-dark-teal/6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal"
    >
      {/* Top — name, role, + button */}
      <div className="flex items-start justify-between gap-2 p-5 pb-3">
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold leading-snug text-gtp-dark-teal">
            {speaker.name}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gtp-teal">
            {speaker.role}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">{speaker.organisation}</p>
        </div>
        {/* + → × on hover */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gtp-teal text-white transition-all duration-300 group-hover:bg-gtp-dark-teal">
          <Plus
            className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45"
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Bottom — avatar */}
      <div className="flex flex-1 items-end justify-center px-6 pb-0 pt-2">
        {speaker.photoSrc ? (
          <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
            <Image
              src={speaker.photoSrc}
              alt={speaker.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          </div>
        ) : (
          <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-gtp-dark-teal/12 text-3xl ring-4 ring-white/70">
            <span className="font-heading font-bold text-gtp-dark-teal">
              {getInitials(speaker.name)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

function SpeakersSection() {
  const [selected, setSelected] = useState<Speaker | null>(null);

  return (
    <>
      <SectionWrapper
        title="Speakers Highlights"
        subtitle="Our Speakers"
        theme="gtp"
        background="default"
      >
        <StaggerReveal className="grid grid-cols-1 gap-4 [grid-auto-rows:1fr] sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {speakers.map((speaker) => (
            <SpeakerCard
              key={speaker.name}
              speaker={speaker}
              onClick={() => setSelected(speaker)}
            />
          ))}
        </StaggerReveal>
      </SectionWrapper>

      <AnimatePresence>
        {selected && (
          <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
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
    quote: "The Global Tipping Points Conference 2026 is a great opportunity for a bunch of us to come together as businesses, as thinkers, as policymakers, both to wrestle down the incredible risks we're running in crossing tipping points in the Earth system—our life support system—but also how can we together seize the positive tipping point opportunities to accelerate us out of trouble and into a healthier, happier, flourishing future together.",
    hasPhoto: false,
  },
  {
    name: "Johan Rockström",
    designation: "Co-Chair · Director, Potsdam Institute for Climate Impact Research",
    quote: "Scientifically, we know we are moving towards profound challenges and risks at the planetary scale, with an increasing risk of tipping points in the Earth system. Against this backdrop, the Malaysian Global Tipping Point Conference offers a crucial forum to examine how positive societal tipping points can help build more equitable, stable and resilient societies.",
    hasPhoto: false,
  },
  {
    name: "Jemilah Mahmood",
    designation: "Co-Chair · Executive Director, Sunway Centre for Planetary Health, Sunway University",
    quote: "This year, the Sunway Centre for Planetary Health will proudly host the Global Tipping Points Conference at Sunway University, the first in Asia. Together, scientists, policymakers, business leaders, civil society, Indigenous voices, artists, and youth will unite to spotlight South and Southeast Asia's lived realities and accelerate the positive tipping points we need for a healthier planet and future. Join us in Sunway this October and we will see you there! Follow us on @sunwaycph to find out more!",
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
      <StaggerReveal
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-4 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-x-visible md:px-0 md:pb-0"
      >
        {coChairQuotes.map(({ name, designation, quote, hasPhoto, photoSrc }) => (
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
      </StaggerReveal>
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
      <SpeakersSection />
      <SponsorsSection />
      <GallerySection />
      <QuoteSection />
    </>
  );
}
