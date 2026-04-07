import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";
import type { GtpCommitteeMember } from "@/components/gtp/gtp-committee-member-card";
import { client } from "./client";
import type { GtpAboutPageDocumentRaw } from "./gtp-about-page-merge";
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

// ─── GTP About page (full document) ──────────────────────────────────────────

export type Gtp2026AboutPageData = GtpAboutPageDocumentRaw;

const gtpAboutPageQuery = `*[_type == "gtp2026AboutPage"][0]{
  sections,
  heroBand {
    badge,
    title,
    lede,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref
  },
  whatIsBand {
    eyebrow,
    title,
    body,
    quote,
    learnMoreIntro,
    learnMoreLinkLabel,
    learnMoreLinkUrl,
    downloadButtonLabel,
    downloadButtonUrl,
    "reportCoverUrl": reportCover.asset->url
  },
  whyMattersBand {
    eyebrow,
    title,
    body,
    ctaLabel,
    ctaHref,
    tallImageSrc,
    topRightImageSrc,
    bottomRightImageSrc,
    tallImageAlt,
    topRightImageAlt,
    bottomRightImageAlt
  },
  themesBand {
    title,
    subtitle,
    footerBlurb,
    themes[] { num, title, body, icon }
  },
  speakersChrome { title, subtitle },
  quotesBand {
    title,
    subtitle,
    quotes[] {
      name,
      designation,
      quote,
      photoSrc,
      avatarObjectClass,
      avatarScaleClass
    }
  },
  galleryBand {
    title,
    subtitle,
    footerText,
    footerLinkLabel,
    footerLinkHref,
    slides[] { src, alt }
  },
  eventInquiryBand { title, subtitle, intro },
  sponsorsBand {
    title,
    subtitle,
    sponsors[] {
      name,
      href,
      "logoUrl": logo.asset->url
    },
    noticeBeforeLink,
    noticeLinkText,
    noticeLinkHref
  }
}`;

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

/** Legacy flat documents (pre–embedded-items schema). */
const faqLegacyItemQuery = `*[_type == "gtp2026FaqItem"] | order(order asc, question asc) {
  _id,
  question,
  answer,
  order
}`;

export async function getGtp2026FaqItems(): Promise<Gtp2026FaqItemData[]> {
  return client.fetch(faqLegacyItemQuery);
}

export type Gtp2026FaqGroupWithItems = {
  _id: string;
  title: string;
  order?: number | null;
  items: Gtp2026FaqItemData[];
};

const faqGroupsWithItemsQuery = `*[_type == "gtp2026FaqGroup"] | order(order asc, title asc) {
  _id,
  title,
  order,
  "items": items | order(order asc, question asc) {
    _key,
    question,
    answer,
    order
  }
}`;

const LEGACY_FALLBACK_GROUP_ID = "gtp-faq-legacy-fallback";

function filterValidFaqItems(rows: Gtp2026FaqItemData[]): Gtp2026FaqItemData[] {
  return rows.filter((item) => item.question?.trim() && item.answer?.trim());
}

function mapEmbeddedFaqRows(
  rows: {
    _key?: string | null;
    question?: string | null;
    answer?: string | null;
    order?: number | null;
  }[] | null,
  groupId: string,
): Gtp2026FaqItemData[] {
  if (!rows?.length) return [];
  return filterValidFaqItems(
    rows.map((row, index) => ({
      _id:
        typeof row._key === "string" && row._key.trim()
          ? `${groupId}-${row._key}`
          : `${groupId}-item-${index}`,
      question: typeof row.question === "string" ? row.question : "",
      answer: typeof row.answer === "string" ? row.answer : "",
      order: row.order,
    })),
  );
}

/**
 * FAQ tabs: each `gtp2026FaqGroup` document holds an `items` array (Q&A).
 * Falls back to legacy `gtp2026FaqItem` documents if no tab has embedded items yet.
 */
export async function getGtp2026FaqGroupsWithItems(): Promise<
  Gtp2026FaqGroupWithItems[]
> {
  const groups = await client
    .fetch<
      {
        _id: string;
        title?: string | null;
        order?: number | null;
        items?: {
          _key?: string | null;
          question?: string | null;
          answer?: string | null;
          order?: number | null;
        }[] | null;
      }[]
    >(faqGroupsWithItemsQuery)
    .catch(() => []);

  const withValidItems: Gtp2026FaqGroupWithItems[] = groups.map((g) => ({
    _id: g._id,
    title: typeof g.title === "string" ? g.title.trim() : "",
    order: g.order,
    items: mapEmbeddedFaqRows(g.items ?? null, g._id),
  }));

  const nonEmpty = withValidItems.filter(
    (g) => g.title && g.items.length > 0,
  );

  if (nonEmpty.length > 0) {
    return nonEmpty;
  }

  const flat = await getGtp2026FaqItems().catch(() => []);
  const legacyItems = filterValidFaqItems(flat);
  if (legacyItems.length === 0) {
    return [];
  }

  return [
    {
      _id: LEGACY_FALLBACK_GROUP_ID,
      title: "FAQ",
      order: 0,
      items: legacyItems,
    },
  ];
}
