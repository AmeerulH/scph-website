import { cache } from "react";
import { groq } from "next-sanity";
import {
  gtpFooterDefaults,
  GTP_FOOTER_BANNER_STATIC,
} from "@/data/gtp-footer-defaults";
import {
  scphFooterDefaults,
  SCPH_FOOTER_BOTTOM_LOGO_DEFAULT,
  SCPH_FOOTER_LOGO_DEFAULT,
} from "@/data/scph-footer-defaults";
import { footerSocialIconSrc } from "@/lib/footer-social-icons";
import { client } from "@/sanity/client";
import type {
  FooterLinkColumnResolved,
  FooterNavLinkResolved,
  FooterSocialResolved,
  GtpFooterBannerResolved,
  GtpFooterContactRowResolved,
  GtpFooterResolved,
  ScphFooterResolved,
} from "@/sanity/footer-types";

const imageProjection = groq`{
  alt,
  asset->{
    url,
    metadata { dimensions { width, height } }
  }
}`;

const scphFooterQuery = groq`*[_type == "scphFooter"][0]{
  tagline,
  logo ${imageProjection},
  socialLinks[]{ label, href, iconKey },
  columnQuickLinks,
  columnCommunity,
  columnConferences,
  contactEmail,
  address,
  phoneDisplay,
  phoneTel,
  careerEmail,
  copyrightLine,
  partOfLabel,
  bottomLogo ${imageProjection}
}`;

const gtp2026FooterQuery = groq`*[_type == "gtp2026Footer"][0]{
  bannerLogosImage ${imageProjection},
  quickLinks[]{ label, href, openInNewTab },
  contactRows[]{ rowType, text, url },
  socialLinks[]{ label, href, iconKey },
  copyrightLine,
  hostedByPrefix,
  hostedByLabel,
  hostedByUrl
}`;

type SanityImageFrag = {
  alt?: string | null;
  asset?: {
    url?: string | null;
    metadata?: {
      dimensions?: { width?: number | null; height?: number | null } | null;
    } | null;
  } | null;
} | null;

type FooterNavLinkCms = {
  label?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
} | null;

type FooterLinkColumnCms = {
  title?: string | null;
  links?: FooterNavLinkCms[] | null;
} | null;

type FooterSocialLinkCms = {
  label?: string | null;
  href?: string | null;
  iconKey?: string | null;
} | null;

export type ScphFooterCms = {
  tagline?: string | null;
  logo?: SanityImageFrag;
  socialLinks?: FooterSocialLinkCms[] | null;
  columnQuickLinks?: FooterLinkColumnCms | null;
  columnCommunity?: FooterLinkColumnCms | null;
  columnConferences?: FooterLinkColumnCms | null;
  contactEmail?: string | null;
  address?: string | null;
  phoneDisplay?: string | null;
  phoneTel?: string | null;
  careerEmail?: string | null;
  copyrightLine?: string | null;
  partOfLabel?: string | null;
  bottomLogo?: SanityImageFrag;
} | null;

type Gtp2026FooterCmsRow = {
  rowType?: string | null;
  text?: string | null;
  url?: string | null;
};

export type Gtp2026FooterCms = {
  bannerLogosImage?: SanityImageFrag;
  quickLinks?: FooterNavLinkCms[] | null;
  contactRows?: Gtp2026FooterCmsRow[] | null;
  socialLinks?: FooterSocialLinkCms[] | null;
  copyrightLine?: string | null;
  hostedByPrefix?: string | null;
  hostedByLabel?: string | null;
  hostedByUrl?: string | null;
} | null;

function nonEmpty(s: string | null | undefined): string | undefined {
  const t = typeof s === "string" ? s.trim() : "";
  return t ? t : undefined;
}

function parseNavLink(raw: FooterNavLinkCms): FooterNavLinkResolved | null {
  if (!raw || typeof raw !== "object") return null;
  const label = nonEmpty(raw.label);
  const href = nonEmpty(raw.href);
  if (!label || !href) return null;
  return {
    label,
    href,
    openInNewTab: Boolean(raw.openInNewTab),
  };
}

function normalizeNavLinks(
  raw: FooterNavLinkCms[] | null | undefined,
): FooterNavLinkResolved[] {
  if (!Array.isArray(raw)) return [];
  const out: FooterNavLinkResolved[] = [];
  for (const item of raw) {
    const parsed = parseNavLink(item);
    if (parsed) out.push(parsed);
  }
  return out;
}

function mergeLinkColumn(
  cms: FooterLinkColumnCms | null | undefined,
  def: FooterLinkColumnResolved,
): FooterLinkColumnResolved {
  const links = normalizeNavLinks(cms?.links ?? undefined);
  if (links.length === 0) return def;
  const title = nonEmpty(cms?.title) ?? def.title;
  return { title, links };
}

function normalizeSocialLinks(
  raw: FooterSocialLinkCms[] | null | undefined,
): FooterSocialResolved[] {
  if (!Array.isArray(raw)) return [];
  const out: FooterSocialResolved[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const label = nonEmpty(item.label);
    const href = nonEmpty(item.href);
    const iconKey = nonEmpty(item.iconKey);
    if (!label || !href || !iconKey) continue;
    out.push({
      label,
      href,
      iconSrc: footerSocialIconSrc(iconKey),
    });
  }
  return out;
}

function mergeSocial(
  cms: FooterSocialLinkCms[] | null | undefined,
  def: FooterSocialResolved[],
): FooterSocialResolved[] {
  const n = normalizeSocialLinks(cms);
  return n.length > 0 ? n : def;
}

