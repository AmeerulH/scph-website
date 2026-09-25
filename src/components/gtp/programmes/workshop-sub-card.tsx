import type { Workshop } from "./types";
import { SpeakerPlaceholder } from "./speaker-placeholder";
import { SessionObjectiveBlock } from "./session-objective-block";
import { AddToGoogleCalendarLink } from "./add-to-google-calendar-link";
import { ProgrammeSpeakerAvatar } from "./programme-speaker-avatar";
import { cn } from "@/lib/utils";
import {
  normalizeSpeakerName,
  sortSpeakersModeratorFirst,
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
  /** When set, emphasize the matching speaker and mute the other names. */
  highlightSpeaker?: string;
}) {
  const namedSpeakers = sortSpeakersModeratorFirst(w.speakers ?? []);
  const namedFacilitators = w.facilitators ?? [];
  const speakerKey = highlightSpeaker ? normalizeSpeakerName(highlightSpeaker) : "";
  const isMatched =
    !!highlightSpeaker && workshopHasSpeaker(w, highlightSpeaker);
  const isMuted = !!speakerKey && !isMatched;

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
      <div className="mt-3 space-y-2 pl-9">
        {namedSpeakers.length > 0 || namedFacilitators.length > 0 ? (
          [...namedSpeakers, ...namedFacilitators].map((sp, idx) => {
            const isSpeakerMatched =
              !!speakerKey && normalizeSpeakerName(sp.name) === speakerKey;
            const isSpeakerMuted = !!speakerKey && !isSpeakerMatched;
            const role =
              sp.sessionRole?.trim() ||
              (namedFacilitators.includes(sp) ? "Facilitator" : "");
            return (
              <div
                key={`${sp.name}-${idx}`}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2",
                  isSpeakerMatched
                    ? "border-gtp-teal bg-white ring-2 ring-gtp-teal/25"
                    : isSpeakerMuted
                      ? "border-gray-100 bg-white/40 opacity-45"
                      : "border-gray-100 bg-white/70",
                )}
              >
                <ProgrammeSpeakerAvatar
                  imageUrl={sp.imageUrl}
                  name={sp.name}
                  sizeClassName="h-8 w-8"
                />
                <div className="min-w-0">
                  {role ? (
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gtp-teal">
                      {role}
                    </p>
                  ) : null}
                  <p className="text-xs font-semibold text-gray-800">{sp.name}</p>
                  {sp.designation ? (
                    <p className="text-xs text-gray-400">{sp.designation}</p>
                  ) : null}
                </div>
              </div>
            );
          })
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
