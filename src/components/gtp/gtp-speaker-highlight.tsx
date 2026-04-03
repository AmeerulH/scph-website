"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { CalendarDays, Presentation, X, Plus } from "lucide-react";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";
import { gtpHighlightSpeakers } from "@/data/gtp-highlight-speakers";
import { cn } from "@/lib/utils";

export function getSpeakerInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 1 && !/^(H\.E\.|Prof\.|Dr\.|Dato')$/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function GtpSpeakerModal({
  speaker,
  onClose,
}: {
  speaker: GtpHighlightSpeaker;
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

  const sessionRows: { title: string; date: string }[] =
    speaker.sessions && speaker.sessions.length > 0
      ? speaker.sessions
      : [{ title: speaker.session, date: speaker.sessionDate }];

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      className="flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={speaker.name}
    >
      <motion.div
        style={{ position: "absolute", inset: 0 }}
        className="bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="relative flex w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative hidden w-52 shrink-0 flex-col items-center justify-end overflow-hidden bg-gtp-dark-teal/8 sm:flex lg:w-64">
          <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 translate-y-10 rounded-full bg-gtp-teal/15" />
          {speaker.photoSrc ? (
            <div className="relative mb-0 h-52 w-44 overflow-hidden rounded-t-full lg:h-60 lg:w-52">
              <Image
                src={speaker.photoSrc}
                alt={speaker.name}
                fill
                className={cn(
                  "object-cover object-top",
                  speaker.photoClassName,
                )}
                sizes="(max-width: 1024px) 176px, 208px"
                unoptimized={speaker.photoUnoptimized}
                quality={speaker.photoUnoptimized ? undefined : 92}
              />
            </div>
          ) : (
            <div className="relative mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-gtp-dark-teal/15 text-4xl ring-4 ring-white/60 lg:h-44 lg:w-44 lg:text-5xl">
              <span className="font-heading font-bold text-gtp-dark-teal">
                {getSpeakerInitials(speaker.name)}
              </span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-7 lg:p-10">
          <div className="mb-5 pr-10">
            <p className="font-heading text-2xl font-bold leading-tight text-gtp-dark-teal lg:text-3xl">
              {speaker.name}
            </p>
            {speaker.role.trim() ? (
              <p className="mt-1.5 text-sm font-semibold text-gtp-teal">
                {speaker.role}
              </p>
            ) : null}
            {speaker.organisation.trim() ? (
              <p className="mt-0.5 text-xs text-gray-400">
                {speaker.organisation}
              </p>
            ) : null}
          </div>

          <div className="mb-5 space-y-3">
            {sessionRows.length > 1 ? (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Speaking sessions
              </p>
            ) : null}
            {sessionRows.map((row, i) => (
              <div
                key={`${row.title}-${i}`}
                className="grid grid-cols-1 gap-3 rounded-xl bg-gtp-dark-teal/5 p-4 sm:grid-cols-2"
              >
                <div className="flex items-start gap-2.5">
                  <Presentation className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      Session
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-gtp-dark-teal">
                      {row.title}
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
                      {row.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

export function GtpSpeakerCard({
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
              "object-cover object-top",
              speaker.photoClassName,
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 320px"
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
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gtp-dark-teal shadow-md ring-1 ring-black/5 transition-transform group-hover:scale-110">
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

/**
 * Staggered speaker grid + modal. Wrap with {@link SectionWrapper} on each page.
 */
export function GtpSpeakersHighlightInner({
  speakers = gtpHighlightSpeakers,
  staggerVariant = "default",
  gridClassName,
}: {
  speakers?: GtpHighlightSpeaker[];
  staggerVariant?: "default" | "long";
  gridClassName?: string;
}) {
  const [selected, setSelected] = useState<GtpHighlightSpeaker | null>(null);

  return (
    <>
      <StaggerReveal
        variant={staggerVariant}
        className={cn(
          "grid grid-cols-1 gap-5 [grid-auto-rows:1fr] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          gridClassName,
        )}
      >
        {speakers.map((speaker) => (
          <GtpSpeakerCard
            key={speaker.name}
            speaker={speaker}
            onClick={() => setSelected(speaker)}
          />
        ))}
      </StaggerReveal>

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
