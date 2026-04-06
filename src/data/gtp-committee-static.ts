import type { GtpCommitteeMember } from "@/components/gtp/gtp-committee-member-card";

/**
 * Static fallback for GTP organising committee (co-chairs section).
 * Shape matches `CoChairProps` from `@/sanity/gtp-stage1`.
 */
export type GtpStaticCoChair = {
  name: string;
  role: string;
  designation: string;
  photoSrc?: string;
  imageObjectClass?: string;
  imageScaleClass?: string;
};

export const gtpStaticCoChairs: GtpStaticCoChair[] = [
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

export const gtpStaticPlanningCommittee: GtpCommitteeMember[] = [
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

export const gtpStaticProgrammeCommittee: GtpCommitteeMember[] = [
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
