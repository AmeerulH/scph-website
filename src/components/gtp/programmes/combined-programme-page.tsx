import { Clock3 } from "lucide-react";
import type { GtpProgrammeActivityPage } from "@/data/gtp-programme-activity-defaults";
import type { GtpSessionModalHostedBy } from "@/sanity/gtp-programme";
import type { ActivityRegistrationState } from "@/lib/gtp-activity-registration";
import type { ActionWorkshopListingItem } from "./action-workshop-listing";
import type { ResearchSessionBlock } from "./research-session-listing";
import { buildCombinedProgrammeDays } from "./combined-programme-days";
import { ActionWorkshopRegistration } from "./action-workshop-registration";
import { ActionWorkshopRow, ActionWorkshopsCarousel } from "./action-workshops-carousel";
import { ResearchSessionsSchedule } from "./research-sessions-schedule";

export function CombinedProgrammePage({page, workshops, research, hostedBy, registration, verificationEndpoint}: {
  page: GtpProgrammeActivityPage;
  workshops: ActionWorkshopListingItem[];
  research: ResearchSessionBlock[];
  hostedBy: GtpSessionModalHostedBy;
  registration: ActivityRegistrationState;
  verificationEndpoint?: string;
}) {
  const days = buildCombinedProgrammeDays({workshops, research, partnerDays: page.knowledgePartnerDays});
  return <section className="bg-gtp-paper px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
    <div id="action-workshops" className="mx-auto max-w-6xl scroll-mt-24">
      <div className="flex flex-col justify-between gap-5 border-b border-gtp-dark-teal/15 pb-8 sm:flex-row sm:items-center">
        <p className="max-w-[70ch] text-sm leading-relaxed text-gtp-dark-teal sm:text-base">{page.combinedIntro}</p>
        <nav aria-label="Jump to programme date" className="flex shrink-0 flex-wrap gap-2">
          {days.map((day) => <a key={day.id} href={`#${day.id}`} className="inline-flex min-h-11 items-center rounded-full border border-gtp-dark-teal/20 px-4 text-xs font-semibold text-gtp-dark-teal transition-colors hover:bg-gtp-dark-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal">{day.dateLabel.replace(" 2026", "")}</a>)}
        </nav>
      </div>
      <ActionWorkshopsCarousel items={workshops} hostedBy={hostedBy} registration={registration} verificationEndpoint={verificationEndpoint}>
        <div className="divide-y divide-gtp-dark-teal/15">
          {days.map((day) => <section key={day.id} id={day.id} aria-labelledby={`${day.id}-heading`} className="scroll-mt-24 py-9 sm:py-12">
            <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row">
              <div>
                <h2 id={`${day.id}-heading`} className="font-heading text-2xl font-bold text-gtp-dark-teal sm:text-3xl">{day.dateLabel}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gtp-dark-teal/80 sm:text-sm">
                  {day.weekday ? <span>{day.weekday}</span> : null}
                  {day.workshopTimes.length ? <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden />Workshops {day.workshopTimes.join(" · ")}</span> : null}
                  {day.id === "day-13" || day.id === "day-14" ? <span className="rounded-full border border-gtp-dark-teal/15 px-2 py-1 text-[11px] font-semibold text-gtp-dark-teal">Running in parallel</span> : null}
                </div>
              </div>
              <ActionWorkshopRegistration dateLabel={day.dateLabel} registration={registration} verificationEndpoint={verificationEndpoint} />
            </div>
            <ActionWorkshopRow id={day.id} title={page.actionWorkshopsTitle || "Action Workshops"} description={page.intro} workshops={day.workshops} partnerDays={day.partnerDays} />
            <section id={`${day.id}-research`} aria-labelledby={`${day.id}-research-heading`} className="mt-9 scroll-mt-24 sm:mt-11">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id={`${day.id}-research-heading`} className="font-heading text-xl font-bold text-gtp-dark-teal sm:text-2xl">{page.researchSessionsTitle || "Research Sessions"}</h3>
                {!day.research.some((block) => block.halls.some((hall) => hall.presentations.length)) ? <span className="rounded-full bg-gtp-dark-teal/5 px-3 py-1 text-xs font-medium text-gtp-dark-teal">Schedule coming soon</span> : null}
              </div>
              {page.researchSessionsIntro ? <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-gtp-dark-teal/85 sm:text-base">{page.researchSessionsIntro}</p> : null}
              <ResearchSessionsSchedule blocks={day.research} presenterLabel={page.researchPresenterColumnLabel} presentationLabel={page.researchPresentationColumnLabel} />
            </section>
          </section>)}
        </div>
      </ActionWorkshopsCarousel>
    </div>
  </section>;
}
