import { client } from "./client";

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
