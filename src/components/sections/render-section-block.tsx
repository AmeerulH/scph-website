import Link from "next/link";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SectionProseCta } from "@/components/sections/section-prose-cta";
import { StatsRow } from "@/components/sections/stats-row";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  SectionBlock,
  SectionProseCtaBlock,
  SectionRichTextBlock,
  SectionStatsRowBlock,
} from "@/sanity/section-block-types";

export function SectionStatsRowFromCms({ block }: { block: SectionStatsRowBlock }) {
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

function proseBodyNodes(body: string, constrainProse: boolean) {
  const parts = body
    .split(/\n\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  if (!constrainProse && parts.length === 1) {
    return (
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-gray-600">
        {parts[0]}
      </p>
    );
  }
  return (
    <>
      {parts.map((text, i) => (
        <p
          key={i}
          className={cn(
            "text-base leading-relaxed text-gray-600",
            i > 0 && "mt-4",
          )}
        >
          {text}
        </p>
      ))}
    </>
  );
}

export function SectionProseCtaFromCms({
  block,
  scrollProgress = false,
}: {
  block: SectionProseCtaBlock;
  scrollProgress?: boolean;
}) {
  const background = block.background === "muted" ? "muted" : "default";
  const constrainProse = block.constrainProse !== false;
  const actionsInsideProse = block.actionsInsideProse === true;
  const proseNodes = block.body?.trim()
    ? proseBodyNodes(block.body, constrainProse)
    : null;

  const actions =
    block.ctas && block.ctas.length > 0 ? (
      <>
        {block.ctas.map((cta, i) => {
          if (!cta.label || !cta.href) return null;
          const external =
            cta.openInNewTab || /^https?:\/\//i.test(cta.href);
          const isOutline = cta.style === "outline";
          const child = external ? (
            <a href={cta.href} target="_blank" rel="noopener noreferrer">
              {cta.label}
            </a>
          ) : (
            <Link href={cta.href}>{cta.label}</Link>
          );
          const btn = (
            <Button variant={isOutline ? "outline" : "scph"} asChild>
              {child}
            </Button>
          );
          const key = cta._key ?? `cta-${i}`;
          if (!isOutline) {
            return <MagneticButton key={key}>{btn}</MagneticButton>;
          }
          return <span key={key}>{btn}</span>;
        })}
      </>
    ) : undefined;

  return (
    <SectionProseCta
      title={block.title}
      subtitle={block.subtitle}
      theme="scph"
      background={background}
      scrollProgress={scrollProgress}
      constrainProse={constrainProse}
      actionsInsideProse={actionsInsideProse}
      prose={proseNodes ?? <></>}
      actions={actions}
    />
  );
}

/**
 * Maps one Sanity section object (`section*`) to UI. Skip when `enabled === false`.
 * Prose+CTA blocks use SectionProseCta (home-style layout options from CMS).
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
