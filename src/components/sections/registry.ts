/**
 * Sanity page-builder / portable-text → section components (stub).
 *
 * When wiring CMS-driven pages, map each block `_type` to a React component
 * (often via `next/dynamic` for code-splitting). Keep keys aligned with
 * Studio schema `name` values.
 *
 * Example:
 * ```ts
 * import dynamic from "next/dynamic";
 * export const sectionRegistry = {
 *   scphPageHero: dynamic(() =>
 *     import("./heroes/scph-page-hero").then((m) => m.ScphPageHero),
 *   ),
 * } as const;
 * ```
 */

export const SECTION_BLOCK_TYPES = [
  "scphPageHero",
  "gtpForestHero",
  "statsRow",
  "sectionProseCta",
  "iconCardGrid",
  "twoColumnTextImages",
  "twoColumnCopyBenefits",
  "partnerMarquee",
  "articleCardGrid",
  "placeholderNotice",
  "gtpEventInquiryPanel",
  "gtpAboutHeroStack",
] as const;

export type SectionBlockType = (typeof SECTION_BLOCK_TYPES)[number];

/** Populate when Sanity blocks are defined; empty until then. */
export const sectionRegistry: Partial<Record<SectionBlockType, unknown>> = {};
