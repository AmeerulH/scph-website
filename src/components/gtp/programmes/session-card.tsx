import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "./types";
import { TYPE_META } from "./data";
import { SpeakerPlaceholder } from "./speaker-placeholder";

export function SessionCard({ session }: { session: Session }) {
  const meta = TYPE_META[session.type];
  const MetaIcon = meta.Icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
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

        {session.speakerCount && session.speakerCount > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: session.speakerCount }).map((_, i) => (
              <SpeakerPlaceholder key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
