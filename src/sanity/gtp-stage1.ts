import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";
import type { GtpCommitteeMember } from "@/components/gtp/gtp-committee-member-card";
import { client } from "./client";
import type { SectionBlock } from "./section-block-types";
import { sectionBlocksMayRender } from "./section-block-types";

// ─── Highlight speakers ───────────────────────────────────────────────────────

export type SanityHighlightSpeakerRaw = {
  _id: string;
  name: string;
  role?: string | null;
  organisation?: string | null;
  bio?: string | null;
  session?: string | null;
  sessionDate?: string | null;
  photoClassName?: string | null;
  photoUnoptimized?: boolean | null;
  imageUrl?: string | null;
  sessions?: { title?: string | null; date?: string | null }[] | null;
};

const highlightSpeakersQuery = `*[_type == "gtp2026HighlightSpeaker"] | order(order asc, name asc) {
  _id,
  name,
  role,
  organisation,
  bio,
  session,
  sessionDate,
  photoClassName,
  photoUnoptimized,
  "imageUrl": image.asset->url,
  sessions[] { title, date }
}`;

export async function getGtp2026HighlightSpeakers(): Promise<
  SanityHighlightSpeakerRaw[]
> {
  return client.fetch(highlightSpeakersQuery);
}

export function mapSanityHighlightToProps(
  rows: SanityHighlightSpeakerRaw[],
): GtpHighlightSpeaker[] {
  return rows.map((doc) => ({
    name: doc.name,
    role: doc.role?.trim() ?? "",
    organisation: doc.organisation?.trim() ?? "",
    bio: doc.bio?.trim() ?? "",
    session: doc.session?.trim() ?? "Session to be announced",
    sessionDate: doc.sessionDate?.trim() ?? "Date & time to be announced",
    photoSrc: doc.imageUrl?.trim() || undefined,
    photoClassName: doc.photoClassName?.trim() || undefined,
    photoUnoptimized: doc.photoUnoptimized === true,
    sessions:
      doc.sessions
        ?.filter((s) => s.title?.trim() && s.date?.trim())
        .map((s) => ({
          title: s.title!.trim(),
          date: s.date!.trim(),
        })) ?? undefined,
  }));
}

// ─── GTP About page (section blocks) ─────────────────────────────────────────

export type Gtp2026AboutPageData = {
  sections: SectionBlock[] | null;
};

const gtpAboutPageQuery = `*[_type == "gtp2026AboutPage"][0]{ sections }`;

export async function getGtp2026AboutPage(): Promise<Gtp2026AboutPageData | null> {
  return client.fetch<Gtp2026AboutPageData | null>(gtpAboutPageQuery);
}

export function gtpAboutCmsSectionsRender(sections: unknown): boolean {
  return sectionBlocksMayRender(sections);
}

// ─── Committee ────────────────────────────────────────────────────────────────

export type SanityCommitteeMemberRaw = {
  _id: string;
  committeeGroup: "cochair" | "planning" | "programme";
  name: string;
  role?: string | null;
  organisation?: string | null;
  designation?: string | null;
  isPlaceholder?: boolean | null;
  imageUrl?: string | null;
  imageObjectClass?: string | null;
  imageScaleClass?: string | null;
  order?: number | null;
};

const committeeQuery = `*[_type == "gtp2026CommitteeMember"] | order(order asc, name asc) {
  _id,
  committeeGroup,
  name,
  role,
  organisation,
  designation,
  isPlaceholder,
  "imageUrl": image.asset->url,
  imageObjectClass,
  imageScaleClass,
  order
}`;

export async function getGtp2026CommitteeMembers(): Promise<
  SanityCommitteeMemberRaw[]
> {
  return client.fetch(committeeQuery);
}

export type CoChairProps = {
  name: string;
  role: string;
  designation: string;
  photoSrc?: string;
  imageObjectClass?: string;
  imageScaleClass?: string;
};

export function mapCommitteeToCoChairs(
  rows: SanityCommitteeMemberRaw[],
): CoChairProps[] {
  return rows
    .filter((r) => r.committeeGroup === "cochair")
    .map((doc) => ({
      name: doc.name,
      role: doc.role?.trim() ?? "",
      designation:
        doc.designation?.trim() ||
        doc.organisation?.trim() ||
        "",
      photoSrc: doc.imageUrl?.trim() || undefined,
      imageObjectClass: doc.imageObjectClass?.trim() || undefined,
      imageScaleClass: doc.imageScaleClass?.trim() || undefined,
    }));
}

export function mapCommitteeToGridMembers(
  rows: SanityCommitteeMemberRaw[],
  group: "planning" | "programme",
): GtpCommitteeMember[] {
  return rows
    .filter((r) => r.committeeGroup === group)
    .map((doc) => ({
      name: doc.name,
      role: doc.role?.trim() ?? "",
      organisation: doc.organisation?.trim() || undefined,
      isPlaceholder: doc.isPlaceholder === true,
      photoSrc: doc.imageUrl?.trim() || undefined,
      imageObjectClass: doc.imageObjectClass?.trim() || undefined,
    }));
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export type Gtp2026FaqItemData = {
  _id: string;
  question: string;
  answer: string;
  order?: number | null;
};

const faqQuery = `*[_type == "gtp2026FaqItem"] | order(order asc, question asc) {
  _id,
  question,
  answer,
  order
}`;

export async function getGtp2026FaqItems(): Promise<Gtp2026FaqItemData[]> {
  return client.fetch(faqQuery);
}
