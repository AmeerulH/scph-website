"use client";

import * as React from "react";
import type { GtpSessionModalHostedBy } from "@/sanity/queries";
import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import type { Session, Speaker, Workshop } from "./types";
import { BreakStrip } from "./break-strip";
import { ConcurrentBlock } from "./concurrent-block";
import { SessionCard } from "./session-card";
import { SessionModal } from "./session-modal";
import { WorkshopModal, type WorkshopModalContext } from "./workshop-modal";
import { GtpSpeakerModal } from "@/components/gtp/gtp-speaker-modal";
import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";
import { normalizeSpeakerName } from "./programme-speaker-filter";

export function DayAgenda({
  sessions,
  highlightSession,
  highlightSpeaker,
  dayLabel,
  calendarTabId,
  sessionModalHostedBy,
  speakerProfiles,
}: {
  sessions: Session[];
  highlightSession?: string;
  highlightSpeaker?: string;
  dayLabel?: string;
  /** Active programme day tab — maps session times to calendar dates. */
  calendarTabId: GtpProgrammeCalendarDayTab;
  sessionModalHostedBy: GtpSessionModalHostedBy;
  speakerProfiles: GtpHighlightSpeaker[];
}) {
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);
  const [workshopContext, setWorkshopContext] = React.useState<WorkshopModalContext | null>(null);
  const [selectedSpeakerProfile, setSelectedSpeakerProfile] =
    React.useState<GtpHighlightSpeaker | null>(null);
  const workshopOpenRef = React.useRef(false);

  React.useEffect(() => {
    workshopOpenRef.current = workshopContext != null;
  }, [workshopContext]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (workshopOpenRef.current) {
        setWorkshopContext(null);
        e.preventDefault();
        return;
      }
      setSelectedSession(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openWorkshop = React.useCallback((w: Workshop, parent: Session) => {
    setWorkshopContext({ workshop: w, parent });
  }, []);

  const openSpeakerProfile = React.useCallback(
    (speaker: Speaker, session: Session) => {
      const matchingProfile = speakerProfiles.find(
        (profile) =>
          normalizeSpeakerName(profile.name) === normalizeSpeakerName(speaker.name),
      );
      const placeholderBio = `More information about ${speaker.name} will be added soon.`;

      setSelectedSpeakerProfile({
        name: matchingProfile?.name || speaker.name,
        role: matchingProfile?.role || speaker.designation || "",
        organisation: matchingProfile?.organisation || "",
        bio: matchingProfile?.bio || placeholderBio,
        session: matchingProfile?.session || session.title,
        sessionDate: matchingProfile?.sessionDate || session.time,
        photoSrc: matchingProfile?.photoSrc || speaker.imageUrl,
        photoClassName: matchingProfile?.photoClassName,
        photoUnoptimized: matchingProfile?.photoUnoptimized,
        sessions: matchingProfile?.sessions,
      });
    },
    [speakerProfiles],
  );

  return (
    <>
      <div className="space-y-4">
        {sessions.map((session, i) => {
          if (session.type === "break") {
            return <BreakStrip key={i} session={session} />;
          }
          if (session.type === "concurrent" || session.type === "research") {
            return (
              <ConcurrentBlock
                key={i}
                session={session}
                calendarTabId={calendarTabId}
                onClick={() => setSelectedSession(session)}
                onWorkshopClick={(w) => openWorkshop(w, session)}
                highlightSpeaker={highlightSpeaker}
              />
            );
          }
          return (
            <SessionCard
              key={i}
              session={session}
              calendarTabId={calendarTabId}
              highlightSession={highlightSession}
              highlightSpeaker={highlightSpeaker}
              onClick={() => setSelectedSession(session)}
              onSpeakerClick={(speaker) => openSpeakerProfile(speaker, session)}
            />
          );
        })}
      </div>

      <SessionModal
        session={selectedSession}
        dayLabel={dayLabel}
        calendarTabId={calendarTabId}
        hostedBy={sessionModalHostedBy}
        onSpeakerClick={
          selectedSession
            ? (speaker) => openSpeakerProfile(speaker, selectedSession)
            : undefined
        }
        onClose={() => setSelectedSession(null)}
        onWorkshopClick={
          selectedSession?.workshops?.length
            ? (w) => openWorkshop(w, selectedSession)
            : undefined
        }
      />

      <WorkshopModal
        context={workshopContext}
        dayLabel={dayLabel}
        calendarTabId={calendarTabId}
        hostedBy={sessionModalHostedBy}
        onClose={() => setWorkshopContext(null)}
      />

      {selectedSpeakerProfile ? (
        <GtpSpeakerModal
          speaker={selectedSpeakerProfile}
          onClose={() => setSelectedSpeakerProfile(null)}
        />
      ) : null}
    </>
  );
}
