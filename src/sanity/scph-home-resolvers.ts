import {
  DEFAULT_SCPH_HOME_HERO,
  DEFAULT_SCPH_HOME_HIGHLIGHTED_EVENTS,
  type ScphHomeHeroCopy,
  type ScphHomeHighlightedEventItem,
} from "@/data/scph-home-hero-defaults";

export type ScphHomeHeroSanity = {
  headlinePrefix?: string | null;
  headlineAccent?: string | null;
  tagline?: string | null;
  body?: string | null;
} | null;

export type ScphHomeHighlightedEventSanity = {
  _key: string;
  label?: string | null;
  title?: string | null;
  subtitle?: string | null;
  teaser?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
};

export function resolveScphHomeHero(
  raw: ScphHomeHeroSanity | undefined,
): ScphHomeHeroCopy {
  const d = DEFAULT_SCPH_HOME_HERO;
  if (!raw) return d;
  return {
    headlinePrefix: raw.headlinePrefix?.trim() || d.headlinePrefix,
    headlineAccent: raw.headlineAccent?.trim() || d.headlineAccent,
    tagline: raw.tagline?.trim() || d.tagline,
    body: raw.body?.trim() || d.body,
  };
}

export function resolveScphHomeHighlightedEvents(
  raw: ScphHomeHighlightedEventSanity[] | null | undefined,
): ScphHomeHighlightedEventItem[] {
  if (!raw?.length) return DEFAULT_SCPH_HOME_HIGHLIGHTED_EVENTS;

  const mapped: ScphHomeHighlightedEventItem[] = [];
  for (const e of raw) {
    const href = e.href?.trim();
    const title = e.title?.trim();
    if (!href || !title) continue;
    const external =
      e.openInNewTab === true || /^https?:\/\//i.test(href);
    mapped.push({
      id: e._key || href,
      label: e.label?.trim() ?? "",
      title,
      subtitle: e.subtitle?.trim() ?? "",
      teaser: e.teaser?.trim() || undefined,
      href,
      external,
    });
  }

  return mapped.length > 0 ? mapped : DEFAULT_SCPH_HOME_HIGHLIGHTED_EVENTS;
}
