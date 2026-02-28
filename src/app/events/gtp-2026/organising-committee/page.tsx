import { SectionWrapper } from "@/components/shared/section-wrapper";
import { UserCircle2 } from "lucide-react";

// ─── Hero Band ────────────────────────────────────────────────────────────────

function OrgCommitteeHero() {
  return (
    <div className="bg-gtp-dark-teal px-4 pb-24 pt-40 text-center">
      <div className="mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          GTP 2026
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Organising Committee
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Join the conversation with global experts shaping the future of
          planetary health and positive tipping points.
        </p>
      </div>
    </div>
  );
}

// ─── Co-chairs ────────────────────────────────────────────────────────────────

const cochairs = [
  {
    name: "Tim Lenton",
    role: "Co-chair",
    designation:
      "Founding Director of the Global Systems Institute, University of Exeter",
  },
  {
    name: "Johan Rockström",
    role: "Co-chair",
    designation:
      "Director of the Potsdam Institute for Climate Impact Research",
  },
  {
    name: "Jemilah Mahmood",
    role: "Co-chair",
    designation:
      "Executive Director of the Sunway Centre for Planetary Health, Sunway University",
  },
];

function AvatarPlaceholder() {
  return (
    <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-gtp-dark-teal/10 ring-2 ring-gtp-teal/20 md:h-56 md:w-56">
      {/* TODO: replace with real photo once available */}
      <UserCircle2 className="h-24 w-24 text-gtp-teal/30 md:h-28 md:w-28" />
    </div>
  );
}

function CochairsSection() {
  return (
    <SectionWrapper
      title="Meet the Co-chairs"
      subtitle="Join the Conversation"
      theme="gtp"
      background="default"
    >
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {cochairs.map(({ name, role, designation }) => (
          <div key={name} className="flex flex-col items-center text-center">
            <AvatarPlaceholder />
            <h3 className="mt-5 font-heading text-xl font-bold text-gtp-dark-teal">
              {name}
            </h3>
            <p className="mt-1 text-sm font-semibold italic text-gtp-teal">
              {role}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {designation}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── More to be announced ─────────────────────────────────────────────────────

function AnnouncementSection() {
  return (
    <SectionWrapper theme="gtp" background="muted">
      <div className="py-8 text-center">
        <p className="font-heading text-2xl font-bold text-gtp-dark-teal md:text-3xl">
          …and more to be announced!
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
          The Global Tipping Points Conference 2026 brings the science, urgency,
          and optimism of tipping points to Asia for the first time. Rooted in
          South and Southeast Asian realities, it aims to build momentum for
          decisive action ahead of COP31.
        </p>
      </div>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganisingCommitteePage() {
  return (
    <>
      <OrgCommitteeHero />
      <CochairsSection />
      <AnnouncementSection />
    </>
  );
}
