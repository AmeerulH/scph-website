import { client } from "./client";
import {
  GTP_SUSTAINABILITY_DEFAULTS,
  type GtpSustainabilityCommitment,
  type GtpSustainabilityPageResolved,
} from "@/data/gtp-sustainability-page-defaults";

type Str = string | null | undefined;

type RawSustainability = {
  pageTitle?: Str;
  seoDescription?: Str;
  heroImageUrl?: Str;
  heroImageAlt?: Str;
  introLead?: Str;
  introBody?: Str;
  commitmentsTitle?: Str;
  commitments?: {
    _key?: Str;
    category?: Str;
    headline?: Str;
    body?: Str;
    imageUrl?: Str;
    imageAlt?: Str;
    stat?: { value?: Str; label?: Str } | null;
    link?: { label?: Str; href?: Str } | null;
  }[] | null;
  homeTeaserEnabled?: boolean | null;
  homeTeaserTitle?: Str;
  homeTeaserBody?: Str;
  homeTeaserImageUrl?: Str;
  homeTeaserImageAlt?: Str;
};

const sustainabilityQuery = `*[_type == "gtp2026SustainabilityPage"][0]{
  pageTitle, seoDescription,
  "heroImageUrl": heroImage.asset->url, "heroImageAlt": heroImage.alt,
  introLead, introBody, commitmentsTitle,
  commitments[]{
    _key, category, headline, body,
    "imageUrl": image.asset->url, "imageAlt": image.alt,
    stat{ value, label },
    link{ label, href }
  },
  homeTeaserEnabled, homeTeaserTitle, homeTeaserBody,
  "homeTeaserImageUrl": homeTeaserImage.asset->url,
  "homeTeaserImageAlt": homeTeaserImage.alt
}`;

const s = (v: Str, fallback: string) => v?.trim() || fallback;
const paragraphs = (v: Str, fallback: string[]) => {
  const parts = v?.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return parts?.length ? parts : fallback;
};
const safeHref = (v: Str) => {
  const t = v?.trim();
  return t && (t.startsWith("/") || /^https:\/\//i.test(t)) ? t : undefined;
};

function mergeCommitments(raw: RawSustainability["commitments"]): GtpSustainabilityCommitment[] {
  const defaults = GTP_SUSTAINABILITY_DEFAULTS.commitments;
  if (!raw?.length) return defaults;
  return raw
    .filter((c) => c?.headline?.trim())
    .map((c, i) => {
      const d = defaults[i] ?? defaults[defaults.length - 1];
      const statValue = c.stat?.value?.trim();
      const href = safeHref(c.link?.href);
      const linkLabel = c.link?.label?.trim();
      return {
        id: c._key || `commitment-${i}`,
        category: s(c.category, ""),
        headline: c.headline!.trim(),
        body: s(c.body, ""),
        image: c.imageUrl
          ? { src: c.imageUrl, alt: s(c.imageAlt, c.headline!.trim()) }
          : d.image,
        stat: statValue ? { value: statValue, label: s(c.stat?.label, "") } : undefined,
        link: href && linkLabel ? { label: linkLabel, href } : undefined,
      };
    });
}

export function mergeGtpSustainabilityPage(
  raw: RawSustainability | null,
): GtpSustainabilityPageResolved {
  const d = GTP_SUSTAINABILITY_DEFAULTS;
  if (!raw) return d;
  return {
    title: s(raw.pageTitle, d.title),
    seoDescription: s(raw.seoDescription, d.seoDescription),
    heroImage: raw.heroImageUrl
      ? { src: raw.heroImageUrl, alt: s(raw.heroImageAlt, d.heroImage.alt) }
      : d.heroImage,
    introLead: s(raw.introLead, d.introLead),
    introBody: paragraphs(raw.introBody, d.introBody),
    commitmentsTitle: s(raw.commitmentsTitle, d.commitmentsTitle),
    commitments: mergeCommitments(raw.commitments),
    teaser: {
      enabled: raw.homeTeaserEnabled ?? d.teaser.enabled,
      title: s(raw.homeTeaserTitle, d.teaser.title),
      body: s(raw.homeTeaserBody, d.teaser.body),
      image: raw.homeTeaserImageUrl
        ? { src: raw.homeTeaserImageUrl, alt: s(raw.homeTeaserImageAlt, d.teaser.image.alt) }
        : d.teaser.image,
    },
  };
}

export async function getGtpSustainabilityPage(): Promise<GtpSustainabilityPageResolved> {
  const raw = await client
    .fetch<RawSustainability | null>(sustainabilityQuery)
    .catch(() => null);
  return mergeGtpSustainabilityPage(raw);
}
