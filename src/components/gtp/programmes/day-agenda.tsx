"use client";

import * as React from "react";
import type { GtpSessionModalHostedBy } from "@/sanity/queries";
import type { Session, Workshop } from "./types";
import { BreakStrip } from "./break-strip";
import { ConcurrentBlock } from "./concurrent-block";
import { SessionCard } from "./session-card";
import { SessionModal } from "./session-modal";
import { WorkshopModal, type WorkshopModalContext } from "./workshop-modal";

export function DayAgenda({
  sessions,
  highlightSession,
  dayLabel,
  sessionModalHostedBy,
}: {
  sessions: Session[];
  highlightSession?: string;
  dayLabel?: string;
  sessionModalHostedBy: GtpSessionModalHostedBy;
}) {
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);
  const [workshopContext, setWorkshopContext] = React.useState<WorkshopModalContext | null>(null);
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
                onClick={() => setSelectedSession(session)}
                onWorkshopClick={(w) => openWorkshop(w, session)}
              />
            );
          }
          return (
            <SessionCard
              key={i}
              session={session}
              highlightSession={highlightSession}
              onClick={() => setSelectedSession(session)}
            />
          );
        })}
      </div>

      <SessionModal
        session={selectedSession}
        dayLabel={dayLabel}
        hostedBy={sessionModalHostedBy}
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
        onClose={() => setWorkshopContext(null)}
      />
    </>
  );
}
