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
          Co-chairs and committees bringing together science, policy, and
          partners for Global Tipping Points Conference 2026 in Kuala Lumpur.
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
  /** `object-position` — tune per portrait so the face sits near the visual centre */
  imageObjectClass?: string;
  /** Zoom (scale) + origin for full-body or distant shots, e.g. Johan */
  imageScaleClass?: string;
};

const cochairs: CoChair[] = [
  {
    name: "Tim Lenton",
    role: "Co-Chair",
    designation:
      "Founding Director of the Global Systems Institute,\nUniversity of Exeter",
    photoSrc: "/images/gtp/co-chairs/tim-lenton.jpg",
    imageObjectClass: "object-[50%_38%]",
  },
  {
    name: "Johan Rockström",
    role: "Co-Chair",
    designation:
      "Director of the Potsdam Institute for Climate Impact Research",
    photoSrc: "/images/gtp/co-chairs/johan-rockstrom.jpg",
    imageObjectClass: "object-[50%_22%]",
    imageScaleClass: "scale-[1.58] origin-[50%_28%]",
  },
  {
    name: "Jemilah Mahmood",
    role: "Co-Chair",
    designation:
      "Executive Director of the Sunway Centre for Planetary Health, Sunway University",
    photoSrc: "/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.png",
    imageObjectClass: "object-[50%_22%]",
    imageScaleClass: "scale-[1.48] origin-[50%_6%]",
  },
];

const coChairPortraitFrame =
  "relative aspect-[4/5] w-full max-w-[17.5rem] overflow-hidden rounded-3xl ring-2 ring-gtp-teal/20 sm:max-w-[19rem] md:max-w-[21rem]";

function CoChairPhoto({
  name,
  photoSrc,
  imageObjectClass,
  imageScaleClass,
}: {
  name: string;
  photoSrc?: string;
  imageObjectClass?: string;
  imageScaleClass?: string;
}) {
  if (photoSrc) {
    return (
      <div className={coChairPortraitFrame}>
        <Image
          src={photoSrc}
          alt={name}
          fill
          className={cn(
            "object-cover",
            imageObjectClass ?? "object-[50%_40%]",
            imageScaleClass,
          )}
          sizes="(max-width: 640px) 280px, (max-width: 768px) 304px, 336px"
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        coChairPortraitFrame,
        "flex items-center justify-center bg-gtp-dark-teal/10",
      )}
    >
      <UserCircle2 className="h-28 w-28 text-gtp-teal/30 sm:h-32 sm:w-32" />
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
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8 lg:gap-12">
        {cochairs.map(
          ({
            name,
            role,
            designation,
            photoSrc,
            imageObjectClass,
            imageScaleClass,
          }) => (
            <div
              key={name}
              className="flex flex-col items-center text-center sm:px-1"
            >
              <CoChairPhoto
                name={name}
                photoSrc={photoSrc}
                imageObjectClass={imageObjectClass}
                imageScaleClass={imageScaleClass}
              />
              <h3 className="mt-6 font-heading text-2xl font-bold leading-tight text-gtp-dark-teal md:text-3xl">
                {name}
              </h3>
              <p className="mt-2 text-base font-semibold italic text-gtp-teal md:text-lg">
                {role}
              </p>
              <p className="mt-3 max-w-[22rem] whitespace-pre-line text-base leading-relaxed text-gray-600 md:text-lg">
                {designation}
              </p>
            </div>
          ),
        )}
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
  photoSrc?: string;
  imageObjectClass?: string;
};

const planningCommittee: CommitteeMember[] = [
  {
    name: "Andy Richards",
    role: "Co-Chair",
    organisation: "University of Exeter",
  },
  {
    name: "Nazia Ahmad",
    role: "Co-Chair",
    organisation: "Sunway Centre for Planetary Health, Sunway University",
    photoSrc: "/images/scph/team/nazia-ahmad.jpg",
  },
  { name: "TBC", role: "Media Strategy", isPlaceholder: true },
  { name: "TBC", role: "Logistics", isPlaceholder: true },
  { name: "TBC", role: "Breakout Coordinator", isPlaceholder: true },
  { name: "TBC", role: "Contracting", isPlaceholder: true },
  { name: "TBC", role: "Promotional Strategy", isPlaceholder: true },
  { name: "TBC", role: "Budget & Event Management", isPlaceholder: true },
];

const programmeCommittee: CommitteeMember[] = [
  {
    name: "Dr. Fatimah Ahamad",
    role: "Co-Chair",
    organisation: "Sunway Centre for Planetary Health, Sunway University",
    photoSrc: "/images/scph/team/dr-fatimah-ahamad.jpg",
  },
  {
    name: "Prof. Tim Lenton",
    role: "Co-Chair",
    organisation: "University of Exeter",
    photoSrc: "/images/gtp/co-chairs/tim-lenton.jpg",
    imageObjectClass: "object-[56%_44%]",
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
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gtp-dark-teal/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gtp-dark-teal/10">
        {member.photoSrc ? (
          <Image
            src={member.photoSrc}
            alt={member.name}
            fill
            className={cn(
              "object-cover",
              member.imageObjectClass ?? "object-top",
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          />
        ) : (
          <div className="flex h-full min-h-[9rem] items-center justify-center">
            <UserCircle2 className="h-16 w-16 text-gtp-teal/25 sm:h-20 sm:w-20" />
          </div>
        )}
      </div>
      <div className="p-5">
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
