import type { Workshop } from "./types";
import { SpeakerPlaceholder } from "./speaker-placeholder";
import { SessionObjectiveBlock } from "./session-objective-block";
import { AddToGoogleCalendarLink } from "./add-to-google-calendar-link";
import { cn } from "@/lib/utils";
import {
  normalizeSpeakerName,
  workshopHasSpeaker,
} from "./programme-speaker-filter";

export function WorkshopSubCard({
  w,
  googleCalendarHref,
  onSelect,
  highlightSpeaker,
}: {
  w: Workshop;
  googleCalendarHref?: string | null;
  /** Opens the workshop detail modal; click does not bubble to the parent concurrent block. */
  onSelect?: () => void;
  /** When set, emphasize tiles that include this speaker and show their name. */
  highlightSpeaker?: string;
}) {
  const isMatched =
    !!highlightSpeaker && workshopHasSpeaker(w, highlightSpeaker);
  const matchedSpeaker =
    isMatched && highlightSpeaker
      ? w.speakers?.find(
          (s) =>
            normalizeSpeakerName(s.name) === normalizeSpeakerName(highlightSpeaker),
        )
      : undefined;
  const isMuted = !!highlightSpeaker && !isMatched;

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
        "rounded-xl border p-4 transition-colors duration-200",
        isMatched
          ? "border-gtp-teal bg-gtp-teal/10 ring-2 ring-gtp-teal/25"
          : isMuted
            ? "border-gray-100 bg-gray-50/40 opacity-45"
            : "border-gray-100 bg-gray-50/60",
        onSelect &&
          !isMatched &&
          "cursor-pointer hover:border-gtp-teal/35 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal/40",
        onSelect &&
          isMatched &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal/40",
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
        {matchedSpeaker ? (
          <p className="text-xs font-semibold text-gtp-dark-teal">
            {matchedSpeaker.name}
            {matchedSpeaker.designation ? (
              <span className="font-normal text-gray-500">
                {" "}
                · {matchedSpeaker.designation}
              </span>
            ) : null}
          </p>
        ) : (
          <SpeakerPlaceholder />
        )}
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
