"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GtpAboutCampaignSlide } from "@/data/gtp-about-page-defaults";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function Cta({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const internal = href.startsWith("/") || href.startsWith("#");
  return internal ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const slideBackgrounds = [
  "bg-gtp-dark-teal bg-[radial-gradient(circle_at_82%_15%,rgba(0,156,180,0.32),transparent_34%),radial-gradient(circle_at_8%_78%,rgba(134,188,37,0.20),transparent_38%)]",
  "bg-[#0a5965] bg-[radial-gradient(circle_at_88%_20%,rgba(134,188,37,0.3),transparent_32%),linear-gradient(115deg,rgba(8,58,71,0.52),transparent_60%)]",
  "bg-[#145967] bg-[radial-gradient(circle_at_12%_65%,rgba(0,156,180,0.44),transparent_38%),linear-gradient(135deg,rgba(13,77,94,0.12),rgba(5,48,60,0.5))]",
  "bg-[#35622b] bg-[radial-gradient(circle_at_82%_30%,rgba(0,156,180,0.32),transparent_34%),linear-gradient(110deg,rgba(14,67,66,0.56),transparent_66%)]",
] as const;

function SlideActions({
  slide,
  layout,
}: {
  slide: GtpAboutCampaignSlide;
  layout: "conference" | "workshops" | "breakfast" | "excursions";
}) {
  const stackOnDesktop = layout === "conference";

  return (
    <div
      className={
        stackOnDesktop
          ? "flex w-full flex-row flex-wrap gap-4 md:w-auto md:min-w-60 md:flex-col"
          : "flex flex-wrap gap-3"
      }
    >
      {slide.primaryCtaHref && slide.primaryCtaLabel ? (
        <Button
          variant="gtpCta"
          size="lg"
          className={
            stackOnDesktop
              ? "flex-1 justify-center py-7 text-base md:flex-none"
              : "justify-center px-6"
          }
          asChild
        >
          <Cta href={slide.primaryCtaHref}>
            {slide.primaryCtaLabel} <ArrowRight />
          </Cta>
        </Button>
      ) : null}
      {slide.secondaryCtaHref && slide.secondaryCtaLabel ? (
        <Button
          variant="gtpOutline"
          size="lg"
          className={
            stackOnDesktop
              ? "flex-1 justify-center border-2 border-white/50 bg-transparent py-7 text-base text-white hover:border-white hover:bg-white/10 md:flex-none"
              : "border-white/60 text-white hover:border-white hover:bg-white hover:text-gtp-dark-teal"
          }
          asChild
        >
          <Cta href={slide.secondaryCtaHref}>{slide.secondaryCtaLabel}</Cta>
        </Button>
      ) : null}
    </div>
  );
}

function CampaignSlide({
  slide,
  index,
}: {
  slide: GtpAboutCampaignSlide;
  index: number;
}) {
  const layout = ["conference", "workshops", "breakfast", "excursions"][index] as
    | "conference"
    | "workshops"
    | "breakfast"
    | "excursions";

  if (layout === "conference") {
    return (
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-start gap-8 px-6 pb-8 pt-28 md:flex-row md:items-center md:gap-16 md:pb-10 md:pt-32 lg:px-12">
        <div className="flex-1">
          <p className="inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm lg:text-base">
            {slide.badge}
          </p>
          <h1 className="mt-5 max-w-4xl text-balance font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {slide.title}
          </h1>
          {slide.lede ? (
            <p className="mt-4 max-w-2xl text-pretty text-base font-light leading-snug text-white/85 sm:text-lg md:text-xl">
              {slide.lede}
            </p>
          ) : null}
        </div>
        <SlideActions slide={slide} layout={layout} />
      </div>
    );
  }

  if (layout === "workshops") {
    return (
      <div className="mx-auto grid h-full w-full max-w-7xl items-center gap-10 px-6 pb-16 pt-28 md:grid-cols-[1.15fr_0.85fr] lg:px-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gtp-green">
            {slide.badge}
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-heading text-5xl font-bold leading-[0.98] text-white md:text-7xl">
            {slide.title}
          </h1>
          {slide.lede ? (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{slide.lede}</p>
          ) : null}
          <div className="mt-8">
            <SlideActions slide={slide} layout={layout} />
          </div>
        </div>
        <div className="hidden border-l border-gtp-green/40 pl-8 md:block">
          <p className="font-heading text-7xl font-bold leading-none text-gtp-green/85">13—14</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            October · Kuala Lumpur
          </p>
          <p className="mt-8 max-w-56 text-xl leading-snug text-white">
            Ideas made practical, together.
          </p>
        </div>
      </div>
    );
  }

  if (layout === "breakfast") {
    return (
      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-6 pb-16 pt-28 lg:px-12">
        <div className="grid w-full items-end gap-8 border-y border-white/20 py-8 md:grid-cols-[0.7fr_1.3fr] md:py-10">
          <div className="md:pb-2">
            <p className="inline-flex rounded-full bg-gtp-teal px-4 py-2 text-sm font-semibold text-gtp-dark-teal">
              {slide.badge}
            </p>
            <p className="mt-6 max-w-52 text-lg leading-snug text-white/70">
              A morning conversation at the edge of human and artificial intelligence.
            </p>
          </div>
          <div>
            <h1 className="max-w-3xl text-balance font-heading text-4xl font-bold leading-[1.02] text-white sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>
            {slide.lede ? (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{slide.lede}</p>
            ) : null}
            <div className="mt-7">
              <SlideActions slide={slide} layout={layout} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid h-full w-full max-w-7xl items-center gap-8 px-6 pb-16 pt-28 md:grid-cols-[1fr_0.9fr] lg:px-12">
      <div className="relative h-40 overflow-hidden rounded-full border border-gtp-green/40 bg-gtp-green/15 md:order-2 md:h-64">
        <div className="absolute -right-8 -top-16 size-56 rounded-full border-28 border-gtp-teal/45" />
        <div className="absolute bottom-7 left-8 font-heading text-4xl font-bold text-white/90">Beyond the venue</div>
      </div>
      <div className="md:order-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gtp-green">{slide.badge}</p>
        <h1 className="mt-4 max-w-3xl text-balance font-heading text-5xl font-bold leading-[0.98] text-white md:text-6xl">
          {slide.title}
        </h1>
        {slide.lede ? (
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{slide.lede}</p>
        ) : null}
        <div className="mt-8">
          <SlideActions slide={slide} layout={layout} />
        </div>
      </div>
    </div>
  );
}

export function GtpCampaignHero({
  slides,
}: {
  slides: GtpAboutCampaignSlide[];
}) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const count = slides.length;
  const slide = slides[active] ?? slides[0];
  const background = slideBackgrounds[active % slideBackgrounds.length];

  if (!slide) return null;

  const previous = () => setActive((index) => (index - 1 + count) % count);
  const next = () => setActive((index) => (index + 1) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="GTP 2026 highlights"
      className="relative h-112.5 overflow-hidden bg-gtp-dark-teal sm:h-117.5 lg:h-122.5"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slide.title}
          aria-live="polite"
          className={`absolute inset-0 ${background}`}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.06]" />
          <CampaignSlide slide={slide} index={active} />
        </motion.div>
      </AnimatePresence>
      {count > 1 ? (
        <div className="absolute bottom-6 right-6 flex gap-2 lg:bottom-8 lg:right-12">
          <div className="flex gap-2">
            <button type="button" onClick={previous} className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10" aria-label="Previous highlight">
              <ChevronLeft />
            </button>
            <button type="button" onClick={next} className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10" aria-label="Next highlight">
              <ChevronRight />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
