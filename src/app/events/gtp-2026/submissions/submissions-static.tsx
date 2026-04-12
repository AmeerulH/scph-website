import Link from "next/link";
import {
  TrendingDown,
  Lightbulb,
  Zap,
  Globe,
  Bot,
  Landmark,
  TrendingUp,
  BookOpen,
  Radio,
  Leaf,
  Activity,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { GTP_EXPLORE_VERTICAL_BG_CLASSNAMES } from "@/components/gtp/gtp-site-explore-cards";
import { IconCardGrid } from "@/components/sections/icon-card-grid";
import type { GtpSubmissionsResolvedCopy } from "@/sanity/gtp-stage2";

const PILLAR_META = [
  {
    id: "01",
    num: "01",
    icon: TrendingDown,
    bgClass: GTP_EXPLORE_VERTICAL_BG_CLASSNAMES[0],
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  },
  {
    id: "02",
    num: "02",
    icon: Lightbulb,
    bgClass: GTP_EXPLORE_VERTICAL_BG_CLASSNAMES[1],
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  },
  {
    id: "03",
    num: "03",
    icon: Zap,
    bgClass: GTP_EXPLORE_VERTICAL_BG_CLASSNAMES[2],
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  },
] as const;

const THEME_META = [
  { icon: Globe, iconBg: "bg-sky-50", iconColour: "text-sky-600" },
  { icon: Bot, iconBg: "bg-violet-50", iconColour: "text-violet-600" },
  { icon: Landmark, iconBg: "bg-amber-50", iconColour: "text-amber-600" },
  { icon: TrendingUp, iconBg: "bg-emerald-50", iconColour: "text-emerald-600" },
  { icon: BookOpen, iconBg: "bg-rose-50", iconColour: "text-rose-600" },
  { icon: Radio, iconBg: "bg-orange-50", iconColour: "text-orange-600" },
  { icon: Leaf, iconBg: "bg-green-50", iconColour: "text-green-600" },
  { icon: Activity, iconBg: "bg-red-50", iconColour: "text-red-600" },
] as const;

function PillarsSection({ copy }: { copy: GtpSubmissionsResolvedCopy }) {
  const pillarItems = copy.pillars.map((p, i) => ({
    ...PILLAR_META[i],
    title: p.title,
    body: p.body,
  }));

  return (
    <SectionWrapper
      theme="gtp"
      background="default"
      className="pt-10 pb-16 md:pt-12 md:pb-24"
    >
      <div className="mb-8 max-w-3xl">
        <Button
          variant="gtpCta"
          size="lg"
          className="w-full sm:w-auto"
          asChild
        >
          <a href="#submissions-tabs">Submit your abstract and proposal</a>
        </Button>
      </div>

      <p className="mb-8 max-w-3xl text-left text-base font-bold leading-relaxed text-gtp-dark-teal md:text-lg">
        {copy.pillarsIntroBold}
      </p>

      <p className="mb-8 max-w-3xl text-left text-base leading-relaxed text-gray-600">
        {copy.pillarsIntro}
      </p>

      <IconCardGrid
        variant="gtp-gradient-pillar"
        gridClassName="flex flex-col gap-4 pb-2 md:flex-row md:items-stretch md:gap-3"
        itemClassName="w-full min-w-0 flex-1 basis-0 md:flex-[1_1_0%]"
        items={pillarItems}
      />

      <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-gray-600 md:text-base">
        {copy.pillarsOutro}
      </p>
      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-gray-600">
        <Link
          href={copy.pillarsLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gtp-teal underline underline-offset-2 hover:text-gtp-dark-teal"
        >
          {copy.pillarsLinkLabel}
        </Link>
      </p>
    </SectionWrapper>
  );
}

function EightThemesSection({ copy }: { copy: GtpSubmissionsResolvedCopy }) {
  return (
    <SectionWrapper title={copy.themesSectionTitle} theme="gtp" background="muted">
      <p className="mb-8 max-w-3xl text-left text-base leading-relaxed text-gray-600">
        {copy.themesIntro}
      </p>
      <StaggerReveal className="grid grid-cols-1 auto-rows-[1fr] gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {copy.themes.map((theme, i) => {
          const { icon: Icon, iconBg, iconColour } = THEME_META[i];
          return (
            <div
              key={`${theme.title}-${i}`}
              className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}
              >
                <Icon className={`h-5 w-5 ${iconColour}`} />
              </div>
              <h3 className="font-heading text-sm font-bold leading-snug text-gtp-dark-teal">
                {theme.title}
              </h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500">
                {theme.body}
              </p>
            </div>
          );
        })}
      </StaggerReveal>
    </SectionWrapper>
  );
}

export function GtpSubmissionsStaticSections({
  copy,
}: {
  copy: GtpSubmissionsResolvedCopy;
}) {
  return (
    <>
      <PillarsSection copy={copy} />
      <EightThemesSection copy={copy} />
    </>
  );
}
