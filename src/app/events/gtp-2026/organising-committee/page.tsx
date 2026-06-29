import type { Metadata } from "next";
import Image from "next/image";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import {
  GtpCommitteeMemberCard,
  type GtpCommitteeMember,
} from "@/components/gtp/gtp-committee-member-card";
import { GtpForestHero } from "@/components/sections/heroes";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  gtpStaticCoChairs,
  gtpStaticPlanningCommittee,
  gtpStaticProgrammeCommittee,
} from "@/data/gtp-committee-static";
import {
  getGtp2026CommitteeMembers,
  mapCommitteeToCoChairs,
  mapCommitteeToGridMembers,
  type CoChairProps,
} from "@/sanity/gtp-stage1";

const description =
  "Organising committee and leadership for Global Tipping Points Conference 2026—Sunway Centre for Planetary Health and partners.";

export const metadata: Metadata = {
  title: "Organising committee",
  description,
  alternates: { canonical: "/events/gtp-2026/organising-committee" },
  openGraph: {
    title: "Organising committee | GTP 2026",
    description,
    url: "/events/gtp-2026/organising-committee",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 organising committee",
    description,
  },
};

/** Refetch committee from Sanity on every request (no ISR cache). */
export const dynamic = "force-dynamic";

const staticCochairs: CoChairProps[] = gtpStaticCoChairs;

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

function CochairsSection({ cochairs }: { cochairs: CoChairProps[] }) {
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

const staticPlanningCommittee = gtpStaticPlanningCommittee;
const staticProgrammeCommittee = gtpStaticProgrammeCommittee;

function CommitteeSection({
  planningCommittee,
  programmeCommittee,
}: {
  planningCommittee: GtpCommitteeMember[];
  programmeCommittee: GtpCommitteeMember[];
}) {
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
            <GtpCommitteeMemberCard
              key={`${member.name}-planning-${i}`}
              member={member}
            />
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
            <GtpCommitteeMemberCard
              key={`${member.name}-programme-${i}`}
              member={member}
            />
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

export default async function OrganisingCommitteePage() {
  const rows = await getGtp2026CommitteeMembers().catch(() => []);
  const cmsCoChairs = mapCommitteeToCoChairs(rows);
  const cmsPlanning = mapCommitteeToGridMembers(rows, "planning");
  const cmsProgramme = mapCommitteeToGridMembers(rows, "programme");

  const cochairs =
    cmsCoChairs.length >= 1 ? cmsCoChairs : staticCochairs;
  const planningCommittee =
    cmsPlanning.length >= 1 ? cmsPlanning : staticPlanningCommittee;
  const programmeCommittee =
    cmsProgramme.length >= 1 ? cmsProgramme : staticProgrammeCommittee;

  return (
    <>
      <GtpForestHero
        title="Organising Committee"
        lede="Co-chairs and committees bringing together science, policy, and partners for Global Tipping Points Conference 2026 in Kuala Lumpur."
        bottomSpacing="spacious"
      />
      <CochairsSection cochairs={cochairs} />
      <CommitteeSection
        planningCommittee={planningCommittee}
        programmeCommittee={programmeCommittee}
      />
      <AnnouncementSection />
    </>
  );
}
