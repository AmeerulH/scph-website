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
import { GtpHeroGradient } from "@/components/gtp/hero-gradient";
import { GtpCountdown } from "@/components/gtp/countdown";
import { GtpEventsPreviewCarousel } from "@/components/gtp/events-preview-carousel";
import { ContactForm } from "@/app/events/gtp-2026/get-involved/contact-form";
import { cn } from "@/lib/utils";

// ─── About GTP (New Reality) ──────────────────────────────────────────────────

const gtpSiteExploreCards = [
  {
    title: "Governance",
    body: "We urgently need new types of governance to cope with the threat posed by Earth system tipping points.",
    href: "https://global-tipping-points.org/governance/",
    cardClass: "bg-gtp-dark-teal",
    illustration: "governance" as const,
  },
  {
    title: "Earth System Tipping Points",
    body: "Earth system tipping points pose profound risks to national security, food security, health and wellbeing.",
    href: "https://global-tipping-points.org/earth-system-tipping-points/",
    cardClass: "bg-gtp-teal",
    illustration: "earth" as const,
  },
  {
    title: "Positive tipping points",
    body: "We need to identify and trigger positive tipping points to accelerate to net zero.",
    href: "https://global-tipping-points.org/positive-tipping-points/",
    cardClass: "bg-gtp-green",
    illustration: "positive" as const,
  },
] as const;

/** Governance: equal-size icon wells + edge-to-edge baseline (–mx-6 vs card p-6). */
function GtpGovernanceCardFooterArt() {
  const iconWell =
    "relative size-[4.75rem] shrink-0 overflow-hidden rounded-full bg-transparent sm:size-20";
  const iconFit =
    "object-contain object-center p-[7%] sm:p-[6%]";

  return (
    <div className="mt-auto w-full shrink-0 pt-6">
      <div className="relative">
        <div className="relative z-10 mb-[-11px] flex w-full justify-end gap-0 pr-5 sm:mb-[-12px] sm:pr-7">
          <div className={`${iconWell} z-[1]`}>
            <Image
              src="/images/gtp/cards/teal-1.svg"
              alt=""
              fill
              unoptimized
              sizes="80px"
              className={iconFit}
              aria-hidden
            />
          </div>
          <div className={`${iconWell} -ml-2.5 z-0 sm:-ml-3`}>
            <Image
              src="/images/gtp/cards/teal-2.svg"
              alt=""
              fill
              unoptimized
              sizes="80px"
              className={`${iconFit} object-[56%_38%] sm:object-[58%_36%]`}
              aria-hidden
            />
          </div>
        </div>
        <div className="relative z-20 -mx-6">
          <div className="h-2.5 w-full bg-white sm:h-3" aria-hidden />
          <div className="h-3" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function GtpExploreCardIllustration({
  variant,
}: {
  variant: (typeof gtpSiteExploreCards)[number]["illustration"];
}) {
  if (variant !== "governance") {
    return <div className="mt-auto shrink-0 pt-6" aria-hidden />;
  }

  return <GtpGovernanceCardFooterArt />;
}

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

      <div className="mt-14">
        <p className="mb-6 text-center font-heading text-sm font-semibold uppercase tracking-[0.12em] text-gtp-dark-teal/70">
          Explore on global-tipping-points.org
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-3">
          {gtpSiteExploreCards.map(({ title, body, href, cardClass, illustration }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex min-h-[380px] w-full flex-col overflow-hidden rounded-2xl p-6 shadow-lg ring-1 ring-white/15 transition-[flex-grow] duration-1000 ease-in-out md:min-h-[400px] md:min-w-0 md:flex-[1_1_0%] md:hover:flex-grow-[1.45] ${cardClass}`}
              aria-label={`${title} — opens global-tipping-points.org in a new tab`}
            >
              <h3 className="font-heading text-left text-sm font-bold uppercase tracking-[0.08em] text-white">
                {title}
              </h3>
              <div className="mt-3 h-px w-12 bg-white/90" />
              <p className="mt-4 flex-1 text-left text-sm leading-relaxed text-white/95">
                {body}
              </p>
              <GtpExploreCardIllustration variant={illustration} />
            </a>
          ))}
        </div>
      </div>
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
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl text-left shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gtp-dark-teal">
        {speaker.photoSrc ? (
          <Image
            src={speaker.photoSrc}
            alt={speaker.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gtp-dark-teal via-[#0a6070] to-gtp-dark-teal">
            <span className="font-heading text-5xl font-bold text-white/20 sm:text-6xl">
              {getInitials(speaker.name)}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gtp-dark-teal shadow-md ring-1 ring-black/5 transition-transform group-hover:scale-110">
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 pt-16 text-left">
          <p className="font-heading text-base font-bold leading-snug text-white drop-shadow md:text-lg">
            {speaker.name}
          </p>
          <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-white/90">
            {speaker.role}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[10px] text-white/65">
            {speaker.organisation}
          </p>
        </div>
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
        <StaggerReveal className="grid grid-cols-1 gap-5 [grid-auto-rows:1fr] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    avatarObjectClass: "object-[56%_44%]",
  },
  {
    name: "Johan Rockström",
    designation: "Co-Chair · Director, Potsdam Institute for Climate Impact Research",
    quote: "Scientifically, we know we are moving towards profound challenges and risks at the planetary scale, with an increasing risk of tipping points in the Earth system. Against this backdrop, the Malaysian Global Tipping Point Conference offers a crucial forum to examine how positive societal tipping points can help build more equitable, stable and resilient societies.",
    hasPhoto: true,
    photoSrc: "/images/gtp/co-chairs/johan-rockstrom.jpg",
  },
  {
    name: "Jemilah Mahmood",
    designation: "Co-Chair · Executive Director, Sunway Centre for Planetary Health, Sunway University",
    quote: "This year, the Sunway Centre for Planetary Health will proudly host the Global Tipping Points Conference at Sunway University, the first in Asia. Together, scientists, policymakers, business leaders, civil society, Indigenous voices, artists, and youth will unite to spotlight South and Southeast Asia's lived realities and accelerate the positive tipping points we need for a healthier planet and future. Join us in Sunway this October and we will see you there! Follow us on @sunwaycph to find out more!",
    hasPhoto: true,
    photoSrc: "/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.jpg",
    avatarObjectClass: "object-[50%_32%]",
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
          ({ name, designation, quote, hasPhoto, photoSrc, avatarObjectClass }) => (
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
