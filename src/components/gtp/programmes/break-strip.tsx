import { Coffee, Utensils } from "lucide-react";
import { buildProgrammeGoogleCalendarUrl } from "@/lib/gtp-programme-google-calendar";
import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import type { Session } from "./types";
import { AddToGoogleCalendarLink } from "./add-to-google-calendar-link";

export function BreakStrip({
  session,
  calendarTabId,
}: {
  session: Session;
  calendarTabId: GtpProgrammeCalendarDayTab;
}) {
  const Icon = session.breakIcon === "lunch" ? Utensils : Coffee;
  const googleCalHref = buildProgrammeGoogleCalendarUrl({
    tabId: calendarTabId,
    session,
  });

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl bg-gtp-dark-teal/5 px-6 py-4">
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
      {googleCalHref ? (
        <AddToGoogleCalendarLink
          href={googleCalHref}
          stopPropagation={false}
          className="text-xs text-gtp-teal"
        />
      ) : null}
    </div>
  );
}
