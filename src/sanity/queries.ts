import { client } from "./client";
import type { SectionBlock, SectionStatsRowBlock } from "./section-block-types";

export type {
  GtpCarouselMeta,
  GtpFeaturedCarouselSession,
  GtpProgrammePageData,
  GtpProgrammeTab,
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

export type ScphHomePageData = {
  statsRow: SectionStatsRowBlock | null;
  introSections: SectionBlock[] | null;
};

const scphHomePageQuery = `*[_type == "scphHomePage"][0] {
  statsRow,
  introSections
}`;

/** First `scphHomePage` document, or `null` if none / fetch error callers should handle. */
export async function getScphHomePage(): Promise<ScphHomePageData | null> {
  return client.fetch<ScphHomePageData | null>(scphHomePageQuery);
}
