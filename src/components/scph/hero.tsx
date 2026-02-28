"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScphHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-scph-blue via-scph-dark-green to-scph-blue-dark" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-scph-green" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90">
            Sunway University · Kuala Lumpur
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-6xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
          Advancing<br />
          <span className="text-scph-green">Planetary Health</span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
          A Think-and-Do tank committed to research and advocacy that advances
          planetary health for a healthier, more sustainable world.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button variant="scphSecondary" size="lg" asChild>
            <Link href="/about-us">
              Explore Our Work <ArrowRight className="ml-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            className="border border-white/60 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:border-white/80 hover:text-white"
            asChild
          >
            <Link href="/events/gtp-2026">GTP 2026</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </div>
    </section>
  );
}
