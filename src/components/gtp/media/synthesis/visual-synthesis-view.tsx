import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  GTP_SYNTHESIS_DAYS,
  type GtpSynthesisDay,
  type GtpSynthesisDayId,
  type GtpVisualSynthesisResolved,
} from "@/data/gtp-visual-synthesis-defaults";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";
import { SynthesisMaps } from "./synthesis-maps";

type Props = {
  data: GtpVisualSynthesisResolved;
  activeDayId: GtpSynthesisDayId;
  /** Route that the day links point at (the dev review route overrides this). */
  basePath: string;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gtp-teal-light";

/** Bolds the contributor's name and links the company name inside the supplied credit line. */
function CreditLine({ text, name, bigPictureUrl }: { text: string; name: string; bigPictureUrl?: string }) {
  const escape = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escape(name)}|Bigger Picture)`));
  return (
    <>
      {parts.map((part, i) => {
        if (part === name) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part}
            </strong>
          );
        }
        if (part === "Bigger Picture" && bigPictureUrl) {
          return (
            <a
              key={i}
              href={bigPictureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white",
                focusRing,
              )}
            >
              {part}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

function DayNav({
  activeDayId,
  basePath,
  hasMaps,
}: {
  activeDayId: GtpSynthesisDayId;
  basePath: string;
  hasMaps: Set<GtpSynthesisDayId>;
}) {
  return (
    <nav
      aria-label="Days"
      className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-t lg:border-white/15"
    >
      {GTP_SYNTHESIS_DAYS.map((day) => {
        const selected = day.id === activeDayId;
        const published = hasMaps.has(day.id);
        return (
          <Link
            key={day.id}
            href={`${basePath}?day=${day.id}#maps`}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "touch-manipulation rounded-full border px-5 py-2.5 transition-[color,background-color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] lg:rounded-none lg:active:scale-100 lg:border-0 lg:border-b lg:border-white/15 lg:px-0 lg:py-4",
              focusRing,
              selected
                ? "border-white bg-white text-gtp-dark-teal-dark lg:bg-transparent lg:text-white"
                : published
                  ? "border-white/25 text-white/75 hover:text-white"
                  : "border-white/15 text-white/45 hover:text-white/80",
            )}
          >
            <span className="flex items-baseline gap-3">
              <span
                aria-hidden
                className={cn(
                  "hidden size-2 shrink-0 rounded-full transition-colors lg:block",
                  selected ? "bg-gtp-orange" : published ? "bg-white/35" : "bg-white/15",
                )}
              />
              <span className="font-heading text-sm font-semibold whitespace-nowrap lg:text-lg">{day.label}</span>
            </span>
            <span className="hidden pl-5 text-sm text-white/55 lg:block">{day.dateLabel}</span>
            {!published ? <span className="sr-only"> (no maps published yet)</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

function EmptyDay({ day, afterConference }: { day: GtpSynthesisDay; afterConference: boolean }) {
  const isFinal = day.id === "final";
  const message = afterConference
    ? `No maps have been published for ${isFinal ? "the final synthesis" : day.label}.`
    : isFinal
      ? "The final synthesis, bringing the four days together, will appear here at the end of the conference."
      : `${day.label} maps will appear here after that day's plenaries.`;
  return (
    <div role="status" className="border border-dashed border-white/25 px-6 py-14 sm:px-10 sm:py-20">
      <p className="font-heading text-2xl font-semibold text-balance text-white sm:text-3xl">{message}</p>
      {!afterConference && !isFinal ? <p className="mt-3 text-base text-white/60">{day.dateLabel}</p> : null}
    </div>
  );
}

export function VisualSynthesisView({ data, activeDayId, basePath }: Props) {
  const day = GTP_SYNTHESIS_DAYS.find((d) => d.id === activeDayId) ?? GTP_SYNTHESIS_DAYS[0];
  const hasMaps = new Set(data.maps.map((m) => m.day));
  const dayMaps = data.maps.filter((m) => m.day === day.id);
  const { contributor, credit } = data;

  return (
    <div className="bg-gtp-dark-teal-dark selection:bg-gtp-orange/45 selection:text-white">
      <header className="px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/events/gtp-2026/media"
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-white",
              focusRing,
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Media
          </Link>

          <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-16">
            <h1 className="synth-arrive font-heading text-[clamp(2.75rem,8vw,6rem)] font-bold leading-[0.95] tracking-tight text-balance text-white lg:col-span-6">
              {data.title}
            </h1>

            <div className="lg:col-span-6 lg:pt-3">
              <div
                className="synth-arrive max-w-[65ch] space-y-4 text-base leading-relaxed text-white/80 lg:text-lg"
                style={{ "--synth-delay": "70ms" } as React.CSSProperties}
              >
                {data.intro.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {data.liveNote ? (
                <p className="mt-5 flex max-w-[65ch] items-start gap-3 text-base leading-relaxed text-white/60">
                  <span aria-hidden className="mt-2.5 size-2 shrink-0 rounded-full bg-gtp-orange" />
                  {data.liveNote}
                </p>
              ) : null}
              <p
                className="synth-arrive mt-9 max-w-[65ch] border-t border-white/15 pt-6 text-sm leading-relaxed text-white/70"
                style={{ "--synth-delay": "140ms" } as React.CSSProperties}
              >
                <CreditLine text={credit.text} name={contributor.name} bigPictureUrl={credit.bigPictureUrl} />
              </p>
            </div>
          </div>
        </div>
      </header>

      <section id="maps" aria-labelledby="day-heading" className="scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
            <DayNav activeDayId={day.id} basePath={basePath} hasMaps={hasMaps} />

            <div className="min-w-0">
              <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-white/15 pb-5 lg:mb-10">
                <h2 id="day-heading" className="font-heading text-2xl font-bold text-white md:text-3xl">
                  {day.label}
                </h2>
                <p className="text-sm text-white/60">{day.dateLabel}</p>
              </div>

              {dayMaps.length ? (
                <SynthesisMaps key={day.id} maps={dayMaps} />
              ) : (
                <EmptyDay day={day} afterConference={data.afterConference} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="contributor"
        aria-labelledby="contributor-heading"
        className="border-t border-white/15 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <ScrollReveal className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16">
          {contributor.headshot ? (
            <div className="max-w-[16rem] lg:col-span-3">
              <Image
                src={contributor.headshot.src}
                alt={contributor.headshot.alt}
                width={contributor.headshot.width}
                height={contributor.headshot.height}
                sizes="(min-width: 1024px) 18rem, 16rem"
                className="h-auto w-full"
              />
            </div>
          ) : null}

          <div className={cn(contributor.headshot ? "lg:col-span-8" : "lg:col-span-8 lg:col-start-4")}>
            <h2 id="contributor-heading" className="font-heading text-3xl font-bold text-white md:text-4xl">
              {contributor.name}
            </h2>
            <p className="mt-2 text-base text-gtp-teal-light">{contributor.role}</p>
            <div className="mt-8 max-w-[65ch] space-y-4 text-base leading-relaxed text-white/80">
              {contributor.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {contributor.links.length ? (
              <ul className="mt-9 flex flex-wrap gap-3">
                {contributor.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex h-11 touch-manipulation items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-medium text-white transition-[color,background-color,transform] duration-150 ease-[var(--ease-out-strong)] hover:bg-white hover:text-gtp-dark-teal-dark active:scale-[0.97]",
                        focusRing,
                      )}
                    >
                      {link.label}
                      <ArrowUpRight className="size-4" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
