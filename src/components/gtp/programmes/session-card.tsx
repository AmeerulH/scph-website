"use client";

import * as React from "react";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildProgrammeGoogleCalendarUrl } from "@/lib/gtp-programme-google-calendar";
import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import { normalizeProgrammeSessionTitle } from "@/lib/gtp-programme-session-link";
import type { Session, Speaker } from "./types";
import { TYPE_META } from "./data";
import { AddToGoogleCalendarLink } from "./add-to-google-calendar-link";
import { SpeakerPlaceholder } from "./speaker-placeholder";
import { SessionObjectiveBlock } from "./session-objective-block";
import { getSessionVenueLine } from "./session-display-helpers";
import { ProgrammeSpeakerAvatar } from "./programme-speaker-avatar";
import { normalizeSpeakerName } from "./programme-speaker-filter";

function programmeSessionReference(title: string): string | null {
  const normalized = normalizeProgrammeSessionTitle(title).toLowerCase();
  const match = normalized.match(/\b(plenary|opening|closing)\s*(\d+)\b/);
  return match ? `${match[1]} ${match[2]}` : null;
}

export function SessionCard({
  session,
  calendarTabId,
  highlightSession,
  highlightSpeaker,
  onClick,
  onSpeakerClick,
}: {
  session: Session;
  calendarTabId: GtpProgrammeCalendarDayTab;
  highlightSession?: string;
  /** When set, emphasize matching speaker rows and mute the rest. */
  highlightSpeaker?: string;
  onClick?: () => void;
  onSpeakerClick?: (speaker: Speaker) => void;
}) {
  const meta = TYPE_META[session.type];
  const MetaIcon = meta.Icon;
  const cardRef = React.useRef<HTMLDivElement>(null);

  const namedSpeakers = session.speakers ?? [];
  const placeholderCount =
    namedSpeakers.length === 0 && session.speakerCount
      ? session.speakerCount
      : 0;

  const isSessionHighlighted = (() => {
    if (!highlightSession) return false;
    const sessionTitle = normalizeProgrammeSessionTitle(session.title).toLowerCase();
    const highlightedTitle =
      normalizeProgrammeSessionTitle(highlightSession).toLowerCase();

    if (sessionTitle === highlightedTitle) return true;

    const sessionReference = programmeSessionReference(session.title);
    const highlightedReference = programmeSessionReference(highlightSession);
    return Boolean(
      sessionReference &&
        highlightedReference &&
        sessionReference === highlightedReference,
    );
  })();

  const googleCalHref = buildProgrammeGoogleCalendarUrl({
    tabId: calendarTabId,
    session,
  });

  // Scroll this card into view when it is the highlighted target
  React.useEffect(() => {
    if (!isSessionHighlighted || !cardRef.current) return;
    // Wait for the tab switch + render, then centre the target below fixed chrome.
    const id = setTimeout(() => {
      const card = cardRef.current;
      if (!card) return;

      const top =
        card.getBoundingClientRect().top +
        window.scrollY -
        (window.innerHeight - card.offsetHeight) / 2;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 300);
    return () => clearTimeout(id);
  }, [isSessionHighlighted]);

  return (
    <div
      ref={cardRef}
      style={
        {
          "--programme-session-colour": meta.colour,
          "--programme-session-gradient": meta.cardGradient,
          "--programme-session-speaker-gradient": meta.speakerGradient,
        } as React.CSSProperties
      }
      className={cn(
        "programme-session-card overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500",
        isSessionHighlighted
          ? "border-gtp-teal ring-2 ring-gtp-teal/30 shadow-md"
          : "border-gray-100",
        onClick && cn("cursor-pointer", meta.hoverContainerClass),
      )}
      onClick={onClick}
    >
      {/* Card header strip */}
      <div
        className={cn(
          "programme-session-header flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-100 px-6 py-4",
          meta.headerClass,
        )}
      >
        <div className={cn("flex items-center gap-2", meta.headerTextClass)}>
          <Clock className="h-4 w-4" />
          <span className="text-sm font-semibold">{session.time}</span>
          {session.durationMins && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {session.durationMins} mins
            </span>
          )}
        </div>
        <div
          className={cn(
            "flex min-w-0 max-w-full items-start gap-1.5",
            meta.headerTextClass,
          )}
        >
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="text-xs font-medium wrap-anywhere">
            {getSessionVenueLine(session)}
          </span>
        </div>
        <span
          className={cn(
            "ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            meta.headerBadgeClass,
          )}
        >
          <MetaIcon className="h-3 w-3" />
          {meta.label}
        </span>
        {googleCalHref ? (
          <div className="flex w-full basis-full justify-end pt-1">
            <AddToGoogleCalendarLink
              href={googleCalHref}
              className={cn("text-xs", meta.headerTextClass)}
            />
          </div>
        ) : null}
      </div>

      {/* Card body — title first; objective full width below so long copy expands the card naturally */}
      <div className="programme-session-body px-6 py-5">
        <h3 className="font-heading text-lg font-bold leading-snug text-gtp-dark-teal">
          {session.title}
        </h3>
        <SessionObjectiveBlock
          text={session.objective}
          className="mt-4"
          collapsibleOnMobile
        />

        {/* Named speakers */}
        {namedSpeakers.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {namedSpeakers.map((sp, idx) => {
              const speakerKey = highlightSpeaker
                ? normalizeSpeakerName(highlightSpeaker)
                : "";
              const isMatched =
                !!speakerKey && normalizeSpeakerName(sp.name) === speakerKey;
              const isMuted = !!speakerKey && !isMatched;
              return (
                <button
                  type="button"
                  key={`${sp.name}-${idx}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSpeakerClick?.(sp);
                  }}
                  className={cn(
                    "programme-session-speaker flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-200",
                    onSpeakerClick &&
                      "cursor-pointer hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal/45",
                    isMatched
                      ? "border-gtp-teal bg-gtp-teal/10 ring-2 ring-gtp-teal/25"
                      : isMuted
                        ? "border-gray-100 bg-gray-50/60 opacity-45"
                        : meta.speakerClass,
                  )}
                >
                  <ProgrammeSpeakerAvatar
                    imageUrl={sp.imageUrl}
                    name={sp.name}
                    sizeClassName="h-8 w-8"
                  />
                  <div className="min-w-0">
                    {sp.sessionRole?.trim() ? (
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gtp-teal">
                        {sp.sessionRole.trim()}
                      </p>
                    ) : null}
                    <p className="text-xs font-semibold text-gray-800">{sp.name}</p>
                    {sp.designation && (
                      <p className="text-xs text-gray-400">{sp.designation}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Fallback placeholders when no names confirmed yet */}
        {placeholderCount > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <SpeakerPlaceholder
                key={i}
                className={cn("programme-session-speaker", meta.speakerClass)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
