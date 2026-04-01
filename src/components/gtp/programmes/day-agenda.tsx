"use client";

import * as React from "react";
import type { Session } from "./types";
import { BreakStrip } from "./break-strip";
import { ConcurrentBlock } from "./concurrent-block";
import { SessionCard } from "./session-card";
import { SessionModal } from "./session-modal";

export function DayAgenda({
  sessions,
  highlightSpeaker,
  highlightSession,
  dayLabel,
}: {
  sessions: Session[];
  highlightSpeaker?: string;
  highlightSession?: string;
  dayLabel?: string;
}) {
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);

  return (
    <>
      <div className="space-y-4">
        {sessions.map((session, i) => {
          if (session.type === "break") {
            return <BreakStrip key={i} session={session} />;
          }
          if (session.type === "concurrent") {
            return (
              <ConcurrentBlock
                key={i}
                session={session}
                onClick={() => setSelectedSession(session)}
              />
            );
          }
          return (
            <SessionCard
              key={i}
              session={session}
              highlightSpeaker={highlightSpeaker}
              highlightSession={highlightSession}
              onClick={() => setSelectedSession(session)}
            />
          );
        })}
      </div>

      <SessionModal
        session={selectedSession}
        dayLabel={dayLabel}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
