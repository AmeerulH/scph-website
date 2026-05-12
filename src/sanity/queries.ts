import { client } from "./client";
import type {
  SectionBlock,
  SectionProseCtaBlock,
  SectionStatsRowBlock,
} from "./section-block-types";
import type {
  ScphHomeHeroSanity,
  ScphHomeHighlightedEventSanity,
} from "./scph-home-resolvers";
import type { ScphHomePartnersBandRaw } from "./scph-home-partners";

export type {
  GtpCarouselMeta,
  GtpFeaturedCarouselSession,
  GtpProgrammePageData,
  GtpProgrammeTab,
  GtpSessionModalHostedBy,
} from "./gtp-programme";
export { buildGtpCarouselSessions, getGtp2026Programme } from "./gtp-programme";

export interface SanityTeamMember {
  _id: string;
  name: string;
  slug: { current: string };
  title: string;
  email: string;
  bio: string;
  imageUrl: string | null;
  profileUrl: string;
  group: string;
  order: number;
}

const teamMembersQuery = `*[_type == "teamMember"] | order(order asc, name asc) {
  _id,
  name,
  slug,
  title,
  email,
  bio,
  "imageUrl": image.asset->url,
  profileUrl,
  group,
  order
}`;

export async function getTeamMembers(): Promise<SanityTeamMember[]> {
  return client.fetch(teamMembersQuery);
}

export type ScphHomeAboutSectionData = {
  enabled?: boolean | null;
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
} | null;

export type ScphHomePriorityCardData = {
  _key: string;
  title?: string | null;
  description?: string | null;
};

export type ScphHomePrioritiesSectionData = {
  enabled?: boolean | null;
  sectionTitle?: string | null;
  sectionSubtitle?: string | null;
  linkHref?: string | null;
  cards?: ScphHomePriorityCardData[] | null;
} | null;

export type ScphHomePageData = {
  hero: ScphHomeHeroSanity;
  highlightedEvents: ScphHomeHighlightedEventSanity[] | null;
  statsRow: SectionStatsRowBlock | null;
  introSections: SectionBlock[] | null;
  aboutSection: ScphHomeAboutSectionData;
  priorityAreasSection: ScphHomePrioritiesSectionData;
  roadmapSection: SectionProseCtaBlock | null;
  nphapSection: SectionProseCtaBlock | null;
  partnersBand: ScphHomePartnersBandRaw;
  showGtpSection: boolean | null;
  showGtpInquirySection: boolean | null;
};

const scphHomePageQuery = `*[_type == "scphHomePage"][0] {
  hero,
  highlightedEvents,
  statsRow,
  introSections,
  aboutSection,
  priorityAreasSection,
  roadmapSection,
  nphapSection,
  partnersBand {
    showBand,
    title,
    subtitle,
    partners[] {
      name,
      href,
      "logoUrl": logo.asset->url
    },
    noticeBeforeLink,
    noticeLinkText,
    noticeLinkHref
  },
  showGtpSection,
  showGtpInquirySection
}`;

/** First `scphHomePage` document, or `null` if none / fetch error callers should handle. */
export async function getScphHomePage(): Promise<ScphHomePageData | null> {
  return client.fetch<ScphHomePageData | null>(scphHomePageQuery);
}