function sanityImageToResolved(
  frag: SanityImageFrag,
  fallback: { src: string; alt: string; width?: number; height?: number },
): { src: string; alt: string; width?: number; height?: number } {
  const url = frag?.asset?.url?.trim();
  const alt = nonEmpty(frag?.alt);
  if (url && alt) {
    const w = frag?.asset?.metadata?.dimensions?.width ?? undefined;
    const h = frag?.asset?.metadata?.dimensions?.height ?? undefined;
    return {
      src: url,
      alt,
      width: w ?? undefined,
      height: h ?? undefined,
    };
  }
  return { ...fallback };
}

function mergeBanner(
  cms: SanityImageFrag,
  def: Extract<GtpFooterBannerResolved, { source: "static" }>,
): GtpFooterBannerResolved {
  const url = cms?.asset?.url?.trim();
  const alt = nonEmpty(cms?.alt);
  if (url && alt) {
    const w = cms?.asset?.metadata?.dimensions?.width ?? undefined;
    const h = cms?.asset?.metadata?.dimensions?.height ?? undefined;
    return {
      source: "sanity",
      url,
      alt,
      width: w ?? undefined,
      height: h ?? undefined,
    };
  }
  return { ...def };
}

function normalizeGtpContactRows(
  raw: Gtp2026FooterCmsRow[] | null | undefined,
): GtpFooterContactRowResolved[] {
  if (!Array.isArray(raw)) return [];
  const out: GtpFooterContactRowResolved[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const text = nonEmpty(row.text);
    if (!text) continue;
    const rt = row.rowType;
    if (rt === "email") {
      out.push({ rowType: "email", text });
    } else if (rt === "sitePlain") {
      out.push({ rowType: "sitePlain", text });
    } else if (rt === "externalLink") {
      const url = nonEmpty(row.url);
      if (url) out.push({ rowType: "externalLink", text, url });
    }
  }
  return out;
}

export function mergeScphFooter(cms: ScphFooterCms): ScphFooterResolved {
  const d = scphFooterDefaults;
  return {
    tagline: nonEmpty(cms?.tagline) ?? d.tagline,
    logo: sanityImageToResolved(cms?.logo ?? null, {
      src: SCPH_FOOTER_LOGO_DEFAULT.src,
      alt: SCPH_FOOTER_LOGO_DEFAULT.alt,
      width: SCPH_FOOTER_LOGO_DEFAULT.width,
      height: SCPH_FOOTER_LOGO_DEFAULT.height,
    }),
    bottomLogo: sanityImageToResolved(cms?.bottomLogo ?? null, {
      src: SCPH_FOOTER_BOTTOM_LOGO_DEFAULT.src,
      alt: SCPH_FOOTER_BOTTOM_LOGO_DEFAULT.alt,
      width: SCPH_FOOTER_BOTTOM_LOGO_DEFAULT.width,
      height: SCPH_FOOTER_BOTTOM_LOGO_DEFAULT.height,
    }),
    socialLinks: mergeSocial(cms?.socialLinks ?? undefined, d.socialLinks),
    columnQuick: mergeLinkColumn(cms?.columnQuickLinks, d.columnQuick),
    columnCommunity: mergeLinkColumn(cms?.columnCommunity, d.columnCommunity),
    columnConferences: mergeLinkColumn(
      cms?.columnConferences,
      d.columnConferences,
    ),
    contactEmail: nonEmpty(cms?.contactEmail) ?? d.contactEmail,
    address: nonEmpty(cms?.address) ?? d.address,
    phoneDisplay: nonEmpty(cms?.phoneDisplay) ?? d.phoneDisplay,
    phoneTel: nonEmpty(cms?.phoneTel) ?? d.phoneTel,
    careerEmail: nonEmpty(cms?.careerEmail) ?? d.careerEmail,
    copyrightLine: nonEmpty(cms?.copyrightLine) ?? d.copyrightLine,
    partOfLabel: nonEmpty(cms?.partOfLabel) ?? d.partOfLabel,
  };
}

export function mergeGtpFooter(cms: Gtp2026FooterCms): GtpFooterResolved {
  const d = gtpFooterDefaults;

  const quick = normalizeNavLinks(cms?.quickLinks ?? undefined);
  const contactRowsFromCms = normalizeGtpContactRows(cms?.contactRows);

  return {
    banner: mergeBanner(
      cms?.bannerLogosImage ?? null,
      GTP_FOOTER_BANNER_STATIC,
    ),
    quickLinks: quick.length > 0 ? quick : [...d.quickLinks],
    contactRows:
      contactRowsFromCms.length > 0 ? contactRowsFromCms : [...d.contactRows],
    socialLinks: mergeSocial(cms?.socialLinks ?? undefined, d.socialLinks),
    copyrightLine: nonEmpty(cms?.copyrightLine) ?? d.copyrightLine,
    hostedByPrefix: nonEmpty(cms?.hostedByPrefix) ?? d.hostedByPrefix,
    hostedByLabel: nonEmpty(cms?.hostedByLabel) ?? d.hostedByLabel,
    hostedByUrl: nonEmpty(cms?.hostedByUrl) ?? d.hostedByUrl,
  };
}

export async function getMergedScphFooter(): Promise<ScphFooterResolved> {
  try {
    const cms = await client.fetch<ScphFooterCms>(scphFooterQuery);
    return mergeScphFooter(cms);
  } catch {
    return mergeScphFooter(null);
  }
}

/** One fetch + merge per request when layout and pages both need footer data. */
export const getMergedGtpFooter = cache(async function getMergedGtpFooter(): Promise<GtpFooterResolved> {
  try {
    const cms = await client.fetch<Gtp2026FooterCms>(gtp2026FooterQuery);
    return mergeGtpFooter(cms);
  } catch {
    return mergeGtpFooter(null);
  }
});
