"use client";

import { useState } from "react";
import Image from "next/image";
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
import { AbstractForm } from "./abstract-form";
import { WorkshopForm } from "./workshop-form";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function SubmissionsHero() {
  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-40 text-center">
      <Image
        src="/images/gtp/forest-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gtp-dark-teal/75" />
      <div className="relative mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          GTP 2026
        </span>
        <h1 className="mt-6 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Call for Abstract and Action Workshop Proposal Submissions
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Submit scalable solutions emerging from Asia across the
          conference&apos;s critical domains
        </p>
      </div>
    </div>
  );
}

// ─── Three Pillars ────────────────────────────────────────────────────────────

const pillars = [
  {
    num: "01",
    icon: TrendingDown,
    title: "Understanding the Shift",
    body: "Clarifying what is changing in the world today, including climate and nature risks, as well as social and economic pressures that affect health, food security and stability.",
    cardClass: "bg-gtp-dark-teal text-white ring-white/10",
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Igniting Imagination",
    body: "Exploring how culture, faith, creativity and moral leadership help people, communities and institutions transition into reformation.",
    cardClass: "bg-gtp-teal text-white ring-white/10",
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  },
  {
    num: "03",
    icon: Zap,
    title: "Accelerating Action",
    body: "Identifying what policies, investments and partnerships can reinforce each other and create lasting momentum.",
    cardClass: "bg-gtp-dark-green text-white ring-white/10",
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  },
];

function PillarsSection() {
  return (
    <SectionWrapper
      title="Submit your research and proposal"
      theme="gtp"
      background="default"
    >
      <p className="mb-8 max-w-3xl text-left text-base leading-relaxed text-gray-600">
        GTP 2026 is organised around three pillars that shape the programme and
        submissions.
      </p>

      <StaggerReveal
        className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-3"
        itemClassName="w-full min-w-0 flex-1 basis-0 md:flex-[1_1_0%] md:transition-[flex-grow] md:duration-500 md:ease-in-out md:hover:flex-grow-[1.45]"
      >
        {pillars.map(
          ({
            num,
            icon: Icon,
            title,
            body,
            cardClass,
            iconWrap,
            iconColour,
            bodyClass,
            numClass,
            titleClass,
          }) => (
            <div
              key={num}
              className={`flex h-full min-h-[280px] w-full flex-col rounded-2xl p-6 shadow-md ring-1 md:min-h-[320px] ${cardClass}`}
            >
              <div className="mb-5 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconWrap}`}
                >
                  <Icon className={`h-6 w-6 ${iconColour}`} />
                </div>
                <span className={`font-heading text-sm font-bold ${numClass}`}>
                  {num}
                </span>
              </div>
              <h3 className={`font-heading text-xl font-bold ${titleClass}`}>
                {title}
              </h3>
              <p className={`mt-3 flex-1 text-sm leading-relaxed ${bodyClass}`}>
                {body}
              </p>
            </div>
          ),
        )}
      </StaggerReveal>

      <p className="mx-auto mt-10 max-w-3xl text-center text-base font-bold leading-relaxed text-gtp-dark-teal md:text-lg">
        We invite researchers and practitioners to submit abstracts for oral and
        poster presentations, and contribute to the programme agenda by
        proposing to convene action workshops.
      </p>
      <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-gray-600 md:text-base">
        As research demonstrates that systems can shift rapidly when leadership,
        investment, and public confidence converge, GTP 2026 focuses on these
        three pillars.
      </p>
      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-gray-600">
        <Link
          href="https://global-tipping-points.org/download/1418/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gtp-teal underline underline-offset-2 hover:text-gtp-dark-teal"
        >
          Download the Global Tipping Points Report 2025
        </Link>
        <span className="text-gray-400"> — </span>
        <span className="text-gray-500">
          background reading for submitters (opens global-tipping-points.org)
        </span>
      </p>
    </SectionWrapper>
  );
}

// ─── Eight Themes ─────────────────────────────────────────────────────────────

