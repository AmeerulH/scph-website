import Link from "next/link";
import { Clock, Lock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildProgrammeGoogleCalendarUrl } from "@/lib/gtp-programme-google-calendar";
import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import { cn } from "@/lib/utils";
import type { Session } from "./types";
import { AddToGoogleCalendarLink } from "./add-to-google-calendar-link";
import { SessionObjectiveBlock } from "./session-objective-block";
import { getSessionVenueLine } from "./session-display-helpers";

const ACTION_WORKSHOPS_HREF =
  "/events/gtp-2026/programmes/action-workshops#action-workshops";

export function ConcurrentBlock({
  session,
  calendarTabId,
}: {
  session: Session;
  calendarTabId: GtpProgrammeCalendarDayTab;
}) {
  const isResearch = session.type === "research";
  const subpageButtonLabel = session.subpageButtonLabel?.trim() || (
    isResearch
      ? "View the research schedule and registration"
      : "View Action Workshops and Research Sessions"
  );
  const researchHref = calendarTabId === "day2" ? "/events/gtp-2026/programmes/action-workshops#day-13-research"
    : calendarTabId === "day3" ? "/events/gtp-2026/programmes/action-workshops#day-14-research" : null;

  const blockGoogleCalHref = buildProgrammeGoogleCalendarUrl({
    tabId: calendarTabId,
    session,
  });

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-sm",
        isResearch
          ? "border-gtp-orange/25"
          : "border-gtp-teal/20",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-t-2xl border-b px-6 py-4",
          isResearch
            ? "border-gtp-orange/20 bg-gtp-orange/8"
            : "border-gtp-teal/15 bg-gtp-teal/8",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            isResearch ? "text-gtp-orange/80" : "text-gtp-teal/70",
          )}
        >
          <Clock className="h-4 w-4" />
          <span className="text-sm font-semibold">{session.time}</span>
          {session.durationMins && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                isResearch ? "bg-gtp-orange/15" : "bg-gtp-teal/15",
              )}
            >
              {session.durationMins} mins
            </span>
          )}
        </div>
        <div className="flex min-w-0 max-w-full items-start gap-2 text-gtp-dark-teal/50">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="text-xs italic wrap-anywhere">{getSessionVenueLine(session)}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              isResearch
                ? "bg-gtp-orange/15 text-gtp-orange-dark"
                : "bg-gtp-teal/15 text-gtp-dark-teal",
            )}
          >
            {isResearch ? "Parallel research track" : "Sessions running simultaneously"}
          </span>
          {session.closedEvent ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gtp-dark-teal px-3 py-1 text-xs font-semibold text-white">
              <Lock className="h-3 w-3" />
              Closed
            </span>
          ) : null}
        </div>
        {blockGoogleCalHref ? (
          <div className="flex w-full basis-full justify-end pt-1">
            <AddToGoogleCalendarLink href={blockGoogleCalHref} className="text-xs" />
          </div>
        ) : null}
      </div>

      <div className="px-6 py-5">
        <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">{session.title}</h3>
        <SessionObjectiveBlock
          text={session.objective}
          className="mt-4"
          collapsibleOnMobile
        />

        {isResearch ? null : (
          <div className="mt-6">
            <Button variant="gtpCta" className="h-auto whitespace-normal px-5 py-3 text-center" asChild>
              <Link href={ACTION_WORKSHOPS_HREF}>
                {subpageButtonLabel}
              </Link>
            </Button>
          </div>
        )}

        {isResearch && researchHref ? <div className="mt-6"><Button variant="gtpCta" className="h-auto whitespace-normal px-5 py-3 text-center" asChild><Link href={researchHref} onClick={(event) => event.stopPropagation()}>{subpageButtonLabel}</Link></Button></div> : null}
      </div>
    </div>
  );
}
