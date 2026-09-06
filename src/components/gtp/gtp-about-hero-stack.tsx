import type { GtpAboutHeroCopy } from "@/data/gtp-about-page-defaults";
import type { GtpFeaturedCarouselSession } from "@/sanity/queries";
import type { GtpCountdownTimeLeft } from "@/lib/gtp-countdown";
import { GtpCountdown } from "./countdown";
import { GtpEventsPreviewCarousel } from "./events-preview-carousel";
import { GtpCampaignHero } from "./gtp-campaign-hero";

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
    <div className="relative overflow-hidden bg-gtp-dark-teal">
      <GtpCampaignHero slides={heroCopy.campaignSlides} />
      <div className="relative">
        <GtpCountdown initialTime={countdownInitial} />
      </div>
      <GtpAboutImportantDatesStrip
        eyebrow={heroCopy.importantDatesEyebrow}
        items={heroCopy.importantDates}
      />
      <GtpEventsPreviewCarousel sessions={carouselSessions} />
    </div>
  );
}
