"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GtpAboutCampaignSlide } from "@/data/gtp-about-page-defaults";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./gtp-campaign-hero.module.css";

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
  layout: "conference" | "activity";
}) {
  const stackOnDesktop = layout === "conference";

  return (
    <div
      className={
        stackOnDesktop
          ? "flex w-full flex-row flex-wrap gap-6 md:w-auto md:min-w-60 md:flex-col md:gap-4"
          : "flex flex-wrap gap-3"
      }
    >
      {slide.primaryCtaHref && slide.primaryCtaLabel ? (
        <div className={stackOnDesktop ? styles.registration : "contents"}>
          {stackOnDesktop ? (
            <p className={styles.availability}>
              <span aria-hidden="true" className={styles.dot} />
              Limited seats left
            </p>
          ) : null}
        <Button
          variant="gtpCta"
          size="lg"
          className={
            stackOnDesktop
              ? `${styles.registerButton} w-full justify-center py-7 text-base`
              : "justify-center px-6"
          }
          asChild
        >
          <Cta href={slide.primaryCtaHref}>
            {slide.primaryCtaLabel.replace(/\s*→\s*$/, "")} <ArrowRight aria-hidden="true" />
          </Cta>
        </Button>
        </div>
      ) : null}
      {slide.secondaryCtaHref && slide.secondaryCtaLabel ? (
        <Button
          variant="gtpOutline"
          size="lg"
          className={
            stackOnDesktop
              ? "h-13 flex-none justify-center border-0 bg-transparent px-2 text-base text-white underline decoration-white/60 decoration-1 underline-offset-4 hover:bg-white/10 hover:decoration-white md:border-2 md:border-white/50 md:px-8 md:no-underline md:hover:border-white"
              : "border-white/60 text-white hover:border-white hover:bg-white hover:text-gtp-dark-teal"
          }
          asChild
        >
          <Cta href={slide.secondaryCtaHref}>
            {slide.secondaryCtaLabel}
            {stackOnDesktop ? <ArrowRight className="md:hidden" aria-hidden="true" /> : null}
          </Cta>
        </Button>
      ) : null}
    </div>
  );
}

function CarouselControls({
  onPrevious,
  onNext,
  className,
}: {
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <button
        type="button"
        onClick={onPrevious}
        className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
        aria-label="Previous highlight"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
        aria-label="Next highlight"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

function CampaignSlide({
  slide,
  isMain,
}: {
  slide: GtpAboutCampaignSlide;
  isMain: boolean;
}) {
  if (isMain) {
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
        <div className="-translate-y-8 w-full md:translate-y-0 md:w-auto">
          <SlideActions slide={slide} layout="conference" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid h-full w-full max-w-7xl items-center gap-8 px-6 pb-16 pt-28 md:grid-cols-[1fr_0.9fr] lg:px-12">
      <div className="hidden self-center border-y border-white/25 py-7 text-right md:order-2 md:block">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gtp-green">
          GTP 2026
        </p>
        <p className="mt-3 font-heading text-5xl font-bold leading-[0.9] text-white">
          {slide.badge}
        </p>
        <p className="mt-5 text-sm font-medium text-white/65">
          Conference programme
        </p>
      </div>
      <div className="relative md:order-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gtp-green">{slide.badge}</p>
        <h1 className="mt-4 max-w-3xl text-balance font-heading text-5xl font-bold leading-[0.98] text-white md:text-6xl">
          {slide.title}
        </h1>
        {slide.lede ? (
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{slide.lede}</p>
        ) : null}
        <div className="mt-8">
          <SlideActions slide={slide} layout="activity" />
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
  const mobileBackgroundImageUrl =
    slide.mobileBackgroundImageUrl ?? slide.backgroundImageUrl;

  if (!slide) return null;

  const previous = () => setActive((index) => (index - 1 + count) % count);
  const next = () => setActive((index) => (index + 1) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="GTP 2026 highlights"
      className="relative min-h-144 overflow-hidden bg-gtp-dark-teal md:h-117.5 lg:h-122.5"
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
          {slide.backgroundImageUrl ? (
            <Image
              src={slide.backgroundImageUrl}
              alt=""
              fill
              sizes="100vw"
              className="pointer-events-none hidden object-cover md:block"
              quality={80}
            />
          ) : null}
          {mobileBackgroundImageUrl ? (
            <Image
              src={mobileBackgroundImageUrl}
              alt=""
              fill
              sizes="100vw"
              className="pointer-events-none object-cover md:hidden"
              quality={80}
            />
          ) : null}
          {mobileBackgroundImageUrl ? (
            <div className="pointer-events-none absolute inset-0 bg-gtp-dark-teal/55" />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.06]" />
          <CampaignSlide
            slide={slide}
            isMain={active === 0}
          />
        </motion.div>
      </AnimatePresence>
      {count > 1 ? (
        <div className="absolute bottom-1 right-6 sm:bottom-8 sm:right-12">
          <CarouselControls onPrevious={previous} onNext={next} />
        </div>
      ) : null}
    </section>
  );
}
