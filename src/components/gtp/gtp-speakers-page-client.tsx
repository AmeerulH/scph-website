"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { GtpSpeakerModal } from "@/components/gtp/gtp-speaker-modal";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { getSpeakerInitials } from "@/components/gtp/gtp-speaker-highlight";
import { cn } from "@/lib/utils";
import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";
import type { SanityGtp2026SpeakersPageRaw } from "@/sanity/gtp-stage1";

// ─── Decorative shape primitives ──────────────────────────────────────────────

function SquiggleLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 12 C12 2, 22 22, 32 12 S52 2, 62 12 S82 22, 92 12 S112 2, 118 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TriangleOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M24 4L44 42H4L24 4Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiagonalBars({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <line x1="0" y1="20" x2="40" y2="0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="0" y1="35" x2="40" y2="15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="0" y1="50" x2="40" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ─── Speaker card ─────────────────────────────────────────────────────────────

function SpeakersPageCard({
  speaker,
  onClick,
}: {
  speaker: GtpHighlightSpeaker;
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
            className={cn(
              "object-cover object-top transition-transform duration-500 group-hover:scale-105",
              speaker.photoClassName,
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized={speaker.photoUnoptimized}
            quality={speaker.photoUnoptimized ? undefined : 92}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gtp-dark-teal via-[#0a6070] to-gtp-dark-teal">
            <span className="font-heading text-5xl font-bold text-white/20 sm:text-6xl">
              {getSpeakerInitials(speaker.name)}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        <div
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gtp-dark-teal shadow-md ring-1 ring-black/5",
            "scale-75 opacity-0 transition-all duration-200 ease-out",
            "group-hover:scale-100 group-hover:opacity-100",
          )}
          aria-hidden="true"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 pt-16 text-left">
          <p className="font-heading text-base font-bold leading-snug text-white drop-shadow md:text-lg">
            {speaker.name}
          </p>
          {speaker.role.trim() ? (
            <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-white/90">
              {speaker.role}
            </p>
          ) : null}
          {speaker.organisation.trim() ? (
            <p className="mt-0.5 line-clamp-2 text-[10px] text-white/65">
              {speaker.organisation}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HERO_DEFAULTS = {
  heroLabel: "Global Tipping Points 2026",
  heroHeading: "Our Speakers",
  heroDescription:
    "GTP 2026 brings together leading scientists, policymakers, and innovators from across the globe. Over four days in Kuala Lumpur, they will share breakthroughs, challenge assumptions, and chart a course for positive tipping points on climate, biodiversity, and planetary health.",
  heroDateLocation: "12–15 October 2026 · Kuala Lumpur, Malaysia",
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number, y = 22, duration = 0.65) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, ease: EASE, delay },
  };
}

function fadeIn(delay: number, duration = 0.6) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration, ease: EASE, delay },
  };
}

function SpeakersHero({ cms }: { cms: SanityGtp2026SpeakersPageRaw | null }) {
  const reduced = useReducedMotion();
  const label = cms?.heroLabel?.trim() || HERO_DEFAULTS.heroLabel;
  const heading = cms?.heroHeading?.trim() || HERO_DEFAULTS.heroHeading;
  const description = cms?.heroDescription?.trim() || HERO_DEFAULTS.heroDescription;
  const dateLocation = cms?.heroDateLocation?.trim() || HERO_DEFAULTS.heroDateLocation;

  const up = (delay: number, y = 22, duration = 0.65) =>
    reduced ? {} : fadeUp(delay, y, duration);
  const fi = (delay: number, duration = 0.6) =>
    reduced ? {} : fadeIn(delay, duration);

  return (
    <div className="relative h-screen overflow-hidden bg-gtp-dark-teal">
      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Decorative shapes ── */}

      {/* Orange circle — top right, continuous float after entry */}
      <motion.div
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gtp-orange sm:h-56 sm:w-56"
        aria-hidden="true"
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        animate={reduced ? {} : { scale: 1, opacity: 0.9, y: [0, -10, 0] }}
        transition={reduced ? {} : {
          scale: { duration: 0.75, ease: EASE, delay: 0.08 },
          opacity: { duration: 0.75, ease: EASE, delay: 0.08 },
          y: { duration: 7, ease: "easeInOut", repeat: Infinity, delay: 0.9 },
        }}
      />

      {/* Triangle — fades in with rotation, slow drift after */}
      <motion.div
        className="pointer-events-none absolute right-[6%] top-[35%]"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, rotate: -30 }}
        animate={reduced ? {} : { opacity: 1, rotate: [0, 6, 0, -6, 0] }}
        transition={reduced ? {} : {
          opacity: { duration: 0.6, ease: EASE, delay: 0.5 },
          rotate: { duration: 9, ease: "easeInOut", repeat: Infinity, delay: 1.1 },
        }}
      >
        <TriangleOutline className="h-14 w-14 text-gtp-teal/50" />
      </motion.div>

      {/* Diagonal bars — slide in from right */}
      <motion.div
        className="pointer-events-none absolute bottom-16 left-[52%]"
        aria-hidden="true"
        {...(reduced ? {} : {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.55, ease: EASE, delay: 0.78 },
        })}
      >
        <DiagonalBars className="h-14 w-8 text-white/20" />
      </motion.div>

      {/* Squiggle — centre-bottom, drifts horizontally */}
      <motion.div
        className="pointer-events-none absolute bottom-20 left-[48%]"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, x: -16 }}
        animate={reduced ? {} : { opacity: 1, x: [0, 5, 0] }}
        transition={reduced ? {} : {
          opacity: { duration: 0.5, ease: EASE, delay: 0.68 },
          x: { duration: 8, ease: "easeInOut", repeat: Infinity, delay: 1.2 },
        }}
      >
        <SquiggleLine className="w-28 text-gtp-teal/30" />
      </motion.div>

      {/* Squiggle — bottom right, drifts */}
      <motion.div
        className="pointer-events-none absolute bottom-16 right-[5%] rotate-12"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, x: 16 }}
        animate={reduced ? {} : { opacity: 1, x: [0, -5, 0] }}
        transition={reduced ? {} : {
          opacity: { duration: 0.5, ease: EASE, delay: 0.74 },
          x: { duration: 9, ease: "easeInOut", repeat: Infinity, delay: 1.4 },
        }}
      >
        <SquiggleLine className="w-24 text-gtp-green/35" />
      </motion.div>

      {/* Green dot 1 */}
      <motion.div
        className="pointer-events-none absolute right-[28%] top-10 h-3 w-3 rounded-full bg-gtp-green/50"
        aria-hidden="true"
        {...(reduced ? {} : {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.4, ease: EASE, delay: 0.45 },
        })}
      />
      {/* Green dot 2 */}
      <motion.div
        className="pointer-events-none absolute right-[26%] top-16 h-2 w-2 rounded-full bg-gtp-green/35"
        aria-hidden="true"
        {...(reduced ? {} : {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.4, ease: EASE, delay: 0.54 },
        })}
      />

      {/* ── Full-height content grid ── */}
      <div className="grid h-full lg:grid-cols-2">

        {/* Left: full-bleed microphone image — slides in from left */}
        <motion.div
          className="relative hidden lg:block"
          {...(reduced ? {} : {
            initial: { opacity: 0, x: -60 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.95, ease: EASE, delay: 0 },
          })}
        >
          <Image
            src="/images/gtp/speakers/speaker-mic-hero.jpg"
            alt="Speaker at microphone"
            fill
            priority
            className="object-cover object-center"
            sizes="50vw"
            quality={90}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gtp-dark-teal" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gtp-dark-teal/50 via-transparent to-transparent" />
        </motion.div>

        {/* Right: text — staggered fade-up */}
        <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-20">
          <motion.p
            className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gtp-teal"
            {...up(0.28, 14, 0.55)}
          >
            {label}
          </motion.p>

          <motion.h1
            className="font-heading mt-4 text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
            {...up(0.42, 36, 0.75)}
          >
            {heading}
          </motion.h1>

          <motion.div
            className="mt-6 h-px w-16 bg-gtp-teal"
            style={{ transformOrigin: "left center" }}
            {...(reduced ? {} : {
              initial: { scaleX: 0, opacity: 0 },
              animate: { scaleX: 1, opacity: 1 },
              transition: { duration: 0.5, ease: EASE, delay: 0.6 },
            })}
          />

          <motion.p
            className="mt-6 max-w-[46ch] text-base leading-relaxed text-white/70 sm:text-lg"
            {...up(0.7, 20, 0.6)}
          >
            {description}
          </motion.p>

          <motion.p
            className="mt-4 max-w-[42ch] text-sm leading-relaxed text-white/45"
            {...fi(0.84)}
          >
            {dateLocation}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

