import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GtpProgrammeActivityPage } from "@/data/gtp-programme-activity-defaults";
import { safeRegistrationUrl } from "@/lib/gtp-activity-registration";

export function SensorialStationRegistration({ page }: { page: GtpProgrammeActivityPage }) {
  const stations = [
    { id: "scent", name: "Scent Station", url: page.scentRegistrationUrl },
    { id: "taste", name: "Taste Station", url: page.tasteRegistrationUrl },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {stations.map((station) => {
        const href = safeRegistrationUrl(station.url);
        const label = `Register for ${station.name}`;
        const pendingId = `${station.id}-registration-pending`;
        return (
          <div key={station.id}>
            {href ? (
              <Button variant="gtpCta" asChild className="min-h-13 h-auto w-full whitespace-normal bg-gtp-orange-dark px-5 py-3 hover:bg-gtp-dark-teal">
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                  <ArrowUpRight aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            ) : (
              <>
                <Button type="button" disabled aria-describedby={pendingId}
                  className="min-h-13 h-auto w-full whitespace-normal bg-slate-200 px-5 py-3 text-slate-600 shadow-none disabled:opacity-100">
                  {label}
                </Button>
                <p id={pendingId} className="mt-2 text-sm leading-relaxed text-slate-600">
                  Registration opening soon
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
