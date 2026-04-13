import type { Workshop } from "./types";
import { SpeakerPlaceholder } from "./speaker-placeholder";
import { SessionObjectiveBlock } from "./session-objective-block";
import { AddToGoogleCalendarLink } from "./add-to-google-calendar-link";
import { cn } from "@/lib/utils";

export function WorkshopSubCard({
  w,
  googleCalendarHref,
  onSelect,
}: {
  w: Workshop;
  googleCalendarHref?: string | null;
  /** Opens the workshop detail modal; click does not bubble to the parent concurrent block. */
  onSelect?: () => void;
}) {
  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={(e) => {
        if (onSelect) {
          e.stopPropagation();
          onSelect();
        }
      }}
      onKeyDown={(e) => {
        if (!onSelect) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onSelect();
        }
      }}
      className={cn(
        "rounded-xl border border-gray-100 bg-gray-50/60 p-4",
        onSelect &&
          "cursor-pointer transition-colors hover:border-gtp-teal/35 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal/40",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gtp-teal/15 text-xs font-bold text-gtp-dark-teal">
          {w.number}
        </span>
        <p className="text-sm font-medium leading-snug text-gray-700">
          {w.title}
        </p>
      </div>
      <SessionObjectiveBlock
        text={w.objective}
        className="mt-2 pl-9"
        collapsibleOnMobile
      />
      <div className="mt-3 pl-9">
        <SpeakerPlaceholder />
      </div>
      {onSelect ? (
        <p className="mt-2 pl-9 text-xs font-semibold text-gtp-teal">View details</p>
      ) : null}
      {googleCalendarHref ? (
        <div className="mt-2 pl-9">
          <AddToGoogleCalendarLink href={googleCalendarHref} className="text-xs" />
        </div>
      ) : null}
    </div>
  );
}