// ─── Card grid section ────────────────────────────────────────────────────────

function SpeakersGrid({
  speakers,
  onSelect,
}: {
  speakers: GtpHighlightSpeaker[];
  onSelect: (s: GtpHighlightSpeaker) => void;
}) {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      style={{
        background: [
          "radial-gradient(ellipse 900px 600px at 95% 8%, #009CB422 0%, transparent 65%)",
          "radial-gradient(ellipse 700px 500px at 4% 85%, #DB5D0018 0%, transparent 62%)",
          "radial-gradient(ellipse 600px 400px at 52% 52%, #86BC2512 0%, transparent 58%)",
          "radial-gradient(ellipse 450px 350px at 18% 18%, #009CB414 0%, transparent 60%)",
          "linear-gradient(160deg, #f4f8f9 0%, #edf2f4 45%, #eff5f0 75%, #f3f4ef 100%)",
        ].join(", "),
      }}
    >
      {/* ── Large anchor shapes ── */}

      {/* Teal blob circle — top right, soft */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gtp-teal/10"
        aria-hidden="true"
      />
      {/* Orange circle — left, mid-high */}
      <div
        className="pointer-events-none absolute left-6 top-[22%] h-24 w-24 rounded-full bg-gtp-orange/18"
        aria-hidden="true"
      />
      {/* Green circle — bottom right */}
      <div
        className="pointer-events-none absolute -bottom-10 right-[8%] h-40 w-40 rounded-full bg-gtp-green/12"
        aria-hidden="true"
      />

      {/* ── Small filled dots ── */}
      <div className="pointer-events-none absolute right-[14%] top-10 h-5 w-5 rounded-full bg-gtp-teal/30" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[38%] top-6 h-3 w-3 rounded-full bg-gtp-orange/35" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-[18%] left-[6%] h-4 w-4 rounded-full bg-gtp-green/30" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-[30%] right-[4%] h-3 w-3 rounded-full bg-gtp-teal/25" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[55%] top-[70%] h-2 w-2 rounded-full bg-gtp-orange/30" aria-hidden="true" />

      {/* ── Dot clusters ── */}
      <div className="pointer-events-none absolute right-[5%] top-[42%] flex flex-col gap-1.5" aria-hidden="true">
        <div className="h-2 w-2 rounded-full bg-gtp-orange/40" />
        <div className="ml-3 h-2 w-2 rounded-full bg-gtp-orange/25" />
        <div className="h-1.5 w-1.5 rounded-full bg-gtp-orange/20" />
      </div>
      <div className="pointer-events-none absolute bottom-[12%] left-[2%] flex flex-col gap-2" aria-hidden="true">
        <div className="h-3 w-3 rounded-full bg-gtp-teal/30" />
        <div className="ml-2 h-2 w-2 rounded-full bg-gtp-teal/20" />
      </div>

      {/* ── Triangle outlines ── */}
      <TriangleOutline className="pointer-events-none absolute left-[7%] top-[38%] h-16 w-16 text-gtp-teal/22" />
      <TriangleOutline className="pointer-events-none absolute bottom-16 right-[13%] h-10 w-10 text-gtp-orange/28" />
      <TriangleOutline className="pointer-events-none absolute right-[32%] top-8 h-8 w-8 -rotate-12 text-gtp-green/22" />

      {/* ── Squiggles ── */}
      <SquiggleLine className="pointer-events-none absolute left-[2%] top-10 w-32 text-gtp-teal/22" />
      <SquiggleLine className="pointer-events-none absolute bottom-10 right-[7%] w-28 rotate-6 text-gtp-green/28" />
      <SquiggleLine className="pointer-events-none absolute left-[4%] top-[63%] w-20 -rotate-12 text-gtp-orange/22" />
      <SquiggleLine className="pointer-events-none absolute bottom-[35%] right-[20%] w-16 rotate-3 text-gtp-teal/18" />

      {/* ── Diagonal bar stacks ── */}
      <DiagonalBars className="pointer-events-none absolute right-[19%] top-6 h-12 w-7 text-gtp-dark-teal/12" />
      <DiagonalBars className="pointer-events-none absolute bottom-14 left-[11%] h-12 w-7 text-gtp-teal/18" />

      {/* ── Grid ── */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <StaggerReveal
          variant="long"
          className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          {speakers.map((speaker) => (
            <SpeakersPageCard
              key={speaker.name}
              speaker={speaker}
              onClick={() => onSelect(speaker)}
            />
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export function GtpSpeakersPageClient({
  speakers,
  pageCms,
}: {
  speakers: GtpHighlightSpeaker[];
  pageCms: SanityGtp2026SpeakersPageRaw | null;
}) {
  const [selected, setSelected] = useState<GtpHighlightSpeaker | null>(null);

  return (
    <>
      <SpeakersHero cms={pageCms} />
      <SpeakersGrid speakers={speakers} onSelect={setSelected} />

      <AnimatePresence>
        {selected ? (
          <GtpSpeakerModal
            key={selected.name}
            speaker={selected}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
