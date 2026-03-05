"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// ─── Events carousel data ────────────────────────────────────────────────────

const highlightedEvents = [
  {
    id: "gtp-2026",
    label: "Upcoming · 2026",
    title: "Global Tipping Points 2026",
    subtitle: "Kuala Lumpur, Malaysia",
    href: "/events/gtp-2026",
    external: false,
  },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function ScphHero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col">
      {/* Background — group photo with dark overlay */}
      {/* Place group-photo-1.jpg in public/images/scph/ to activate */}
      <div className="absolute inset-0">
        <Image
          src="/images/scph/group-photo-1.jpg"
          alt="SCPH Team"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay — also serves as fallback when image is missing */}
        <div className="absolute inset-0 bg-gradient-to-br from-scph-blue/90 via-scph-dark-green/80 to-scph-blue-dark/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between px-6 pb-0 pt-28 md:px-12 lg:px-20">
        {/* Top-left — title + tagline */}
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Sunway Centre for{" "}
            <span className="text-scph-green">Planetary Health</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-white/60 md:text-xl">
            Where knowledge meets action
          </p>
        </div>

        {/* Bottom-left — description */}
        <div className="mb-6 max-w-xl md:mb-8">
          <p className="text-base leading-relaxed text-white/80 md:text-lg">
            A &ldquo;Think-and-Do&rdquo; tank, committed to research and advocacy that
            advances planetary health through three priority areas: healthy
            cities, health-centred decarbonisation, and driving an education
            revolution.
          </p>
        </div>
      </div>

      {/* Highlighted events strip */}
      <div className="relative z-10 border-t border-white/15 bg-black/25 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-stretch overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden md:px-12 lg:px-20">
          <div className="shrink-0 flex items-center border-r border-white/15 pr-5 mr-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 whitespace-nowrap">
              Highlighted Events
            </span>
          </div>
          {highlightedEvents.map((event) => (
            <Link
              key={event.id}
              href={event.href}
              className="group flex shrink-0 items-center gap-4 py-4 pr-6 transition-opacity hover:opacity-80"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-scph-green">
                  {event.label}
                </span>
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <p className="text-xs text-white/50">{event.subtitle}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
