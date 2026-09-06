"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GtpAboutCampaignSlide } from "@/data/gtp-about-page-defaults";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function Cta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const internal = href.startsWith("/") || href.startsWith("#");
  return internal ? (
    <Link href={href}>{children}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
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

  React.useEffect(() => {
    if (reducedMotion || count < 2) return;
    const interval = window.setInterval(() => setActive((index) => (index + 1) % count), 7000);
    return () => window.clearInterval(interval);
  }, [count, reducedMotion]);

  if (!slide) return null;

  const previous = () => setActive((index) => (index - 1 + count) % count);
  const next = () => setActive((index) => (index + 1) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="GTP 2026 highlights"
      className="relative min-h-[min(68svh,760px)] overflow-hidden bg-gtp-dark-teal"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(0,156,180,0.32),transparent_34%),radial-gradient(circle_at_8%_78%,rgba(134,188,37,0.20),transparent_38%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.06]" />
      <div className="relative mx-auto flex min-h-[min(68svh,760px)] max-w-7xl items-center px-6 pb-24 pt-32 lg:px-12">
        <div key={slide.title} className="max-w-4xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
          {slide.badge ? (
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
              {slide.badge}
            </p>
          ) : null}
          <h1 className="mt-6 max-w-4xl text-balance font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl">
            {slide.title}
          </h1>
          {slide.lede ? (
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/80 md:text-xl">
              {slide.lede}
            </p>
          ) : null}
          <div className="mt-9 flex flex-wrap gap-3">
            {slide.primaryCtaHref && slide.primaryCtaLabel ? (
              <Button variant="gtpCta" size="lg" asChild>
                <Cta href={slide.primaryCtaHref}>
                  {slide.primaryCtaLabel} <ArrowRight />
                </Cta>
              </Button>
            ) : null}
            {slide.secondaryCtaHref && slide.secondaryCtaLabel ? (
              <Button variant="gtpOutline" size="lg" className="border-white/60 text-white hover:border-white hover:bg-white hover:text-gtp-dark-teal" asChild>
                <Cta href={slide.secondaryCtaHref}>{slide.secondaryCtaLabel}</Cta>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {count > 1 ? (
        <div className="absolute inset-x-6 bottom-7 flex items-center justify-between lg:inset-x-12">
          <div className="flex gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show ${item.title}`}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-gtp-teal" : "w-2.5 bg-white/45 hover:bg-white/80"}`}
              />
            ))}
          </div>
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
