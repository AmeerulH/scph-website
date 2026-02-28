import { Coffee, Utensils } from "lucide-react";
import type { Session } from "./types";

export function BreakStrip({ session }: { session: Session }) {
  const Icon = session.breakIcon === "lunch" ? Utensils : Coffee;
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl bg-gtp-dark-teal/5 px-6 py-4">
      <Icon className="h-4 w-4 text-gtp-teal/60" />
      <span className="text-sm font-semibold text-gtp-dark-teal/60">
        {session.breakLabel}
      </span>
      {session.durationMins && (
        <span className="rounded-full bg-gtp-dark-teal/8 px-2 py-0.5 text-xs text-gtp-dark-teal/50">
          {session.durationMins} mins
        </span>
      )}
      <span className="text-xs text-gtp-dark-teal/40">{session.time}</span>
    </div>
  );
}