const eightThemes = [
  {
    icon: Globe,
    title: "Earth System Science",
    body: "Cutting-edge research on planetary boundaries, climate feedback loops, ecosystem thresholds, and Earth system modelling.",
    iconBg: "bg-sky-50",
    iconColour: "text-sky-600",
  },
  {
    icon: Bot,
    title: "Technology and AI",
    body: "Innovative applications of artificial intelligence, machine learning, and emerging technologies for monitoring and responding to global tipping points.",
    iconBg: "bg-violet-50",
    iconColour: "text-violet-600",
  },
  {
    icon: Landmark,
    title: "Governance",
    body: "Scientific analysis of governance frameworks, institutional capacity, and policy mechanisms for managing systemic risks and cross-border environmental challenges.",
    iconBg: "bg-amber-50",
    iconColour: "text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Finance and Business",
    body: "Advances in sustainable finance, risk assessment methodologies, and business models that align with planetary boundaries.",
    iconBg: "bg-emerald-50",
    iconColour: "text-emerald-600",
  },
  {
    icon: BookOpen,
    title: "Faith and Culture",
    body: "Scientific studies examining the intersection of cultural values, spiritual traditions, and environmental stewardship.",
    iconBg: "bg-rose-50",
    iconColour: "text-rose-600",
  },
  {
    icon: Radio,
    title: "Communications",
    body: "Innovative approaches to science communication, public engagement, and behavioural change strategies for disseminating information about tipping points.",
    iconBg: "bg-orange-50",
    iconColour: "text-orange-600",
  },
  {
    icon: Leaf,
    title: "Nature-based Solutions",
    body: "Scientific advances in ecosystem restoration, biodiversity conservation, and natural climate solutions addressing earth system tipping points.",
    iconBg: "bg-green-50",
    iconColour: "text-green-600",
  },
  {
    icon: Activity,
    title: "Health",
    body: "Research on the health impacts of environmental tipping points, health-centred approaches to climate action, and the co-benefits of planetary health interventions.",
    iconBg: "bg-red-50",
    iconColour: "text-red-600",
  },
];

function EightThemesSection() {
  return (
    <SectionWrapper title="8 Critical Domains" theme="gtp" background="muted">
      <p className="mb-8 max-w-3xl text-left text-base leading-relaxed text-gray-600">
        We especially encourage submissions highlighting scalable solutions
        emerging from Asia across the conference&apos;s eight critical domains:
      </p>
      <StaggerReveal className="grid grid-cols-1 gap-4 [grid-auto-rows:1fr] md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {eightThemes.map(({ icon: Icon, title, body, iconBg, iconColour }) => (
          <div
            key={title}
            className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}
            >
              <Icon className={`h-5 w-5 ${iconColour}`} />
            </div>
            <h3 className="font-heading text-sm font-bold leading-snug text-gtp-dark-teal">
              {title}
            </h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500">
              {body}
            </p>
          </div>
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

const TABS = [
  {
    id: "abstract",
    label: "Abstract Submission",
    deadline: "15 May 2026, 23:59 (GMT+8)",
  },
  {
    id: "workshop",
    label: "Action Workshop Proposal Submission",
    deadline: "8 May 2026, 23:59 (GMT+8)",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

function CtaSection() {
  const [activeTab, setActiveTab] = useState<TabId>("abstract");

  return (
    <SectionWrapper theme="gtp" background="dark">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
          Ready to Submit?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/70">
          Select a submission type below and complete the form.
        </p>

        {/* Tab bar */}
        <div
          id="submissions-tabs"
          className="mt-8 inline-flex w-full overflow-hidden rounded-xl bg-white/10 p-1 backdrop-blur-sm sm:w-auto"
        >
          {TABS.map((tab) => (
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

        {/* Form container */}
        <div className="relative mt-6">
          <div className="rounded-2xl bg-white shadow-xl ring-1 ring-white/20 text-left overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Deadline:{" "}
                <span className="font-semibold text-gray-700">
                  {TABS.find((t) => t.id === activeTab)?.deadline}
                </span>
              </p>
            </div>
            <div className="p-6 sm:p-8">
              {activeTab === "abstract" ? <AbstractForm /> : <WorkshopForm />}
            </div>
          </div>

          {/* Floating back-to-top — md+ peeks past card; mobile stays inside column to avoid viewport overflow */}
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
                Back to top
              </span>
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GtpSubmissionsPage() {
  return (
    <>
      <SubmissionsHero />
      <PillarsSection />
      <EightThemesSection />
      <CtaSection />
    </>
  );
}
