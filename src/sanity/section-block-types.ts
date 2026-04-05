/**
 * Shapes of section object blocks from GROQ (aligned with studio/schemaTypes/objects/*).
 * Extend as new `section*` types are added.
 */

export type SectionStatItem = {
  _type: "sectionStatItem";
  _key?: string;
  value?: string;
  label?: string;
};

export type SectionStatsRowBlock = {
  _type: "sectionStatsRow";
  _key?: string;
  enabled?: boolean;
  variant?: "blue-band" | "light-green";
  items?: SectionStatItem[];
};

export type SectionRichTextBlock = {
  _type: "sectionRichText";
  _key?: string;
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  body?: string;
};

export type SectionCtaLink = {
  _type: "sectionCtaLink";
  _key?: string;
  label?: string;
  href?: string;
  openInNewTab?: boolean;
  /** Default / missing: primary SCPH button with magnetic hover. */
  style?: "primary" | "outline";
};

export type SectionProseCtaBlock = {
  _type: "sectionProseCta";
  _key?: string;
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  body?: string;
  background?: "default" | "muted";
  constrainProse?: boolean;
  actionsInsideProse?: boolean;
  ctas?: SectionCtaLink[];
};

export type SectionBlock =
  | SectionStatsRowBlock
  | SectionRichTextBlock
  | SectionProseCtaBlock;

export function isSectionBlock(value: unknown): value is SectionBlock {
  if (!value || typeof value !== "object" || !("_type" in value)) return false;
  const t = (value as { _type: string })._type;
  return (
    t === "sectionStatsRow" ||
    t === "sectionRichText" ||
    t === "sectionProseCta"
  );
}

/** True if at least one block would render non-null UI (mirrors RenderSectionBlock rules). */
export function sectionBlocksMayRender(blocks: unknown): boolean {
  if (!Array.isArray(blocks)) return false;
  for (const raw of blocks) {
    if (!isSectionBlock(raw) || raw.enabled === false) continue;
    switch (raw._type) {
      case "sectionStatsRow": {
        const items = raw.items?.filter((i) => i.value && i.label) ?? [];
        if (items.length > 0) return true;
        break;
      }
      case "sectionRichText": {
        if (
          raw.eyebrow?.trim() ||
          raw.heading?.trim() ||
          raw.body?.trim()
        ) {
          return true;
        }
        break;
      }
      case "sectionProseCta": {
        const hasCtas =
          raw.ctas?.some((c) => c.label?.trim() && c.href?.trim()) ?? false;
        if (
          raw.title?.trim() ||
          raw.body?.trim() ||
          hasCtas
        ) {
          return true;
        }
        break;
      }
    }
  }
  return false;
}
