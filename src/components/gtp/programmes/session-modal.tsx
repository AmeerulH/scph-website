"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Clock,
  MapPin,
  Copy,
  Check,
  Linkedin,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";
import { GTP_2026_REGISTRATION_URL } from "@/lib/gtp-registration-url";
import { cn } from "@/lib/utils";
import type { Session, Speaker, Workshop } from "./types";
import { ProgrammeSpeakerAvatar } from "./programme-speaker-avatar";
import { TYPE_META, TYPE_GRADIENTS } from "./data";
import { SessionObjectiveBlock } from "./session-objective-block";
import { getSessionFormatLabel, getSessionVenueLine } from "./session-display-helpers";

// ─── WhatsApp icon (not in lucide) ────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionModalProps {
  session: Session | null;
  dayLabel?: string;
  onClose: () => void;
  /** When set, parallel slots in the modal open a dedicated workshop modal (desktop grid below). */
  onWorkshopClick?: (workshop: Workshop) => void;
}

function isModeratorRole(role: string | undefined): boolean {
  return Boolean(role?.trim().toLowerCase().includes("moderator"));
}

function sessionExpectsSpeakerList(type: Session["type"]) {
  return (
    type === "opening" ||
    type === "plenary" ||
    type === "lightning" ||
    type === "fireside" ||
    type === "closing"
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function SessionModal({ session, dayLabel, onClose, onWorkshopClick }: SessionModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Lock body scroll when open
  React.useEffect(() => {
    if (session) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [session]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Only render portal on client
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const modal = (
    <AnimatePresence>
      {session && (
        /* Full-screen overlay — click outside closes modal */
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop blur layer */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal panel — stops click propagation so overlay click doesn't fire */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
              session.workshops && session.workshops.length > 0
                ? "max-w-2xl sm:max-w-3xl lg:max-w-5xl"
                : "max-w-2xl sm:max-w-3xl",
            )}
            onClick={(e) => e.stopPropagation()}
          >
              {/* Close button — inside modal, top-right */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Scrollable body */}
              <div className="overflow-y-auto">

                {/* Banner image */}
                <div
                  className={cn(
                    "relative h-44 w-full bg-linear-to-br shrink-0",
                    TYPE_GRADIENTS[session.type] ?? "from-gtp-dark-teal to-gtp-teal",
                  )}
                >
                  {/* Decorative dot grid */}
                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  {/* Subtle radial glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(255,255,255,0.15),transparent_60%)]" />

                  {/* Format badge */}
                  <div className="absolute bottom-4 left-5">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
                      {TYPE_META[session.type].label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">

                  {/* Title */}
                  <h2 className="font-heading text-xl font-bold leading-snug text-gtp-dark-teal">
                    {session.title}
                  </h2>

                  {/* Time & location */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                      <span>
                        {session.time}
                        {session.durationMins
                          ? ` · ${session.durationMins} mins`
                          : ""}
                        {dayLabel ? ` · ${dayLabel}` : ""}
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-gray-500">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                      <span className="italic wrap-anywhere">{getSessionVenueLine(session)}</span>
                    </div>
                  </div>

                  {/* Format label */}
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Format: </span>
                    <span className="text-sm text-gray-500">{getSessionFormatLabel(session)}</span>
                  </div>

                  <SessionObjectiveBlock text={session.objective} className="mt-4" />

                  {/* Description */}
                  <div className="mt-5 border-t border-gray-100 pt-5 space-y-3 text-sm text-gray-600 leading-relaxed">
                    <p className="italic text-gray-500">
                      This session is part of the Global Tipping Points 2026 Conference hosted by Sunway Centre for Planetary Health in Kuala Lumpur, Malaysia. The published programme is indicative and may change.
                    </p>
                    <p>
                      The conference brings together scientists, policymakers, business leaders, and civil society to address critical tipping points. Session formats and themes are confirmed; named speakers and detailed agendas will be published closer to the event where not yet listed.
                    </p>
                    {session.type === "plenary" && (
                      <p>
                        As a plenary session, all conference participants are invited and encouraged to attend. Session details, including confirmed speakers and a detailed agenda, will be published closer to the event.
                      </p>
                    )}
                    {(session.type === "concurrent" || session.type === "research") && (
                      <p>
                        {session.type === "research"
                          ? "These research sessions run in parallel with action workshops. Participants may choose the track most relevant to their interests. Capacity may be limited for individual sessions."
                          : "These action workshops run simultaneously. Participants may choose the session most relevant to their interests. Capacity may be limited for individual sessions."}
                      </p>
                    )}
                  </div>

                  {/* ── 2-column grid on desktop ─────────────────────── */}
                  <div className="mt-6 border-t border-gray-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

                    {/* ── Left column: Share + Note + Register ── */}
                    <div className="flex flex-col gap-4">

                      {/* Share */}
                      <div>
                        <p className="mb-3 text-sm font-semibold text-gray-700">Share:</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0077B5] text-white transition-opacity hover:opacity-90"
                            aria-label="Share on LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-90"
                            aria-label="Share on Facebook"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(session.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90"
                            aria-label="Share on X"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(session.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90"
                            aria-label="Share on WhatsApp"
                          >
                            <WhatsAppIcon className="h-4 w-4" />
                          </a>
                          <a
                            href={`mailto:?subject=${encodeURIComponent(session.title)}&body=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-500 text-white transition-opacity hover:opacity-90"
                            aria-label="Share via email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        </div>

                        {/* Copy link */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 truncate">
                            {typeof window !== "undefined" ? window.location.href : "https://scph.sunway.edu.my/events/gtp-2026/programmes"}
                          </div>
                          <button
                            onClick={handleCopyLink}
                            className={cn(
                              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                              copied
                                ? "bg-gtp-green text-white"
                                : "bg-gtp-teal text-white hover:bg-gtp-teal-dark",
                            )}
                          >
                            {copied ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy Link
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Note */}
                      <div className="rounded-xl border border-gtp-teal/20 bg-gtp-teal/5 px-4 py-3">
                        <p className="text-xs leading-relaxed text-gtp-dark-teal/80">
                          <span className="font-semibold">Please note:</span> As space is limited, in-person attendance at certain sessions is subject to confirmation. We warmly encourage early registration, and we will do our best to accommodate everyone.
                        </p>
                      </div>

                      {/* Register button */}
                      <a
                        href={GTP_2026_REGISTRATION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-gtp-orange py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gtp-orange-dark"
                      >
                        Register to Join
                        <span aria-hidden>→</span>
                      </a>

                    </div>

                    {/* ── Right column: Hosted By + Speakers / Workshops ── */}
                    <div className="flex flex-col gap-6">

                      {/* Hosted By */}
                      <div>
                        <p className="mb-3 text-sm font-semibold text-gray-700">Hosted By</p>
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                            <span className="text-xs font-bold text-gtp-dark-teal">SCPH</span>
                          </div>
                          <div className="text-xs text-gray-500 leading-relaxed">
                            <p className="font-semibold text-gray-700">Sunway Centre for Planetary Health</p>
                            <p>Sunway University, Kuala Lumpur</p>
                          </div>
                        </div>
                      </div>

                      {/* Speakers (named) or TBC */}
                      {session.speakers && session.speakers.length > 0 && (
                        <div className="space-y-4">
                          {session.type === "fireside" ? (
                            <FiresideSpeakersBlock speakers={session.speakers} />
                          ) : (
                            <div>
                              <p className="mb-3 text-sm font-semibold text-gtp-dark-teal">Speakers:</p>
                              <div className="space-y-3">
                                {session.speakers.map((sp, i) => (
                                  <SpeakerRow key={`${sp.name}-${i}`} speaker={sp} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {sessionExpectsSpeakerList(session.type) &&
                        (!session.speakers || session.speakers.length === 0) && (
                          <div>
                            <p className="mb-3 text-sm font-semibold text-gtp-dark-teal">Speakers</p>
                            <p className="text-sm leading-relaxed text-gray-600">
                              {(session.speakerCount ?? 0) > 0 ? (
                                <>
                                  Speakers to be confirmed. This session is planned with
                                  approximately{" "}
                                  <span className="font-semibold text-gray-800">
                                    {session.speakerCount}
                                  </span>{" "}
                                  speaker
                                  {session.speakerCount !== 1 ? "s" : ""}; names and bios will be
                                  published closer to the event.
                                </>
                              ) : (
                                <>
                                  Speakers to be confirmed. Further details will be published
                                  closer to the event.
                                </>
                              )}
                            </p>
                          </div>
                        )}

                    </div>

                  </div>

                  {/* Parallel slots: full-width row below share / hosted columns (grid on desktop) */}
                  {session.workshops && session.workshops.length > 0 && (
                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <p className="mb-3 text-sm font-semibold text-gtp-dark-teal">
                        Sessions Available
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {session.workshops.map((w) => {
                          const clickable = Boolean(onWorkshopClick);
                          const inner = (
                            <>
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gtp-teal/10 text-xs font-bold text-gtp-teal"
                                aria-hidden
                              >
                                {w.number}
                              </span>
                              <div className="min-w-0 flex-1 text-left">
                                <span className="text-sm font-medium leading-snug text-gtp-dark-teal">
                                  {w.title}
                                </span>
                                {w.objective?.trim() ? (
                                  <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-gray-600">
                                    {w.objective.trim()}
                                  </p>
                                ) : null}
                                {clickable ? (
                                  <span className="mt-2 inline-block text-xs font-semibold text-gtp-teal">
                                    View details →
                                  </span>
                                ) : null}
                              </div>
                            </>
                          );
                          const shellClass = cn(
                            "flex items-start gap-3 rounded-xl border bg-gray-50/90 p-4 text-left transition-colors",
                            clickable
                              ? "cursor-pointer border-gray-100 hover:border-gtp-teal/35 hover:bg-white"
                              : "border-gray-100",
                          );
                          return clickable ? (
                            <button
                              key={w.number}
                              type="button"
                              onClick={() => onWorkshopClick!(w)}
                              className={shellClass}
                            >
                              {inner}
                            </button>
                          ) : (
                            <div key={w.number} className={shellClass}>
                              {inner}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return ReactDOM.createPortal(modal, document.body);
}

// ─── Fireside: moderator vs speakers (role field when set, else first row = moderator) ─

function FiresideSpeakersBlock({ speakers }: { speakers: Speaker[] }) {
  const anyRole = speakers.some((s) => s.sessionRole?.trim());
  let moderators: Speaker[];
  let others: Speaker[];

  if (anyRole) {
    moderators = speakers.filter((s) => isModeratorRole(s.sessionRole));
    others = speakers.filter((s) => !isModeratorRole(s.sessionRole));
    if (moderators.length === 0) {
      return (
        <div>
          <p className="mb-3 text-sm font-semibold text-gtp-dark-teal">Speakers:</p>
          <div className="space-y-3">
            {speakers.map((sp, i) => (
              <SpeakerRow key={`${sp.name}-${i}`} speaker={sp} />
            ))}
          </div>
        </div>
      );
    }
  } else {
    moderators = speakers[0] ? [speakers[0]] : [];
    others = speakers.slice(1);
  }

  return (
    <>
      {moderators.length > 0 ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-gtp-dark-teal">Moderator:</p>
          <div className="space-y-3">
            {moderators.map((sp, i) => (
              <SpeakerRow
                key={`${sp.name}-mod-${i}`}
                speaker={sp}
                suppressRoleWhenModerator
              />
            ))}
          </div>
        </div>
      ) : null}
      {others.length > 0 ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-gtp-dark-teal">Speakers:</p>
          <div className="space-y-3">
            {others.map((sp, i) => (
              <SpeakerRow key={`${sp.name}-sp-${i}`} speaker={sp} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

// ─── Speaker row ──────────────────────────────────────────────────────────────

function SpeakerRow({
  speaker,
  suppressRoleWhenModerator,
}: {
  speaker: Speaker;
  suppressRoleWhenModerator?: boolean;
}) {
  const role = speaker.sessionRole?.trim();
  const showRole = Boolean(role && !(suppressRoleWhenModerator && isModeratorRole(speaker.sessionRole)));

  return (
    <div className="flex items-center gap-3">
      <ProgrammeSpeakerAvatar imageUrl={speaker.imageUrl} name={speaker.name} />
      <div className="min-w-0">
        {showRole ? (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gtp-teal">{role}</p>
        ) : null}
        <p className="text-sm font-semibold text-gray-800">{speaker.name}</p>
        {speaker.designation && (
          <p className="text-xs text-gtp-teal leading-relaxed">{speaker.designation}</p>
        )}
      </div>
    </div>
  );
}
