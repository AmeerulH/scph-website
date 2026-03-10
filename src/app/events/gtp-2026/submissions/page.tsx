import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function SubmissionsHero() {
  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-40 text-center">
      <Image
        src="/images/gtp/forest-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gtp-dark-teal/75" />
      <div className="relative mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          GTP 2026
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Submissions
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Share your research and proposals with the Global Tipping Points community
        </p>
      </div>
    </div>
  );
}

// ─── Abstract Section ─────────────────────────────────────────────────────────

function AbstractSection() {
  return (
    <SectionWrapper
      title="Submit Your Research"
      subtitle="Abstract"
      theme="gtp"
      background="default"
      id="abstract"
    >
      <div className="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gtp-dark-teal/5 ring-1 ring-gtp-dark-teal/10">
          <Image
            src="/images/gtp/submissions/abstract-temp.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="min-w-0 px-2 sm:px-0">
        <p className="text-base leading-relaxed text-gray-600">
          We invite researchers, practitioners and advocates to submit abstracts
          for oral presentations, posters, or workshops at the Global Tipping
          Points Conference 2026. Abstracts should address tipping points—positive
          or negative—across climate, health, finance, culture, or systems
          change.
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Selected abstracts will be included in the conference programme and
          may be considered for publication in a post-conference report.
        </p>
        <div className="mt-8 flex justify-center sm:justify-start">
          <Button variant="gtpSecondary" size="lg" className="w-full max-w-sm sm:w-auto" asChild>
            <Link href="/events/gtp-2026/get-involved#contact">
              Abstract Submission (Coming Soon)
            </Link>
          </Button>
        </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Proposal Section ────────────────────────────────────────────────────────

function ProposalSection() {
  return (
    <SectionWrapper
      title="Propose a Session"
      subtitle="Proposal"
      theme="gtp"
      background="muted"
      id="proposal"
    >
      <div className="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gtp-dark-teal/5 ring-1 ring-gtp-dark-teal/10">
          <Image
            src="/images/gtp/submissions/proposal-temp-alt.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="min-w-0 px-2 sm:px-0">
        <p className="text-base leading-relaxed text-gray-600">
          Have an idea for a workshop, deep dive, or special session? We welcome
          proposals from organisations and individuals who want to shape the
          conference programme. Proposals should align with the conference
          themes: Understanding the Shift, Igniting Imagination, and Accelerating
          Action.
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Proposals will be reviewed by the Programme Committee. Successful
          applicants will be notified and supported to develop their sessions.
        </p>
        <div className="mt-8 flex justify-center sm:justify-start">
          <Button variant="gtpSecondary" size="lg" className="w-full max-w-sm sm:w-auto" asChild>
            <Link href="/events/gtp-2026/get-involved#contact">
              Proposal Submission (Coming Soon)
            </Link>
          </Button>
        </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GtpSubmissionsPage() {
  return (
    <>
      <SubmissionsHero />
      <AbstractSection />
      <ProposalSection />
    </>
  );
}
