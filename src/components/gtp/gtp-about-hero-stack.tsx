import type { GtpAboutHeroCopy } from "@/data/gtp-about-page-defaults";
import type { GtpFeaturedCarouselSession } from "@/sanity/queries";
import type { GtpCountdownTimeLeft } from "@/lib/gtp-countdown";
import { GtpCountdown } from "./countdown";
import { GtpEventsPreviewCarousel } from "./events-preview-carousel";
import { GtpHeroGradient } from "./hero-gradient";

function GtpAboutImportantDatesStrip({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: GtpAboutHeroCopy["importantDates"];
}) {
  if (items.length === 0) return null;
  return (
    <div className="border-t border-white/10 bg-black/15 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-10">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gtp-teal/90 sm:text-left">
        {eyebrow}
      </p>
      <ul className="flex flex-wrap items-start justify-center gap-x-10 gap-y-4 sm:justify-start">
        {items.map(({ label, date }) => (
          <li key={label} className="min-w-0 text-center sm:text-left">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-white/45">
              {label}
            </span>
            <span className="mt-0.5 block text-sm font-semibold text-white/90">
              {date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GtpAboutHeroStack({
  carouselSessions,
  heroCopy,
  countdownInitial,
}: {
  carouselSessions: GtpFeaturedCarouselSession[];
  heroCopy: GtpAboutHeroCopy;
  countdownInitial: GtpCountdownTimeLeft;
}) {
  return (
    <div className="relative min-h-[min(88svh,1000px)] overflow-hidden bg-linear-to-br from-gtp-dark-teal via-[#0a6070] to-gtp-dark-teal">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_30%,rgba(0,156,180,0.30),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_60%,rgba(134,188,37,0.13),transparent_48%)]" />
      <GtpHeroGradient copy={heroCopy} />
      <GtpCountdown initialTime={countdownInitial} />
      <GtpAboutImportantDatesStrip
        eyebrow={heroCopy.importantDatesEyebrow}
        items={heroCopy.importantDates}
      />
      <GtpEventsPreviewCarousel sessions={carouselSessions} />
    </div>
  );
}
