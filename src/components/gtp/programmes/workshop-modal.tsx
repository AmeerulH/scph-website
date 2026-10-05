"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, MapPin, UserCircle2 } from "lucide-react";
import { ProgrammeSpeakerAvatar } from "./programme-speaker-avatar";
import type { GtpSessionModalHostedBy } from "@/sanity/queries";
import { cn } from "@/lib/utils";
import type { Session, Workshop } from "./types";
import { TYPE_GRADIENTS } from "./data";
import { SessionObjectiveBlock } from "./session-objective-block";
import { getSessionVenueLine } from "./session-display-helpers";
import {
  ProgrammeModalHostedByBlock,
  ProgrammeModalShareRegisterColumn,
} from "./programme-modal-chrome";
import {
  actionWorkshopPeople,
  programmePersonRoleLabel,
} from "./programme-person-roles";
import { resolveProgrammeHostedBy } from "./resolve-hosted-by";
import { buildProgrammeGoogleCalendarUrl } from "@/lib/gtp-programme-google-calendar";
import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import { AddToGoogleCalendarLink } from "./add-to-google-calendar-link";

export type WorkshopModalContext = {
  workshop: Workshop;
  parent: Session;
};

export function WorkshopModal({
  context,
  dayLabel,
  calendarTabId,
  hostedBy,
  onClose,
  workshopRegistration = "redirect",
}: {
  context: WorkshopModalContext | null;
  dayLabel?: string;
  calendarTabId: GtpProgrammeCalendarDayTab;
  /** Same programme-level “Hosted by” block as the main session modal. */
  hostedBy: GtpSessionModalHostedBy;
  onClose: () => void;
  /** Action Workshops page verifies registration in this popup. Programme page links across. */
  workshopRegistration?: "redirect" | "inline";
}) {
  const open = context != null;

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const w = context?.workshop;
  const parent = context?.parent;

  const workshopGoogleCalHref =
    w && parent
      ? buildProgrammeGoogleCalendarUrl({
          tabId: calendarTabId,
          session: parent,
          title: w.title,
          detailsPrefixLines: [
            `Part of: ${parent.title}`,
            ...(typeof w.objective === "string" && w.objective.trim()
              ? [w.objective.trim()]
              : []),
          ],
          includeSessionObjective: false,
        })
      : null;

  const modal =
    open && w && parent ? (
      <AnimatePresence>
        <motion.div
          key="workshop-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            key="workshop-modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="max-h-[90vh] overflow-y-auto">
              <div
                className={cn(
                  "relative h-32 w-full shrink-0 bg-linear-to-br",
                  TYPE_GRADIENTS[parent.type] ?? "from-gtp-dark-teal to-gtp-teal",
                )}
              >
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="absolute bottom-3 left-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
                    {parent.type === "research" ? "Research slot" : "Workshop"}
                  </span>
                  {w.number ? (
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white/95 ring-1 ring-white/15">
                      #{w.number}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-xs font-medium text-gtp-teal/80">Part of: {parent.title}</p>
                <h2 className="mt-1 font-heading text-lg font-bold leading-snug text-gtp-dark-teal sm:text-xl">
                  {w.title}
                </h2>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                    <span>
                      {parent.time}
                      {parent.durationMins ? ` · ${parent.durationMins} mins` : ""}
                      {dayLabel ? ` · ${dayLabel}` : ""}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-gray-500">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                    <span className="italic wrap-anywhere">{getSessionVenueLine(parent)}</span>
                  </div>
                  {workshopGoogleCalHref ? (
                    <div className="pt-1">
                      <AddToGoogleCalendarLink
                        href={workshopGoogleCalHref}
                        stopPropagation={false}
                        className="text-sm"
                      />
                    </div>
                  ) : null}
                </div>

                <SessionObjectiveBlock text={w.objective} className="mt-4" />

                <div className="mt-6 grid grid-cols-1 gap-8 border-t border-gray-100 pt-5 lg:grid-cols-2 lg:gap-x-10">
                  <div className="order-2 lg:order-1">
                    <ProgrammeModalShareRegisterColumn
                      shareTitle={w.title}
                      showWorkshopRegistration={parent.type === "concurrent"}
                      workshopRegistration={workshopRegistration}
                      workshopTitle={w.title}
                    />
                  </div>
                  <div className="order-1 flex flex-col gap-6 lg:order-2">
                    <ProgrammeModalHostedByBlock
                      hostedBy={resolveProgrammeHostedBy(
                        hostedBy,
                        parent.hostedBy,
                        w.hostedBy,
                      )}
                    />
                    <FacilitatorsSpeakersBlock workshop={w} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    ) : null;

  if (!mounted) return null;
  return ReactDOM.createPortal(modal, document.body);
}

function FacilitatorsSpeakersBlock({ workshop }: { workshop: Workshop }) {
  const people = actionWorkshopPeople(workshop);
  const speakerCount = workshop.speakerCount ?? 0;

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gtp-dark-teal">Facilitators/Speakers</p>
      {people.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {people.map((person, index) => (
            <li key={`${person.name}-${index}`} className="flex items-center gap-3">
              <ProgrammeSpeakerAvatar imageUrl={person.imageUrl} name={person.name} />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gtp-teal">
                  {programmePersonRoleLabel(person)}
                </p>
                <p className="text-sm font-semibold text-gray-800">{person.name}</p>
                {person.designation ? (
                  <p className="text-xs leading-relaxed text-gtp-teal">{person.designation}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-3">
          <UserCircle2 className="h-9 w-9 shrink-0 text-gray-300" />
          <div>
            <p className="text-sm font-medium text-gray-600">To be confirmed</p>
            <p className="text-xs text-gray-400">
              {speakerCount > 0
                ? `Approx. ${speakerCount} speaker${speakerCount === 1 ? "" : "s"} planned`
                : "Details coming soon"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
