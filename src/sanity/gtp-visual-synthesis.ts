import { cache } from "react";
import { client } from "./client";
import { httpsUrl, opt, paragraphs, s } from "./gtp-media-page";
import {
  GTP_CONFERENCE_ENDS_AT,
  GTP_SYNTHESIS_DAYS,
  GTP_SYNTHESIS_FALLBACK_MAPS,
  GTP_VISUAL_SYNTHESIS_DEFAULTS,
  type GtpSynthesisDayId,
  type GtpSynthesisImage,
  type GtpSynthesisLink,
  type GtpSynthesisMap,
  type GtpVisualSynthesisResolved,
} from "@/data/gtp-visual-synthesis-defaults";

type Str = string | null | undefined;
type Num = number | null | undefined;

type RawSynthesis = {
  synthesisTitle?: Str;
  synthesisIntro?: Str;
  synthesisLiveNote?: Str;
  synthesisCreditLine?: Str;
  synthesisContributor?: {
    name?: Str;
    role?: Str;
    bio?: Str;
    headshotUrl?: Str;
    headshotAlt?: Str;
    headshotWidth?: Num;
    headshotHeight?: Num;
    links?: ({ label?: Str; url?: Str } | null)[] | null;
  } | null;
  synthesisMaps?:
    | ({
        _key?: Str;
        day?: Str;
        title?: Str;
        timeLabel?: Str;
        summary?: Str;
        imageUrl?: Str;
        imageAlt?: Str;
        imageWidth?: Num;
        imageHeight?: Num;
      } | null)[]
    | null;
};

const synthesisQuery = `*[_type == "gtp2026MediaPage"][0]{
  synthesisTitle, synthesisIntro, synthesisLiveNote, synthesisCreditLine,
  synthesisContributor{
    name, role, bio,
    "headshotUrl": headshot.asset->url, "headshotAlt": headshot.alt,
    "headshotWidth": headshot.asset->metadata.dimensions.width,
    "headshotHeight": headshot.asset->metadata.dimensions.height,
    links[]{ label, url }
  },
  synthesisMaps[]{
    _key, day, title, timeLabel, summary,
    "imageUrl": image.asset->url, "imageAlt": image.alt,
    "imageWidth": image.asset->metadata.dimensions.width,
    "imageHeight": image.asset->metadata.dimensions.height
  }
}`;

const VALID_DAYS = new Set<string>(GTP_SYNTHESIS_DAYS.map((d) => d.id));

/** Sanity returns dimensions for every uploaded image; 16:9 is only a guard so a missing value never breaks layout. */
function dims(w: Num, h: Num) {
  return w && h && w > 0 && h > 0 ? { width: w, height: h } : { width: 1600, height: 900 };
}

function image(url: string, alt: string, w: Num, h: Num): GtpSynthesisImage {
  return { src: url, alt, ...dims(w, h) };
}

export function mergeGtpVisualSynthesis(
  raw: RawSynthesis | null,
  now: number = Date.now(),
): GtpVisualSynthesisResolved {
  const d = GTP_VISUAL_SYNTHESIS_DEFAULTS;
  const afterConference = now >= GTP_CONFERENCE_ENDS_AT;
  const c = raw?.synthesisContributor;

  const links: GtpSynthesisLink[] = (c?.links ?? [])
    .map((l) => ({ label: s(l?.label, "Link"), url: httpsUrl(l?.url) }))
    .filter((l): l is GtpSynthesisLink => Boolean(l.url));
  const contributorLinks = links.length ? links : [...d.contributor.links];

  const name = s(c?.name, d.contributor.name);
  const headshot = c?.headshotUrl
    ? image(c.headshotUrl, s(c.headshotAlt, name), c.headshotWidth, c.headshotHeight)
    : undefined;

  const studioMaps: GtpSynthesisMap[] = [];
  (raw?.synthesisMaps ?? []).forEach((m, i) => {
    const day = m?.day?.trim();
    const title = m?.title?.trim();
    if (!m?.imageUrl || !title || !day || !VALID_DAYS.has(day)) return;
    studioMaps.push({
      id: m._key || `map-${i}`,
      day: day as GtpSynthesisDayId,
      title,
      timeLabel: opt(m.timeLabel),
      summary: opt(m.summary),
      image: image(m.imageUrl, s(m.imageAlt, `${title}: visual synthesis map`), m.imageWidth, m.imageHeight),
    });
  });

  const bigPicture = contributorLinks.find((l) => /(^|\.)biggerpicture\.dk(\/|$)/i.test(l.url.replace(/^https:\/\//i, "")));

  return {
    title: s(raw?.synthesisTitle, d.title),
    intro: paragraphs(raw?.synthesisIntro, [...(afterConference ? d.introAfter : d.introDuring)]),
    liveNote: opt(raw?.synthesisLiveNote) ?? (afterConference ? undefined : d.liveNote),
    credit: { text: s(raw?.synthesisCreditLine, d.creditLine), bigPictureUrl: bigPicture?.url },
    contributor: {
      name,
      role: s(c?.role, d.contributor.role),
      bio: paragraphs(c?.bio, [...d.contributor.bio]),
      headshot,
      links: contributorLinks,
    },
    maps: studioMaps.length ? studioMaps : GTP_SYNTHESIS_FALLBACK_MAPS,
    afterConference,
  };
}

export const getGtpVisualSynthesis = cache(async (): Promise<GtpVisualSynthesisResolved> => {
  const raw = await client.fetch<RawSynthesis | null>(synthesisQuery).catch(() => null);
  return mergeGtpVisualSynthesis(raw);
});

/** The requested day when valid, else the latest day that has maps, else Day 1. */
export function resolveActiveDay(
  maps: GtpSynthesisMap[],
  requested: string | null | undefined,
): GtpSynthesisDayId {
  if (requested && VALID_DAYS.has(requested)) return requested as GtpSynthesisDayId;
  const withMaps = new Set(maps.map((m) => m.day));
  for (let i = GTP_SYNTHESIS_DAYS.length - 1; i >= 0; i--) {
    if (withMaps.has(GTP_SYNTHESIS_DAYS[i].id)) return GTP_SYNTHESIS_DAYS[i].id;
  }
  return "1";
}

/** Short status for the Media hero index. */
export function synthesisHeroMeta(maps: GtpSynthesisMap[]): string {
  const withMaps = new Set(maps.map((m) => m.day));
  for (let i = GTP_SYNTHESIS_DAYS.length - 1; i >= 0; i--) {
    const day = GTP_SYNTHESIS_DAYS[i];
    if (withMaps.has(day.id)) return day.id === "final" ? "Final synthesis live" : `${day.label} maps live`;
  }
  return "Coming soon";
}
