"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides = [
  { src: "/images/gtp/carousel/pexels-arthousestudio-4534200.jpg",      alt: "Global Tipping Points 2026 Conference" },
  { src: "/images/gtp/carousel/pexels-baskincreativeco-1480807.jpg",    alt: "Leaders shaping the future" },
  { src: "/images/gtp/carousel/pexels-manuela-adler-344311-949194.jpg", alt: "Science meeting action" },
  { src: "/images/gtp/carousel/pexels-pok-rie-33563-2049422.jpg",       alt: "Tipping points for a healthy planet" },
];

export function GtpHeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Carousel backgrounds */}
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: true }}
        className="absolute inset-0 h-full w-full"
      >
        <CarouselContent className="h-full -ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.src} className="relative h-screen pl-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                quality={80}
                className="object-cover"
                priority={slide.src === slides[0].src}
                loading={slide.src === slides[0].src ? "eager" : "lazy"}
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-gtp-dark-teal/70 via-black/20 to-gtp-dark-teal/80" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Hero content — centred */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Eyebrow */}
        <span className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
          Kuala Lumpur · 2026
        </span>

        {/* Headline */}
        <h1 className="max-w-4xl font-heading text-6xl font-bold leading-tight text-white md:text-7xl">
          The Moment to Tip the Future
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-xl text-2xl font-light text-white/80">
          Global Tipping Points 2026 Conference
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button variant="gtpCta" size="lg" asChild>
            <Link href="/events/gtp-2026/get-involved">Register Now →</Link>
          </Button>
          <Button
            size="lg"
            className="rounded-full border-2 border-white/50 bg-transparent text-white hover:border-white hover:bg-white/10"
            asChild
          >
            <Link href="/events/gtp-2026/about#about">Learn More</Link>
          </Button>
        </div>
      </div>

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
                : "w-2 bg-white/40 hover:bg-white/70"
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
