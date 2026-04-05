import Link from "next/link";
import { StatsRow } from "@/components/sections/stats-row";
import type {
  SectionBlock,
  SectionProseCtaBlock,
  SectionRichTextBlock,
  SectionStatsRowBlock,
} from "@/sanity/section-block-types";

function SectionStatsRowFromCms({ block }: { block: SectionStatsRowBlock }) {
  const variant = block.variant === "light-green" ? "light-green" : "blue-band";
  const items =
    block.items
      ?.filter((i) => i.value && i.label)
      .map((i) => ({ value: i.value!, label: i.label! })) ?? [];
  if (items.length === 0) return null;
  return <StatsRow items={items} variant={variant} />;
}

function SectionRichTextFromCms({ block }: { block: SectionRichTextBlock }) {
  return (
    <section className="py-8">
      {block.eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {block.eyebrow}
        </p>
      )}
      {block.heading && (
        <h2 className="font-heading text-2xl font-bold text-gray-900">
          {block.heading}
        </h2>
      )}
      {block.body && (
        <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-gray-600">
          {block.body}
        </p>
      )}
    </section>
  );
}

function SectionProseCtaFromCms({ block }: { block: SectionProseCtaBlock }) {
  return (
    <section className="py-8">
      {block.subtitle && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {block.subtitle}
        </p>
      )}
      {block.title && (
        <h2 className="font-heading text-2xl font-bold text-gray-900">
          {block.title}
        </h2>
      )}
      {block.body && (
        <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-gray-600">
          {block.body}
        </p>
      )}
      {block.ctas && block.ctas.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-4">
          {block.ctas.map((cta) => {
            if (!cta.label || !cta.href) return null;
            const external = cta.openInNewTab || /^https?:\/\//i.test(cta.href);
            return (
              <li key={cta._key}>
                {external ? (
                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-scph-blue underline hover:text-scph-dark-green"
                  >
                    {cta.label}
                  </a>
                ) : (
                  <Link
                    href={cta.href}
                    className="font-semibold text-scph-blue underline hover:text-scph-dark-green"
                  >
                    {cta.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/**
 * Maps one Sanity section object (`section*`) to UI. Skip when `enabled === false`.
 * Stage 0: wired for stats row + simple prose blocks; expand in later stages.
 */
export function RenderSectionBlock({ block }: { block: SectionBlock }) {
  if (block.enabled === false) return null;

  switch (block._type) {
    case "sectionStatsRow":
      return <SectionStatsRowFromCms block={block} />;
    case "sectionRichText":
      return <SectionRichTextFromCms block={block} />;
    case "sectionProseCta":
      return <SectionProseCtaFromCms block={block} />;
    default:
      return null;
  }
}

export function RenderSectionBlocks({ blocks }: { blocks: unknown }) {
  if (!Array.isArray(blocks)) return null;
  return (
    <>
      {blocks.map((raw, index) => {
        if (!raw || typeof raw !== "object" || !("_type" in raw)) return null;
        const b = raw as SectionBlock;
        const t = b._type;
        if (
          t !== "sectionStatsRow" &&
          t !== "sectionRichText" &&
          t !== "sectionProseCta"
        ) {
          return null;
        }
        const key =
          typeof (raw as { _key?: string })._key === "string"
            ? (raw as { _key: string })._key
            : `section-${index}`;
        return <RenderSectionBlock key={key} block={b} />;
      })}
    </>
  );
}
