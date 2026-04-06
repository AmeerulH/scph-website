import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  Landmark,
  Megaphone,
  ShieldAlert,
  Target,
  Thermometer,
  Users,
  Wheat,
} from "lucide-react";
import {
  SCPH_ABOUT_FOUNDATION_DEFAULTS,
  SCPH_ABOUT_JOURNEY_DEFAULTS,
  SCPH_ABOUT_STRATEGY_DEFAULTS,
  SCPH_NETWORK_COMMUNITY_DEFAULTS,
  SCPH_RESEARCH_PILLARS_DEFAULT,
  SCPH_RESEARCH_PILLARS_SECTION_DEFAULTS,
  SCPH_RESEARCH_ROADMAP_DEFAULT,
  SCPH_RESEARCH_STATS_DEFAULT,
  type ScphAboutStrategyCardSeed,
  type ScphResearchPillarSeed,
} from "@/data/scph-page-bands-defaults";
import type {
  SectionBlock,
  SectionCtaLink,
  SectionProseCtaBlock,
  SectionStatItem,
  SectionStatsRowBlock,
} from "@/sanity/section-block-types";
import type {
  ScphWhiteLinkCardItem,
  ScphWhitePillarCardItem,
} from "@/components/sections/icon-card-grid";

function pickStr(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function splitParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function sanityImageAssetUrl(
  img: { assetUrl?: string | null } | null | undefined,
): string | null {
  const u = img?.assetUrl;
  return typeof u === "string" && u.trim() ? u.trim() : null;
}

const STRATEGY_ICONS: Record<ScphAboutStrategyCardSeed["iconKey"], LucideIcon> =
  {
    target: Target,
    "arrow-right": ArrowRight,
    "book-open": BookOpen,
    users: Users,
  };

const PILLAR_ICONS: Record<ScphResearchPillarSeed["iconKey"], LucideIcon> = {
  "shield-alert": ShieldAlert,
  thermometer: Thermometer,
  building2: Building2,
  wheat: Wheat,
  megaphone: Megaphone,
  landmark: Landmark,
  "graduation-cap": GraduationCap,
};

function isStrategyIconKey(k: string): k is ScphAboutStrategyCardSeed["iconKey"] {
  return k in STRATEGY_ICONS;
}

function isPillarIconKey(k: string): k is ScphResearchPillarSeed["iconKey"] {
  return k in PILLAR_ICONS;
}

// ─── About (raw CMS from GROQ) ───────────────────────────────────────────────

export type ScphAboutFoundationImageCms = {
  alt?: string | null;
  caption?: string | null;
  assetUrl?: string | null;
} | null;

export type ScphAboutFoundationCms = {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  image1?: ScphAboutFoundationImageCms;
  image2?: ScphAboutFoundationImageCms;
};

export type ScphAboutStrategyCardCms = {
  iconKey?: string | null;
  title?: string | null;
  description?: string | null;
  href?: string | null;
};

export type ScphAboutStrategyCms = {
  sectionSubtitle?: string | null;
  sectionTitle?: string | null;
  introBody?: string | null;
  cards?: ScphAboutStrategyCardCms[] | null;
};

export type ScphAboutJourneyCms = {
  sectionSubtitle?: string | null;
  sectionTitle?: string | null;
  placeholderTitle?: string | null;
  placeholderBody?: string | null;
};

export type ScphAboutPageBandsCms = {
  foundation?: ScphAboutFoundationCms | null;
  strategy?: ScphAboutStrategyCms | null;
  journey?: ScphAboutJourneyCms | null;
  sections?: SectionBlock[] | null;
};

export type MergedAboutFoundation = ReturnType<typeof mergeAboutFoundation>;

export function mergeAboutFoundation(cms: ScphAboutFoundationCms | null | undefined) {
  const d = SCPH_ABOUT_FOUNDATION_DEFAULTS;
  if (!cms) {
    return {
      eyebrow: d.eyebrow,
      heading: d.heading,
      body: d.body,
      image1Url: d.image1FallbackSrc,
      image1Alt: d.image1Alt,
      image1Caption: d.image1Caption,
      image2Url: d.image2FallbackSrc,
      image2Alt: d.image2Alt,
      image2Caption: d.image2Caption,
    };
  }
  const url1 = sanityImageAssetUrl(cms.image1 ?? undefined);
  const url2 = sanityImageAssetUrl(cms.image2 ?? undefined);
  return {
    eyebrow: pickStr(cms.eyebrow, d.eyebrow),
    heading: pickStr(cms.heading, d.heading),
    body: pickStr(cms.body, d.body),
    image1Url: url1,
    image1Alt: pickStr(cms.image1?.alt, d.image1Alt),
    image1Caption: pickStr(cms.image1?.caption, d.image1Caption),
    image2Url: url2,
    image2Alt: pickStr(cms.image2?.alt, d.image2Alt),
    image2Caption: pickStr(cms.image2?.caption, d.image2Caption),
  };
}

export function mergeAboutStrategyCards(
  cmsCards: ScphAboutStrategyCardCms[] | null | undefined,
): ScphWhiteLinkCardItem[] {
  const defaults = SCPH_ABOUT_STRATEGY_DEFAULTS.cards;
  if (!cmsCards?.length) {
    return defaults.map((c) => ({
      id: c.id,
      icon: STRATEGY_ICONS[c.iconKey],
      title: c.title,
      description: c.description,
      href: c.href,
    }));
  }
  return cmsCards.map((c, i) => {
    const fb = defaults[i] ?? defaults[defaults.length - 1]!;
    const key = pickStr(c.iconKey, fb.iconKey);
    const icon = isStrategyIconKey(key) ? STRATEGY_ICONS[key] : STRATEGY_ICONS[fb.iconKey];
    const title = pickStr(c.title, fb.title);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return {
      id: fb.id && i < defaults.length ? fb.id : slug || `card-${i}`,
      icon,
      title,
      description: pickStr(c.description, fb.description),
      href: pickStr(c.href, fb.href),
    };
  });
}

export function mergeAboutStrategy(cms: ScphAboutStrategyCms | null | undefined) {
  const d = SCPH_ABOUT_STRATEGY_DEFAULTS;
  if (!cms) {
    return {
      sectionSubtitle: d.sectionSubtitle,
      sectionTitle: d.sectionTitle,
      introBody: d.introBody,
      cards: mergeAboutStrategyCards(undefined),
    };
  }
  return {
    sectionSubtitle: pickStr(cms.sectionSubtitle, d.sectionSubtitle),
    sectionTitle: pickStr(cms.sectionTitle, d.sectionTitle),
    introBody: pickStr(cms.introBody, d.introBody),
    cards: mergeAboutStrategyCards(cms.cards ?? undefined),
  };
}

export function mergeAboutJourney(cms: ScphAboutJourneyCms | null | undefined) {
  const d = SCPH_ABOUT_JOURNEY_DEFAULTS;
  if (!cms) return { ...d };
  return {
    sectionSubtitle: pickStr(cms.sectionSubtitle, d.sectionSubtitle),
    sectionTitle: pickStr(cms.sectionTitle, d.sectionTitle),
    placeholderTitle: pickStr(cms.placeholderTitle, d.placeholderTitle),
    placeholderBody: pickStr(cms.placeholderBody, d.placeholderBody),
  };
}

export function mergeScphAboutPageBands(cms: ScphAboutPageBandsCms | null) {
  return {
    foundation: mergeAboutFoundation(cms?.foundation),
    strategy: mergeAboutStrategy(cms?.strategy),
    journey: mergeAboutJourney(cms?.journey),
    sections: cms?.sections ?? [],
  };
}

export { splitParagraphs };

// ─── Research ───────────────────────────────────────────────────────────────

export type ScphResearchPillarCms = {
  iconKey?: string | null;
  num?: string | null;
  title?: string | null;
  description?: string | null;
};

export type ScphResearchPageBandsCms = {
  statsRow?: SectionStatsRowBlock | null;
  roadmapBlock?: SectionProseCtaBlock | null;
  pillarsSectionSubtitle?: string | null;
  pillarsSectionTitle?: string | null;
  pillars?: ScphResearchPillarCms[] | null;
  sections?: SectionBlock[] | null;
};

function mergeStatItems(
  cms: SectionStatItem[] | null | undefined,
  fallback: SectionStatItem[],
): SectionStatItem[] {
  return fallback.map((fb, i) => {
    const item = cms?.[i];
    if (!item) return {...fb, _type: "sectionStatItem" as const};
    return {
      _type: "sectionStatItem" as const,
      value: pickStr(item.value, fb.value ?? ""),
      label: pickStr(item.label, fb.label ?? ""),
    };
  });
}

export function mergeResearchStatsRow(
  cms: SectionStatsRowBlock | null | undefined,
): SectionStatsRowBlock {
  const d = SCPH_RESEARCH_STATS_DEFAULT;
  if (!cms) {
    return {...d, items: [...(d.items ?? [])]};
  }
  const variant =
    cms.variant === "light-green" || cms.variant === "blue-band"
      ? cms.variant
      : d.variant;
  return {
    _type: "sectionStatsRow",
    enabled: cms.enabled !== false,
    variant,
    items: mergeStatItems(cms.items, d.items ?? []),
  };
}

export function mergeResearchRoadmap(
  cms: SectionProseCtaBlock | null | undefined,
): SectionProseCtaBlock {
  const d = SCPH_RESEARCH_ROADMAP_DEFAULT;
  if (!cms) {
    return {
      ...d,
      ctas: d.ctas?.map((c) => ({...c})) ?? [],
    };
  }
  const ctasCms = cms.ctas?.length ? cms.ctas : d.ctas;
  const mergedCtas =
    ctasCms?.map((c, i) => {
      const fb = d.ctas?.[i] ?? d.ctas?.[d.ctas.length - 1]!;
      const style: NonNullable<SectionCtaLink["style"]> =
        c.style === "outline" ? "outline" : "primary";
      return {
        _type: "sectionCtaLink" as const,
        label: pickStr(c.label, fb?.label ?? ""),
        href: pickStr(c.href, fb?.href ?? "#"),
        openInNewTab: c.openInNewTab ?? fb?.openInNewTab ?? true,
        style,
      };
    }) ?? [];

  return {
    _type: "sectionProseCta",
    enabled: cms.enabled !== false,
    title: pickStr(cms.title, d.title ?? ""),
    subtitle: pickStr(cms.subtitle, d.subtitle ?? ""),
    body: pickStr(cms.body, d.body ?? ""),
    background: cms.background === "muted" ? "muted" : "default",
    constrainProse: cms.constrainProse !== false,
    actionsInsideProse: cms.actionsInsideProse === true,
    ctas: mergedCtas,
  };
}

export function mergeResearchPillars(
  cms: ScphResearchPillarCms[] | null | undefined,
): ScphWhitePillarCardItem[] {
  const defaults = SCPH_RESEARCH_PILLARS_DEFAULT;
  if (!cms?.length) {
    return defaults.map((p) => ({
      id: p.id,
      num: p.num,
      icon: PILLAR_ICONS[p.iconKey],
      title: p.title,
      description: p.description,
    }));
  }
  return cms.map((c, i) => {
    const fb = defaults[i] ?? defaults[defaults.length - 1]!;
    const key = pickStr(c.iconKey, fb.iconKey);
    const icon = isPillarIconKey(key) ? PILLAR_ICONS[key] : PILLAR_ICONS[fb.iconKey];
    const num = pickStr(c.num, fb.num);
    return {
      id: num || fb.id,
      num,
      icon,
      title: pickStr(c.title, fb.title),
      description: pickStr(c.description, fb.description),
    };
  });
}

export function mergeScphResearchPageBands(cms: ScphResearchPageBandsCms | null) {
  const sec = SCPH_RESEARCH_PILLARS_SECTION_DEFAULTS;
  return {
    statsRow: mergeResearchStatsRow(cms?.statsRow),
    roadmapBlock: mergeResearchRoadmap(cms?.roadmapBlock),
    pillarsSectionSubtitle: pickStr(
      cms?.pillarsSectionSubtitle,
      sec.pillarsSectionSubtitle,
    ),
    pillarsSectionTitle: pickStr(
      cms?.pillarsSectionTitle,
      sec.pillarsSectionTitle,
    ),
    pillars: mergeResearchPillars(cms?.pillars ?? undefined),
    sections: cms?.sections ?? [],
  };
}

// ─── Network ─────────────────────────────────────────────────────────────────

export type ScphNetworkCommunityCms = {
  copyEyebrow?: string | null;
  copyTitle?: string | null;
  copyBody?: string | null;
  benefitsEyebrow?: string | null;
  benefitsTitle?: string | null;
  benefitItems?: (string | null)[] | null;
};

export type ScphNetworkPageBandsCms = {
  community?: ScphNetworkCommunityCms | null;
  sections?: SectionBlock[] | null;
};

export function mergeScphNetworkCommunity(
  cms: ScphNetworkCommunityCms | null | undefined,
) {
  const d = SCPH_NETWORK_COMMUNITY_DEFAULTS;
  if (!cms) return {...d, benefitItems: [...d.benefitItems]};
  const items =
    cms.benefitItems?.filter(
      (x): x is string => typeof x === "string" && x.trim().length > 0,
    ) ?? [];
  return {
    copyEyebrow: pickStr(cms.copyEyebrow, d.copyEyebrow),
    copyTitle: pickStr(cms.copyTitle, d.copyTitle),
    copyBody: pickStr(cms.copyBody, d.copyBody),
    benefitsEyebrow: pickStr(cms.benefitsEyebrow, d.benefitsEyebrow),
    benefitsTitle: pickStr(cms.benefitsTitle, d.benefitsTitle),
    benefitItems: items.length ? items : [...d.benefitItems],
  };
}

export function mergeScphNetworkPageBands(cms: ScphNetworkPageBandsCms | null) {
  return {
    community: mergeScphNetworkCommunity(cms?.community),
    sections: cms?.sections ?? [],
  };
}
