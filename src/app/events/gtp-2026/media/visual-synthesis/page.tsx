import type { Metadata } from "next";
import { VisualSynthesisView } from "@/components/gtp/media/synthesis/visual-synthesis-view";
import { GTP_VISUAL_SYNTHESIS_PATH } from "@/data/gtp-visual-synthesis-defaults";
import { getGtpVisualSynthesis, resolveActiveDay } from "@/sanity/gtp-visual-synthesis";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ day?: string | string[] }> };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const description =
  "Visual maps of the Global Tipping Points Conference 2026 plenaries, created by Ole Qvist-Sørensen of Bigger Picture as co-facilitator and visual sense-maker.";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [data, params] = await Promise.all([getGtpVisualSynthesis(), searchParams]);
  const day = resolveActiveDay(data.maps, first(params.day));
  const lead = data.maps.find((m) => m.day === day);

  return {
    title: data.title,
    description,
    alternates: { canonical: GTP_VISUAL_SYNTHESIS_PATH },
    openGraph: {
      title: `${data.title} | GTP 2026`,
      description,
      url: GTP_VISUAL_SYNTHESIS_PATH,
      ...(lead
        ? { images: [{ url: lead.image.src, width: lead.image.width, height: lead.image.height, alt: lead.image.alt }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | GTP 2026`,
      description,
      ...(lead ? { images: [lead.image.src] } : {}),
    },
  };
}

export default async function GtpVisualSynthesisPage({ searchParams }: Props) {
  const [data, params] = await Promise.all([getGtpVisualSynthesis(), searchParams]);
  const activeDayId = resolveActiveDay(data.maps, first(params.day));

  return <VisualSynthesisView data={data} activeDayId={activeDayId} basePath={GTP_VISUAL_SYNTHESIS_PATH} />;
}
