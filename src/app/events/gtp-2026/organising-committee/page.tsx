import Image from "next/image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Hero Band ────────────────────────────────────────────────────────────────

function OrgCommitteeHero() {
  return (
    <div className="relative overflow-hidden px-4 pb-24 pt-40 text-center">
      {/* Forest background */}
      <Image
        src="/images/gtp/forest-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gtp-dark-teal/75" />

      <div className="relative mx-auto max-w-4xl">
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

type CoChair = {
  name: string;
  role: string;
  designation: string;
  photoSrc?: string;
  /** Tailwind object-position utilities for face-centring */
  imageObjectClass?: string;
};

const cochairs: CoChair[] = [
  {
    name: "Tim Lenton",
    role: "Co-Chair",
    designation:
      "Founding Director of the Global Systems Institute,\nUniversity of Exeter",
    photoSrc: "/images/gtp/co-chairs/tim-lenton.jpg",
    imageObjectClass: "object-[56%_44%]",
  },
  {
    name: "Johan Rockström",
    role: "Co-Chair",
    designation:
      "Director of the Potsdam Institute for Climate Impact Research",
    photoSrc: "/images/gtp/co-chairs/johan-rockstrom.jpg",
  },
  {
    name: "Jemilah Mahmood",
    role: "Co-Chair",
    designation:
      "Executive Director of the Sunway Centre for Planetary Health, Sunway University",
    photoSrc: "/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.jpg",
    imageObjectClass: "object-[50%_32%]",
  },
];

function CoChairPhoto({
  name,
  photoSrc,
  imageObjectClass,
}: {
  name: string;
  photoSrc?: string;
  imageObjectClass?: string;
}) {
  if (photoSrc) {
    return (
      <div className="relative h-48 w-48 overflow-hidden rounded-2xl ring-2 ring-gtp-teal/20 md:h-56 md:w-56">
        <Image
          src={photoSrc}
          alt={name}
          fill
          className={cn(
            "object-cover",
            imageObjectClass ?? "object-top",
          )}
          sizes="(max-width: 768px) 192px, 224px"
        />
      </div>
    );
  }
  return (
    <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-gtp-dark-teal/10 ring-2 ring-gtp-teal/20 md:h-56 md:w-56">
      <UserCircle2 className="h-24 w-24 text-gtp-teal/30 md:h-28 md:w-28" />
    </div>
  );
}

function CochairsSection() {
  return (
    <SectionWrapper
      title="Meet the Co-Chairs"
      subtitle="Join the Conversation"
      theme="gtp"
      background="default"
    >
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {cochairs.map(({ name, role, designation, photoSrc, imageObjectClass }) => (
          <div key={name} className="flex flex-col items-center text-center">
            <CoChairPhoto
              name={name}
              photoSrc={photoSrc}
              imageObjectClass={imageObjectClass}
            />
            <h3 className="mt-5 font-heading text-xl font-bold text-gtp-dark-teal">
              {name}
            </h3>
            <p className="mt-1 text-sm font-semibold italic text-gtp-teal">
              {role}
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-500">
              {designation}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── Committee Section ────────────────────────────────────────────────────────

type CommitteeMember = {
  name: string;
  role: string;
  organisation?: string;
  isPlaceholder?: boolean;
};

const planningCommittee: CommitteeMember[] = [
  {
    name: "Andy Richards",
    role: "Co-Chair",
    organisation: "University of Exeter",
  },
  { name: "Nazia Ahmad", role: "Co-Chair", organisation: "SCPH" },
  { name: "TBC", role: "Media Strategy", isPlaceholder: true },
  { name: "TBC", role: "Logistics", isPlaceholder: true },
  { name: "TBC", role: "Breakout Coordinator", isPlaceholder: true },
  { name: "TBC", role: "Contracting", isPlaceholder: true },
  { name: "TBC", role: "Promotional Strategy", isPlaceholder: true },
  { name: "TBC", role: "Budget & Event Management", isPlaceholder: true },
];

const programmeCommittee: CommitteeMember[] = [
  { name: "Dr. Fatimah Ahamad", role: "Co-Chair", organisation: "SCPH" },
  {
    name: "Prof. Tim Lenton",
    role: "Co-Chair",
    organisation: "University of Exeter",
  },
  { name: "TBC", role: "Abstract Review", isPlaceholder: true },
  { name: "TBC", role: "Programme Agenda", isPlaceholder: true },
  { name: "TBC", role: "Outcome Report", isPlaceholder: true },
];

function CommitteeCard({ member }: { member: CommitteeMember }) {
  if (member.isPlaceholder) {
    return (
      <div className="flex flex-col rounded-2xl border border-dashed border-gtp-teal/20 bg-gtp-dark-teal/3 p-6">
        <p className="font-heading text-sm font-semibold text-gtp-dark-teal/40">
          {member.role}
        </p>
        <p className="mt-1 text-xs text-gray-400">To be announced</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow-md ring-1 ring-gtp-dark-teal/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <p className="font-heading text-base font-bold text-gtp-dark-teal">
        {member.name}
      </p>
      <p className="mt-1 text-sm font-semibold italic text-gtp-teal">
        {member.role}
      </p>
      {member.organisation && (
        <p className="mt-1 text-xs text-gray-500">{member.organisation}</p>
      )}
    </div>
  );
}

function CommitteeSection() {
  return (
    <SectionWrapper
      title="Meet the Team"
      subtitle="Our Committee"
      theme="gtp"
      background="muted"
    >
      {/* Planning Committee */}
      <div className="mb-12">
        <h3 className="mb-6 font-heading text-xl font-bold text-gtp-dark-teal md:text-2xl">
          Planning Committee
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {planningCommittee.map((member, i) => (
            <CommitteeCard key={`planning-${i}`} member={member} />
          ))}
        </div>
      </div>

      {/* Programme Committee */}
      <div>
        <h3 className="mb-6 font-heading text-xl font-bold text-gtp-dark-teal md:text-2xl">
          Programme Committee
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {programmeCommittee.map((member, i) => (
            <CommitteeCard key={`programme-${i}`} member={member} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── More to be announced ─────────────────────────────────────────────────────

function AnnouncementSection() {
  return (
    <SectionWrapper theme="gtp" background="default">
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
      <CommitteeSection />
      <AnnouncementSection />
    </>
  );
}
