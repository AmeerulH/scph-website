import { notFound } from "next/navigation";
import { VisualSynthesisView } from "@/components/gtp/media/synthesis/visual-synthesis-view";
import {
  GTP_SYNTHESIS_DAYS,
  type GtpSynthesisDayId,
  type GtpSynthesisImage,
  type GtpSynthesisMap,
} from "@/data/gtp-visual-synthesis-defaults";
import { mergeGtpVisualSynthesis, resolveActiveDay } from "@/sanity/gtp-visual-synthesis";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    day?: string;
    empty?: string;
    many?: string;
    headshot?: string;
    after?: string;
    worst?: string;
  }>;
};

const BASE_PATH = "/dev/visual-synthesis-review";

const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/** Synthetic 16:9 test card in the shape and frame style of the team's blank template. Not real artwork. */
function fixtureImage(title: string): GtpSynthesisImage {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" font-family="sans-serif">
<rect x="6" y="6" width="1588" height="888" rx="22" fill="#fffdfb" stroke="#f59e3a" stroke-width="8"/>
<text x="64" y="104" font-size="52" font-weight="700" fill="#2a2a2a">${title}</text>
<g fill="#fde3cb"><circle cx="420" cy="420" r="190"/><circle cx="800" cy="420" r="190"/><circle cx="1180" cy="420" r="190"/>
<rect x="150" y="660" width="1160" height="110" rx="55"/><path d="M1320 640h200l-90 160z"/><path d="M160 190h260l-130 150z"/></g>
<g font-size="24" fill="#3a3a3a"><text x="330" y="330">Opening</text><text x="720" y="330">Middle</text><text x="1090" y="330">Landing</text>
<text x="200" y="722">Test fixture: small label text to check legibility at phone widths</text></g>
</svg>`;
  return { src: svgUri(svg), alt: `${title}: synthetic test card, not real artwork`, width: 1600, height: 900 };
}

function headshotImage(): GtpSynthesisImage {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750"><rect width="600" height="750" fill="#c9d6da"/><circle cx="300" cy="290" r="120" fill="#8fa5ac"/><rect x="130" y="450" width="340" height="300" rx="150" fill="#8fa5ac"/><text x="300" y="715" font-size="30" text-anchor="middle" font-family="sans-serif" fill="#2a3a40">Test headshot</text></svg>`;
  return { src: svgUri(svg), alt: "Synthetic test headshot, not a real photo", width: 600, height: 750 };
}

function fixtureMaps(days: GtpSynthesisDayId[], perDay: number): GtpSynthesisMap[] {
  return days.flatMap((day) =>
    Array.from({ length: perDay }, (_, i) => {
      const title = day === "final" ? "Final synthesis test card" : `Day ${day} plenary ${i + 1} test card`;
      return {
        id: `${day}-${i}`,
        day,
        title,
        timeLabel: day === "final" ? undefined : `${9 + i * 2}:00 to ${10 + i * 2}:00`,
        summary:
          "Synthetic summary for layout review. The real summary is one to three sentences describing what this plenary's map shows or concluded.",
        image: fixtureImage(title),
      };
    }),
  );
}

export default async function VisualSynthesisReviewPage({ searchParams }: Props) {
  if (process.env.NODE_ENV !== "development" || process.env.GTP_SYNTHESIS_REVIEW_MODE !== "1") notFound();
  const params = await searchParams;

  const perDay = params.many === "1" ? 6 : 3;
  let maps = params.empty === "1" ? [] : fixtureMaps(["1", "2", "final"], perDay);
  if (params.worst === "1") {
    // Worst case: very long and unbreakable titles, no summary, no time label, and a 12 map day.
    maps = fixtureMaps(["1"], 12).map((m, i) => {
      if (i === 0) {
        return {
          ...m,
          title:
            "Plenary 1: Tipping points in the Earth system, social tipping dynamics, and the governance, finance and community action needed to trigger positive change at the speed and scale required",
        };
      }
      if (i === 1) return { ...m, title: "Plenary2-Supercalifragilistic-Unbreakable-Title-Without-Any-Spaces-At-All-0123456789" };
      if (i === 2) return { ...m, summary: undefined, timeLabel: undefined };
      return m;
    });
  }
  const now = params.after === "1" ? Date.parse("2026-10-17T00:00:00+08:00") : Date.parse("2026-10-13T12:00:00+08:00");

  const base = mergeGtpVisualSynthesis(null, now);
  const data = {
    ...base,
    maps,
    contributor: params.headshot === "1" ? { ...base.contributor, headshot: headshotImage() } : base.contributor,
  };
  const activeDayId = resolveActiveDay(maps, params.day);

  return (
    <>
      <div className="bg-gtp-dark-teal px-5 py-4 text-sm leading-relaxed text-white">
        <p className="mx-auto max-w-7xl">
          Local review only. Maps, headshot and summaries are synthetic fixtures; no CMS content is read or changed. Days with
          fixtures: {GTP_SYNTHESIS_DAYS.filter((d) => maps.some((m) => m.day === d.id)).map((d) => d.label).join(", ") || "none"}.
          Options: ?day=1 to 4 or final, ?empty=1, ?many=1, ?worst=1, ?headshot=1, ?after=1.
        </p>
      </div>
      <VisualSynthesisView data={data} activeDayId={activeDayId} basePath={BASE_PATH} />
    </>
  );
}
