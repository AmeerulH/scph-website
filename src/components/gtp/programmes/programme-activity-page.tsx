import Image from "next/image";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { GtpForestHero } from "@/components/sections/heroes";
import { Button } from "@/components/ui/button";
import type {
  GtpProgrammeActivityPage,
  GtpProgrammeActivitySlug,
} from "@/data/gtp-programme-activity-defaults";
import { ActionWorkshopRegistration } from "./action-workshop-registration";
import { ActionWorkshopsCarousel } from "./action-workshops-carousel";

const POSTER_PAGE_SLUGS = new Set<GtpProgrammeActivitySlug>([
  "ai-thinkers-networking-breakfast",
  "film-screening",
  "sensorial-station",
]);

function RegistrationAction({
  page,
}: {
  page: GtpProgrammeActivityPage;
}) {
  if (page.slug === "action-workshops") {
    return <ActionWorkshopRegistration />;
  }

  if (page.registrationStatus !== "open" || !page.registrationUrl) {
    return (
      <span className="inline-flex min-h-11 items-center rounded-full border border-gtp-teal/25 bg-gtp-teal/5 px-5 text-sm font-semibold text-gtp-dark-teal">
        {page.registrationStatus === "closed"
          ? "Registration closed"
          : page.registrationLabel}
      </span>
    );
  }

  return (
    <Button variant="gtpCta" size="lg" asChild>
      <a href={page.registrationUrl} target="_blank" rel="noopener noreferrer">
        {page.registrationLabel}
        <ArrowUpRight />
      </a>
    </Button>
  );
}

function posterFor(page: GtpProgrammeActivityPage) {
  if (page.showcasePosterUrl) {
    return {
      url: page.showcasePosterUrl,
      alt: page.showcasePosterAlt || `${page.pageTitle} poster`,
    };
  }
  const fromEntry = page.entries.find((entry) => entry.posterUrl);
  if (!fromEntry?.posterUrl) return null;
  return {
    url: fromEntry.posterUrl,
    alt: fromEntry.posterAlt || `${page.pageTitle} poster`,
  };
}

function ProgrammePosterLayout({ page }: { page: GtpProgrammeActivityPage }) {
  const poster = posterFor(page);
  const intro = page.intro.trim();
  const carried = page.entries
    .map((entry) => entry.description?.trim())
    .filter((text): text is string => typeof text === "string" && text.length > 0 && !intro.includes(text));
  const description = [intro, ...carried].filter(Boolean).join("\n\n");

  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(16rem,26rem)_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div className="bg-gtp-dark-teal p-3 sm:p-4">
            {poster ? (
              <div className="relative aspect-3/4 bg-gtp-dark-teal">
                <Image
                  src={poster.url}
                  alt={poster.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 80vw, 416px"
                />
              </div>
            ) : (
              <div className="flex aspect-3/4 items-end bg-gtp-dark-teal p-6">
                <p className="font-heading text-2xl font-semibold leading-tight text-white/75">
                  Poster coming soon
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[68ch]">
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-700 sm:text-lg sm:leading-8">
            {description}
          </p>
          <div className="mt-8">
            <RegistrationAction page={page} />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            Open to participants registered for GTP 2026.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProgrammeActivityPage({
  page,
}: {
  page: GtpProgrammeActivityPage;
}) {
  const entriesByDate = page.entries.reduce<Record<string, GtpProgrammeActivityPage["entries"]>>(
    (groups, entry) => {
      const key = entry.dateLabel || "To be confirmed";
      (groups[key] ??= []).push(entry);
      return groups;
    },
    {},
  );

  return (
    <>
      <GtpForestHero
        eyebrow="Programme activities"
        title={page.pageTitle}
        backgroundImageUrl={page.heroImageUrl}
        lede={page.heroLede}
        bottomSpacing="compact"
      />

      {POSTER_PAGE_SLUGS.has(page.slug) ? (
        <ProgrammePosterLayout page={page} />
      ) : (
      <section className="bg-slate-50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="max-w-3xl text-pretty text-base leading-relaxed text-slate-700 md:text-lg">
            {page.intro}
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-600">
            Open to participants registered for GTP 2026.
          </p>

          {page.slug === "action-workshops" ? (
            <ActionWorkshopsCarousel entries={page.entries} />
          ) : page.entries.length > 0 ? (
            <div className="mt-12 space-y-10">
              {Object.entries(entriesByDate).map(([date, entries]) => (
                <section key={date} aria-labelledby={`date-${date}`}>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="size-5 text-gtp-teal" aria-hidden />
                    <h2
                      id={`date-${date}`}
                      className="font-heading text-2xl font-bold text-gtp-dark-teal"
                    >
                      {date}
                    </h2>
                  </div>
                  <div className="mt-5 space-y-3">
                    {entries.map((entry) => (
                      <article
                        key={entry.title}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-start">
                          {entry.posterUrl ? (
                            <div className="relative aspect-4/5 w-full shrink-0 overflow-hidden rounded-xl md:w-40">
                              <Image
                                src={entry.posterUrl}
                                alt={entry.posterAlt || `${entry.title} poster`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 160px"
                              />
                            </div>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-heading text-xl font-bold leading-snug text-gtp-dark-teal">
                              {entry.title}
                            </h3>
                            {entry.description ? (
                              <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-slate-600">
                                {entry.description}
                              </p>
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">
                                Description to be announced.
                              </p>
                            )}
                          </div>
                          <div className="shrink-0">
                            <RegistrationAction page={page} />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-gtp-teal/35 bg-white px-6 py-12 text-center">
              <Clock3 className="mx-auto size-8 text-gtp-teal" aria-hidden />
              <h2 className="mt-4 font-heading text-xl font-bold text-gtp-dark-teal">
                More details are on their way
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
                The team is confirming the programme. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
      )}
    </>
  );
}
