"use client";

import { useState } from "react";
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
  ArrowUp,
} from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { GTP_EXPLORE_VERTICAL_BG_CLASSNAMES } from "@/components/gtp/gtp-site-explore-cards";
import { IconCardGrid } from "@/components/sections/icon-card-grid";
import type { GtpSubmissionsResolvedCopy } from "@/sanity/gtp-stage2";
import { AbstractForm } from "./abstract-form";
import { WorkshopForm } from "./workshop-form";
import { GtpForestHero } from "@/components/sections/heroes";

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
    <SectionWrapper theme="gtp" background="default">
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
      <StaggerReveal className="grid grid-cols-1 gap-4 [grid-auto-rows:1fr] md:grid-cols-2 md:gap-6 lg:grid-cols-4">
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

type TabId = "abstract" | "workshop";

function CtaSection({ copy }: { copy: GtpSubmissionsResolvedCopy }) {
  const [activeTab, setActiveTab] = useState<TabId>("abstract");

  const tabs: { id: TabId; label: string; deadline: string }[] = [
    {
      id: "abstract",
      label: copy.abstractTabLabel,
      deadline: copy.abstractDeadline,
    },
    {
      id: "workshop",
      label: copy.workshopTabLabel,
      deadline: copy.workshopDeadline,
    },
  ];

  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <SectionWrapper theme="gtp" background="dark">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
          {copy.ctaTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/70">
          {copy.ctaSubtitle}
        </p>

        <div
          id="submissions-tabs"
          className="mt-8 inline-flex w-full overflow-hidden rounded-xl bg-white/10 p-1 backdrop-blur-sm sm:w-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-center text-xs font-semibold leading-snug transition-all duration-200 sm:flex-none sm:px-5 sm:text-sm ${
                activeTab === tab.id
                  ? "bg-white text-gtp-dark-teal shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative mt-6">
          <div className="rounded-2xl bg-white shadow-xl ring-1 ring-white/20 text-left overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
                {active.label}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Deadline:{" "}
                <span className="font-semibold text-gray-700">
                  {active.deadline}
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {activeTab === "abstract"
                  ? copy.abstractFormIntro
                  : copy.workshopFormIntro}
              </p>
            </div>
            <div className="p-6 sm:p-8">
              {activeTab === "abstract" ? (
                <AbstractForm
                  abstractForm={copy.abstractForm}
                  themeTitles={copy.themes.map((t) => t.title)}
                />
              ) : (
                <WorkshopForm
                  workshopForm={copy.workshopForm}
                  themeTitles={copy.themes.map((t) => t.title)}
                />
              )}
            </div>
          </div>

          <div className="absolute z-10 max-md:-bottom-10 max-md:right-2 md:-bottom-8 md:-right-8">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("submissions-tabs")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gtp-teal text-white shadow-lg">
                <ArrowUp className="h-5 w-5" />
              </span>
              <span className="whitespace-nowrap text-center text-xs font-semibold text-white/80">
                {copy.backToTopLabel}
              </span>
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export function GtpSubmissionsPageClient({
  copy,
}: {
  copy: GtpSubmissionsResolvedCopy;
}) {
  return (
    <>
      <GtpForestHero
        title={copy.heroTitle}
        lede={copy.heroLede}
        titleSize={copy.heroTitleSize}
      />
      <PillarsSection copy={copy} />
      <EightThemesSection copy={copy} />
      <CtaSection copy={copy} />
    </>
  );
}
