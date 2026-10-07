import {notFound} from "next/navigation";
import {getGtp2026Programme, DEFAULT_SESSION_MODAL_HOSTED_BY} from "@/sanity/gtp-programme";
import {getGtpProgrammeActivityPage} from "@/sanity/gtp-stage2";
import {buildActionWorkshopListing} from "@/components/gtp/programmes/action-workshop-listing";
import {CombinedProgrammePage} from "@/components/gtp/programmes/combined-programme-page";
import {GtpForestHero} from "@/components/sections/heroes";
import {ProgrammeModalHostedByBlock} from "@/components/gtp/programmes/programme-modal-chrome";
import type {ResearchSessionBlock} from "@/components/gtp/programmes/research-session-listing";
import {HostReview} from "./host-review";
import {PeopleReview} from "./people-review";

export const dynamic = "force-dynamic";

export default async function ProgrammeReviewPage() {
  if (process.env.NODE_ENV !== "development" || process.env.GTP_PROGRAMME_REVIEW_MODE !== "1") notFound();
  const [page, programme] = await Promise.all([getGtpProgrammeActivityPage("action-workshops"), getGtp2026Programme()]);
  const workshops = buildActionWorkshopListing({day2: programme.day2, day3: programme.day3});
  const research: ResearchSessionBlock[] = (["day2", "day3"] as const).map((dayId) => ({
    id: `review-${dayId}`, dayId, time: "Research time to be confirmed",
    halls: [1, 2].map((hall) => ({
      id: `hall-${hall}`, title: `Hall ${hall}`, venue: "Venue to be confirmed",
      presentations: [1, 2, 3, 4].map((row) => ({id: `row-${row}`, presenterName: `Illustrative presenter ${row}`,
        presentationTitle: row === 2 ? "Illustrative long presentation title to check how research topics wrap across multiple lines without losing the presenter or widening the page" : "Illustrative presentation title — final schedule pending"})),
    })),
  }));
  const reviewHosts = {...DEFAULT_SESSION_MODAL_HOSTED_BY, hosts: [
    {id: "host-1", name: "Illustrative host organisation", logoUrl: DEFAULT_SESSION_MODAL_HOSTED_BY.logoUrl || undefined, logoAlt: "SCPH logo used only as a layout reference"},
    {id: "host-2", name: "Second illustrative host with a longer organisation name", subtitle: "Organisation subtitle; this does not set the room"},
  ]};
  const photoPeople = programme.isPublished ? programme.day1.flatMap(session => session.speakers ?? []).filter(person => person.imageUrl?.trim()).slice(0, 2) : [];
  return <>
    <div className="bg-gtp-dark-teal px-5 py-5 text-sm leading-relaxed text-white"><div className="mx-auto max-w-6xl">
      <p className="font-heading text-lg font-semibold">Local implementation review</p>
      <p className="mt-2">Research names and host organisations below are synthetic layout fixtures. No CMS content or registrations are changed. Use eligible@example.invalid to preview the eligibility result; other valid emails show the retry state. The external form remains pending.</p>
    </div></div>
    <GtpForestHero eyebrow={null} title={page.pageTitle} backgroundImageUrl={page.heroImageUrl} lede={page.heroLede} bottomSpacing="compact" />
    <CombinedProgrammePage page={{...page, intro: "Join practical, participatory sessions exploring how ideas become action. Action Workshops are only for in-person delegates attending GTP 2026.", researchSessionsIntro: "Illustrative schedule layout for team review. Presenter names, presentation titles and halls are pending confirmation."}}
      workshops={workshops} research={research} hostedBy={programme.sessionModalHostedBy}
      registration={{status: "open", label: "Register here"}} verificationEndpoint="/api/dev/gtp-programme-review" />
    <section className="bg-white px-5 py-12"><div className="mx-auto max-w-3xl"><h2 className="mb-5 font-heading text-2xl font-bold text-gtp-dark-teal">Multiple-host block: synthetic layout fixture</h2>
      <ProgrammeModalHostedByBlock hostedBy={reviewHosts} />
      <div className="mt-6"><HostReview hostedBy={reviewHosts} /></div>
    </div></section>
    <section className="bg-gtp-paper px-5 py-12"><div className="mx-auto max-w-3xl">
      <h2 className="mb-3 font-heading text-2xl font-bold text-gtp-dark-teal">Workshop people: layout checks</h2>
      <p className="mb-5 text-sm leading-relaxed text-gtp-dark-teal">The photo preview uses people from the published conference programme only to check layout. It does not assign them to a workshop.</p>
      <PeopleReview people={photoPeople} hostedBy={programme.sessionModalHostedBy} />
    </div></section>
  </>;
}
