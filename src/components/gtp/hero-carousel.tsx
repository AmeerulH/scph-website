"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronDown } from "lucide-react";
import { GTP_2026_REGISTRATION_URL } from "@/lib/gtp-registration-url";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  heroStaggerContainer,
  heroStaggerItem,
  heroStaggerItemReduced,
} from "@/lib/motion-presets";

const slides = [
  {
    src: "/images/gtp/carousel/pexels-arthousestudio-4534200.jpg",
    alt: "Global Tipping Points 2026 Conference",
  },
  {
    src: "/images/gtp/carousel/pexels-baskincreativeco-1480807.jpg",
    alt: "Leaders shaping the future",
  },
  {
    src: "/images/gtp/carousel/pexels-manuela-adler-344311-949194.jpg",
    alt: "Science meeting action",
  },
  {
    src: "/images/gtp/carousel/pexels-pok-rie-33563-2049422.jpg",
    alt: "Tipping points for a healthy planet",
  },
];

export function GtpHeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [imagesReady, setImagesReady] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? { animate: { transition: { staggerChildren: 0, delayChildren: 0 } } }
    : heroStaggerContainer;
  const itemVariants = prefersReducedMotion ? heroStaggerItemReduced : heroStaggerItem;
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const firstImageLoaded = React.useCallback(() => {
    setImagesReady(true);
  }, []);

  const firstImageError = React.useCallback(() => {
    setImagesReady(true);
  }, []);

  return (
    <div className="relative h-screen min-h-[100dvh] w-full overflow-hidden">
      {/* Loader overlay — shown until first image loads, fills viewport */}
      <AnimatePresence>
        {!imagesReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 z-20 flex min-h-[100dvh] flex-col items-center justify-center bg-gtp-dark-teal"
            aria-live="polite"
            aria-busy={!imagesReady}
          >
            <div
              className="hero-loader-spinner h-12 w-12 rounded-full border-2 border-gtp-teal/30 border-t-gtp-teal"
              aria-hidden
            />
            <p className="mt-4 text-sm font-medium text-white/70">
              Loading…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel backgrounds */}
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: true }}
        className="absolute inset-0 h-full w-full"
      >
        <CarouselContent className="h-full -ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.src} className="relative h-screen min-h-[100dvh] pl-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                quality={80}
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={index === 0 ? firstImageLoaded : undefined}
                onError={index === 0 ? firstImageError : undefined}
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-gtp-dark-teal/70 via-black/20 to-gtp-dark-teal/80" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Hero content — centred, pb clears dot indicators */}
      <motion.div
        className="relative z-10 flex h-full min-h-screen flex-col items-center justify-center px-4 pb-28 pt-24 text-center md:pb-20 md:pt-0"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Eyebrow */}
        <motion.span
          variants={itemVariants}
          className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 lg:text-lg text-xs font-semibold text-white/90 backdrop-blur-sm"
        >
          12-15 October 2026 · Kuala Lumpur, Malaysia
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="max-w-4xl font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Global Tipping Points Conference 2026
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-3xl px-2 text-base font-light leading-snug text-white/85 sm:text-lg md:text-2xl"
        >
          From Understanding to Imagination to Action: Crossing Thresholds for a
          Thriving Planet
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button variant="gtpCta" size="lg" asChild>
            <a
              href={GTP_2026_REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Register Now →
            </a>
          </Button>
          <Button
            size="lg"
            className="rounded-full border-2 border-white/50 bg-transparent text-white hover:border-white hover:bg-white/10"
            asChild
          >
            <Link href="/events/gtp-2026/about#about">Learn More</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Dot indicators */}
      <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === current
                ? "w-6 bg-gtp-teal"
                : "w-2 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/50" />
      </div>
    </div>
  );
}
