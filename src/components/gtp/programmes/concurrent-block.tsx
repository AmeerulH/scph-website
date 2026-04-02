import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "./types";
import { WorkshopSubCard } from "./workshop-sub-card";

export function ConcurrentBlock({ session, onClick }: { session: Session; onClick?: () => void }) {
  const isResearch = session.type === "research";

  const workshopSessions =
    session.workshops?.filter((w) => w.title.startsWith("Workshop Session:")) ?? [];
  const researchSessions =
    session.workshops?.filter((w) => w.title.startsWith("Research Session:")) ?? [];

  const hasBothTypes = workshopSessions.length > 0 && researchSessions.length > 0;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-sm",
        isResearch
          ? "border-gtp-orange/25"
          : "border-gtp-teal/20",
        onClick &&
          (isResearch
            ? "cursor-pointer transition-shadow duration-200 hover:border-gtp-orange/45 hover:shadow-md"
            : "cursor-pointer transition-shadow duration-200 hover:border-gtp-teal/50 hover:shadow-md"),
      )}
      onClick={onClick}
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
        <div className="flex items-center gap-2 text-gtp-dark-teal/50">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-xs italic">Location TBC</span>
        </div>
        <span
          className={cn(
            "ml-auto rounded-full px-3 py-1 text-xs font-semibold",
            isResearch
              ? "bg-gtp-orange/15 text-gtp-orange-dark"
              : "bg-gtp-teal/15 text-gtp-dark-teal",
          )}
        >
          {isResearch ? "Parallel research track" : "Sessions running simultaneously"}
        </span>
      </div>

      <div className="px-6 py-5">
        <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
          {session.title}
        </h3>

        {hasBothTypes ? (
          /* Two-column layout: Workshop Sessions | Research Sessions */
          <div className="mt-5 grid grid-cols-1 gap-6 border-l-2 border-gtp-teal/25 pl-5 md:grid-cols-2">
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gtp-teal">
                <span className="h-1.5 w-1.5 rounded-full bg-gtp-teal" />
                Workshop Sessions
              </h4>
              <div className="space-y-3">
                {workshopSessions.map((w) => (
                  <WorkshopSubCard key={w.number} w={w} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gtp-orange">
                <span className="h-1.5 w-1.5 rounded-full bg-gtp-orange" />
                Research Sessions
              </h4>
              <div className="space-y-3">
                {researchSessions.map((w) => (
                  <WorkshopSubCard key={w.number} w={w} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Single-column fallback */
          <div className="mt-5 space-y-3 border-l-2 border-gtp-teal/25 pl-5">
            {session.workshops?.map((w) => (
              <WorkshopSubCard key={w.number} w={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
