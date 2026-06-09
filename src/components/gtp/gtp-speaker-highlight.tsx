"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";
import { gtpHighlightSpeakers } from "@/data/gtp-highlight-speakers";
import { cn } from "@/lib/utils";
import { GtpSpeakerModal } from "./gtp-speaker-modal";

export function getSpeakerInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 1 && !/^(H\.E\.|Prof\.|Dr\.|Dato')$/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export { GtpSpeakerModal } from "./gtp-speaker-modal";

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
