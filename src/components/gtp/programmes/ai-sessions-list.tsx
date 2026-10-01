import Image from "next/image";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  GtpProgrammeActivityEntry,
  GtpProgrammeActivityPage,
} from "@/data/gtp-programme-activity-defaults";

// Fixed names (not Intl) so server and browser always render identical text.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const monthShort = (date: Date) => MONTHS[date.getUTCMonth()].slice(0, 3);
const weekdayLong = (date: Date) => WEEKDAYS[date.getUTCDay()];
const fullDate = (date: Date) =>
  `${weekdayLong(date)} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

function parseSessionDate(value: string | undefined): Date | null {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** Dated sessions first in date order; undated rows keep their Studio order at the end. */
function sortSessions(entries: GtpProgrammeActivityEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.sessionDate && b.sessionDate) return a.sessionDate.localeCompare(b.sessionDate);
    if (a.sessionDate) return -1;
    if (b.sessionDate) return 1;
    return 0;
  });
}

type SessionItem = { entry: GtpProgrammeActivityEntry; id: string; isFirst: boolean };

type DateGroup = {
  key: string;
  date: Date | null;
  label: string;
  sessions: SessionItem[];
};

/** One group per day, so a day with a breakfast and a workshop reads as one date. */
function groupByDate(entries: GtpProgrammeActivityEntry[]): DateGroup[] {
  const groups: DateGroup[] = [];
  const seenIds = new Set<string>();

  entries.forEach((entry, index) => {
    const date = parseSessionDate(entry.sessionDate);
    const label = entry.dateLabel?.trim() || "Date to be confirmed";
    const key = date ? entry.sessionDate! : `label-${slugify(label)}`;
    let group = groups.find((candidate) => candidate.key === key);
    if (!group) {
      group = { key, date, label, sessions: [] };
      groups.push(group);
    }
    const baseId = `${key}-${slugify(entry.title)}`;
    const id = seenIds.has(baseId) ? `${baseId}-${index + 1}` : baseId;
    seenIds.add(id);
    group.sessions.push({ entry, id, isFirst: index === 0 });
  });

  return groups;
}

function uniqueFormats(group: DateGroup) {
  return [...new Set(group.sessions.map(({ entry }) => entry.format).filter(Boolean))];
}

function DateBlock({ group }: { group: DateGroup }) {
  if (!group.date) {
    return (
      <p className="font-heading text-xl font-bold leading-snug text-gtp-dark-teal">
        {group.label}
      </p>
    );
  }
  return (
    <div className="flex items-baseline gap-x-3 gap-y-1 md:flex-col md:items-start">
      <p
        aria-hidden
        className="font-heading text-5xl font-bold leading-none text-gtp-dark-teal md:text-6xl"
      >
        {group.date.getUTCDate()}
      </p>
      <p
        aria-hidden
        className="text-sm font-semibold uppercase tracking-[0.18em] text-gtp-orange-dark"
      >
        {monthShort(group.date)}
      </p>
      <p aria-hidden className="text-sm text-slate-600">
        {weekdayLong(group.date)}
      </p>
    </div>
  );
}

/** Quick answer to "what is happening when", linking to each day below. */
function DateOverview({ groups }: { groups: DateGroup[] }) {
  return (
    <nav aria-label="Session dates" className="mt-10">
      <ul className="grid auto-cols-fr grid-flow-col gap-3 overflow-x-auto sm:flex sm:flex-wrap sm:overflow-visible">
        {groups.map((group) => {
          const formats = uniqueFormats(group);
          return (
            <li key={group.key} className="min-w-18 sm:min-w-0">
              <a
                href={`#date-${group.key}`}
                className="flex h-full flex-col items-center justify-center gap-1 rounded-xl border border-gtp-dark-teal/15 bg-white px-4 py-3 transition-colors hover:border-gtp-teal focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gtp-teal sm:flex-row sm:gap-4"
              >
                {group.date ? (
                  <span className="flex flex-col items-center leading-none">
                    <span className="font-heading text-3xl font-bold text-gtp-dark-teal">
                      {group.date.getUTCDate()}
                    </span>
                    <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gtp-orange-dark">
                      {monthShort(group.date)}
                    </span>
                  </span>
                ) : (
                  <span className="font-heading text-base font-bold text-gtp-dark-teal">
                    {group.label}
                  </span>
                )}
                {formats.length > 0 ? (
                  <span className="sr-only sm:not-sr-only sm:max-w-44 sm:text-sm sm:leading-snug sm:text-slate-700">
                    {formats.join(", ")}
                  </span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SessionPoster({ poster }: { poster: { url: string; alt: string } | null }) {
  if (!poster) {
    return (
      <div className="flex aspect-3/4 w-full max-w-40 items-end border border-dashed border-gtp-teal/35 bg-white p-3 sm:max-w-48">
        <p className="font-heading text-sm font-semibold leading-tight text-gtp-dark-teal/60">
          Poster coming soon
        </p>
      </div>
    );
  }
  return (
    <div className="w-full max-w-40 bg-gtp-dark-teal p-2 sm:max-w-48">
      <div className="relative aspect-3/4 bg-gtp-dark-teal">
        <Image
          src={poster.url}
          alt={poster.alt}
          fill
          className="object-contain"
          sizes="192px"
        />
      </div>
    </div>
  );
}

function SessionRegistration({
  entry,
  page,
  usePageLevelLink,
}: {
  entry: GtpProgrammeActivityEntry;
  page: GtpProgrammeActivityPage;
  usePageLevelLink: boolean;
}) {
  if (page.registrationStatus === "closed") {
    return (
      <span className="inline-flex min-h-11 items-center rounded-full border border-gtp-teal/25 bg-gtp-teal/5 px-5 text-sm font-semibold text-gtp-dark-teal">
        Registration closed
      </span>
    );
  }

  const url =
    entry.registrationUrl ||
    (usePageLevelLink && page.registrationStatus === "open" ? page.registrationUrl : undefined);

  if (!url) {
    return (
      <Button
        type="button"
        size="lg"
        disabled
        className="bg-slate-200 text-slate-600 shadow-none disabled:opacity-100"
      >
        {entry.registrationPendingLabel || "Registration link coming soon"}
      </Button>
    );
  }

  return (
    <Button variant="gtpCta" size="lg" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {entry.registrationLabel || page.registrationLabel || "Register"}
        <ArrowUpRight />
      </a>
    </Button>
  );
}

export function AiSessionsList({ page }: { page: GtpProgrammeActivityPage }) {
  const sessions = sortSessions(page.entries.filter((entry) => entry.title.trim()));
  const groups = groupByDate(sessions);
  const pageLevelPoster = page.showcasePosterUrl
    ? { url: page.showcasePosterUrl, alt: page.showcasePosterAlt || `${page.pageTitle} poster` }
    : null;
  // Legacy pages have one page-level link; once any session has its own, links are per session.
  const usePageLevelLink = !sessions.some((entry) => entry.registrationUrl);

  return (
    <section className="bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {page.intro.trim() ? (
          <p className="max-w-[68ch] whitespace-pre-line text-pretty text-base leading-relaxed text-slate-700 md:text-lg">
            {page.intro}
          </p>
        ) : null}

        {groups.length > 1 ? <DateOverview groups={groups} /> : null}

        {groups.length > 0 ? (
          <div className="mt-10 border-b border-gtp-dark-teal/15">
            {groups.map((group) => (
              <section
                key={group.key}
                id={`date-${group.key}`}
                aria-labelledby={`date-${group.key}-heading`}
                className="grid scroll-mt-28 gap-6 border-t border-gtp-dark-teal/15 py-10 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8 lg:grid-cols-[8rem_minmax(0,1fr)] lg:gap-12"
              >
                <div className="md:sticky md:top-28 md:self-start">
                  <h2 id={`date-${group.key}-heading`} className="sr-only">
                    {group.date ? fullDate(group.date) : group.label}
                  </h2>
                  <DateBlock group={group} />
                </div>

                <ol className="space-y-10 [&>li+li]:border-t [&>li+li]:border-gtp-dark-teal/10 [&>li+li]:pt-10">
                  {group.sessions.map(({ entry, id, isFirst }) => {
                    const poster = entry.posterUrl
                      ? { url: entry.posterUrl, alt: entry.posterAlt || `${entry.title} poster` }
                      : isFirst
                        ? pageLevelPoster
                        : null;
                    const hasLogistics = Boolean(entry.time || entry.venue);

                    return (
                      <li
                        key={id}
                        id={id}
                        aria-labelledby={`${id}-title`}
                        className="grid scroll-mt-28 gap-6 sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-10"
                      >
                        <div className="order-first sm:order-last">
                          <SessionPoster poster={poster} />
                        </div>
                        <div className="min-w-0 max-w-[68ch]">
                          {entry.format ? (
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gtp-orange-dark">
                              {entry.format}
                            </p>
                          ) : null}
                          <h3
                            id={`${id}-title`}
                            className="mt-1 font-heading text-2xl font-bold leading-snug text-gtp-dark-teal sm:text-3xl"
                          >
                            {entry.title}
                          </h3>
                          <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            {entry.time ? (
                              <li className="flex items-start gap-2.5">
                                <Clock3 className="mt-0.5 size-4 shrink-0 text-gtp-teal" aria-hidden />
                                <span>{entry.time}</span>
                              </li>
                            ) : null}
                            {entry.venue ? (
                              <li className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-gtp-teal" aria-hidden />
                                <span>{entry.venue}</span>
                              </li>
                            ) : null}
                            {!hasLogistics ? (
                              <li className="text-slate-500">Time and venue to be confirmed.</li>
                            ) : null}
                          </ul>
                          {entry.description ? (
                            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-slate-700">
                              {entry.description}
                            </p>
                          ) : null}
                          <div className="mt-6">
                            <SessionRegistration
                              entry={entry}
                              page={page}
                              usePageLevelLink={usePageLevelLink}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-gtp-teal/35 bg-white px-6 py-12 text-center">
            <h2 className="font-heading text-xl font-bold text-gtp-dark-teal">
              More details are on their way
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
              The team is confirming the sessions. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
