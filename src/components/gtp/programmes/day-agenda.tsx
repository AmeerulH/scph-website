import type { Session } from "./types";
import { BreakStrip } from "./break-strip";
import { ConcurrentBlock } from "./concurrent-block";
import { SessionCard } from "./session-card";

export function DayAgenda({ sessions }: { sessions: Session[] }) {
  return (
    <div className="space-y-4">
      {sessions.map((session, i) => {
        if (session.type === "break")      return <BreakStrip      key={i} session={session} />;
        if (session.type === "concurrent") return <ConcurrentBlock key={i} session={session} />;
        return                                    <SessionCard     key={i} session={session} />;
      })}
    </div>
  );
}
