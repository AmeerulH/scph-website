import Image from "next/image";
import { ArrowUpRight, CalendarDays, CircleAlert, Clock3 } from "lucide-react";
import { GtpForestHero } from "@/components/sections/heroes";
import { Button } from "@/components/ui/button";
import type { GtpProgrammeActivityPage } from "@/data/gtp-programme-activity-defaults";

function RegistrationAction({
  page,
}: {
  page: GtpProgrammeActivityPage;
}) {
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
    <Button variant="gtpCta" asChild>
      <a href={page.registrationUrl} target="_blank" rel="noopener noreferrer">
        {page.registrationLabel}
        <ArrowUpRight />
      </a>
    </Button>
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
        lede={page.heroLede}
        bottomSpacing="compact"
      />

      <section className="bg-slate-50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
            <div>
              <p className="max-w-3xl text-pretty text-base leading-relaxed text-slate-700 md:text-lg">
                {page.intro}
              </p>

              {page.entries.length > 0 ? (
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
                    The team is confirming the excursion programme. Please check back soon.
                  </p>
                </div>
              )}
            </div>

            <aside
              aria-label="Participant access information"
              className="rounded-2xl border border-gtp-orange/30 bg-gtp-orange/10 p-6 lg:sticky lg:top-24"
            >
              <CircleAlert className="size-6 text-gtp-orange" aria-hidden />
              <p className="mt-4 font-heading text-lg font-bold text-gtp-dark-teal">
                For conference attendees
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                These activities are available only to participants registered for
                GTP 2026.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
