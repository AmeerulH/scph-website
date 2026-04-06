import type { GtpAboutHeroCopy } from "@/data/gtp-about-page-defaults";
import type { GtpFeaturedCarouselSession } from "@/sanity/queries";
import { GtpCountdown } from "./countdown";
import { GtpEventsPreviewCarousel } from "./events-preview-carousel";
import { GtpHeroGradient } from "./hero-gradient";

export function GtpAboutHeroStack({
  carouselSessions,
  heroCopy,
}: {
  carouselSessions: GtpFeaturedCarouselSession[];
  heroCopy: GtpAboutHeroCopy;
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
      <GtpCountdown />
      <GtpEventsPreviewCarousel sessions={carouselSessions} />
    </div>
  );
}
