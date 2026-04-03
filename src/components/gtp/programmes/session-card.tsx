"use client";

import * as React from "react";
import { Clock, MapPin, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "./types";
import { TYPE_META } from "./data";
import { SpeakerPlaceholder } from "./speaker-placeholder";

export function SessionCard({
  session,
  highlightSession,
  onClick,
}: {
  session: Session;
  highlightSession?: string;
  onClick?: () => void;
}) {
  const meta = TYPE_META[session.type];
  const MetaIcon = meta.Icon;
  const cardRef = React.useRef<HTMLDivElement>(null);

  const namedSpeakers = session.speakers ?? [];
  const placeholderCount =
    namedSpeakers.length === 0 && session.speakerCount
      ? session.speakerCount
      : 0;

  const isSessionHighlighted =
    !!highlightSession &&
    session.title.toLowerCase() === highlightSession.toLowerCase();

  // Scroll this card into view when it is the highlighted target
  React.useEffect(() => {
    if (!isSessionHighlighted || !cardRef.current) return;
    // Small delay so the tab switch + render completes before scrolling
    const id = setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => clearTimeout(id);
  }, [isSessionHighlighted]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "rounded-2xl border bg-white shadow-sm transition-all duration-500",
        isSessionHighlighted
          ? "border-gtp-teal ring-2 ring-gtp-teal/30 shadow-md"
          : "border-gray-100",
        onClick && "cursor-pointer hover:shadow-md hover:border-gtp-teal/30",
      )}
      onClick={onClick}
    >
      {/* Card header strip */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2 text-gtp-dark-teal/60">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-semibold">{session.time}</span>
          {session.durationMins && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {session.durationMins} mins
            </span>
          )}
        </div>
        {!session.isEvening && (
          <div className="flex items-center gap-1.5 text-gray-400">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs italic">Location TBC</span>
          </div>
        )}
        <span
          className={cn(
            "ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            meta.badgeClass
          )}
        >
          <MetaIcon className="h-3 w-3" />
          {meta.label}
        </span>
      </div>

      {/* Card body */}
      <div className="px-6 py-5">
        <h3 className="font-heading text-lg font-bold leading-snug text-gtp-dark-teal">
          {session.title}
        </h3>

        {/* Named speakers */}
        {namedSpeakers.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {namedSpeakers.map((sp) => (
              <div
                key={sp.name}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <UserCircle2 className="h-8 w-8 shrink-0 text-gray-300" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-500">
                    {sp.name}
                  </p>
                  {sp.designation && (
                    <p className="truncate text-xs text-gray-400">{sp.designation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback placeholders when no names confirmed yet */}
        {placeholderCount > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <SpeakerPlaceholder key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
