"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "motion/react";
import { CalendarDays, Presentation, X } from "lucide-react";
import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";
import { cn } from "@/lib/utils";

function getSpeakerInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 1 && !/^(H\.E\.|Prof\.|Dr\.|Dato')$/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function SpeakerModalAvatar({ speaker }: { speaker: GtpHighlightSpeaker }) {
  const shellClass =
    "relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-white/25 shadow-lg sm:h-28 sm:w-28";

  if (speaker.photoSrc) {
    return (
      <div className={shellClass}>
        <Image
          src={speaker.photoSrc}
          alt={speaker.name}
          fill
          className={cn("object-cover object-top", speaker.photoClassName)}
          sizes="112px"
          unoptimized={speaker.photoUnoptimized}
          quality={speaker.photoUnoptimized ? undefined : 92}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        shellClass,
        "flex items-center justify-center bg-white/10 text-2xl sm:text-3xl",
      )}
    >
      <span className="font-heading font-bold text-white/90">
        {getSpeakerInitials(speaker.name)}
      </span>
    </div>
  );
}

function SessionMetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Presentation;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gtp-teal/10 text-gtp-teal">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gtp-dark-teal/45">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium leading-snug text-gtp-dark-teal">
          {value}
        </p>
      </div>
    </div>
  );
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
      onClick={onClose}
    >
      <motion.div
        style={{ position: "absolute", inset: 0 }}
        className="bg-gtp-dark-teal/75 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="relative flex max-h-[min(90vh,44rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gtp-dark-teal/10"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0 overflow-hidden rounded-t-2xl bg-linear-to-br from-gtp-dark-teal via-[#0a6070] to-gtp-dark-teal px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex flex-col items-center gap-4 pr-8 sm:flex-row sm:items-center sm:gap-5">
            <SpeakerModalAvatar speaker={speaker} />
            <div className="min-w-0 text-center sm:text-left">
              <p className="font-heading text-xl font-bold leading-tight text-white sm:text-2xl">
                {speaker.name}
              </p>
              {speaker.role.trim() ? (
                <p className="mt-1.5 text-sm font-medium text-gtp-teal-light">
                  {speaker.role}
                </p>
              ) : null}
              {speaker.organisation.trim() ? (
                <p className="mt-1 text-xs leading-relaxed text-white/65">
                  {speaker.organisation}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="space-y-4">
            {sessionRows.length > 1 ? (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gtp-dark-teal/45">
                Speaking sessions
              </p>
            ) : null}
            {sessionRows.map((row, i) => (
              <div
                key={`${row.title}-${i}`}
                className={cn(
                  "flex flex-col gap-4 sm:flex-row sm:gap-6",
                  i > 0 && "border-t border-gtp-dark-teal/8 pt-4",
                )}
              >
                <SessionMetaItem
                  icon={Presentation}
                  label="Session"
                  value={row.title}
                />
                <SessionMetaItem
                  icon={CalendarDays}
                  label="Date & time"
                  value={row.date}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gtp-dark-teal/8 pt-6">
            <h3 className="font-heading text-[11px] font-semibold uppercase tracking-wide text-gtp-dark-teal/45">
              About
            </h3>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-gray-600">
              {speaker.bio}
            </p>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
