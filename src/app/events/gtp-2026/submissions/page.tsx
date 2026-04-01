"use client";

import Image from "next/image";
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
import { StaggerReveal } from "@/components/motion/StaggerReveal";

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
        <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Submissions
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Submit scalable solutions emerging from Asia across the conference&apos;s critical domains
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
    iconBg: "bg-gtp-dark-teal/10",
    iconColour: "text-gtp-dark-teal",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Igniting Imagination",
    body: "Exploring how culture, faith, creativity and moral leadership help people, communities and institutions transition into reformation.",
    iconBg: "bg-gtp-teal/10",
    iconColour: "text-gtp-teal",
  },
  {
    num: "03",
    icon: Zap,
    title: "Accelerating Action",
    body: "Identifying what policies, investments and partnerships can reinforce each other and create lasting momentum.",
    iconBg: "bg-gtp-green/15",
    iconColour: "text-gtp-dark-green",
  },
];

function PillarsSection() {
  return (
    <SectionWrapper
      title="Submit your research and proposal"
      theme="gtp"
      background="default"
    >
      <p className="mx-auto mb-10 max-w-3xl text-center text-base leading-relaxed text-gray-600">
        As research demonstrates that systems can shift rapidly when leadership, investment, and public confidence converge, GTP 2026 focuses on three pillars:
      </p>

      <StaggerReveal className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-x-visible md:px-0 md:pb-0">
        {pillars.map(({ num, icon: Icon, title, body, iconBg, iconColour }) => (
          <div
            key={num}
            className="w-[85vw] max-w-[85vw] flex-shrink-0 snap-center flex min-h-[280px] flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto md:max-w-none"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColour}`} />
              </div>
              <span className="font-heading text-sm font-bold text-gray-300">{num}</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-gtp-dark-teal">{title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">{body}</p>
          </div>
        ))}
      </StaggerReveal>

      <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-gray-600">
        We invite researchers and practitioners to submit abstracts for oral and poster presentations, and contribute to the programme agenda by proposing to convene action workshops.
      </p>
      <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-gray-500">
        We especially encourage submissions highlighting scalable solutions emerging from Asia across the conference&apos;s eight critical domains:
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
      <StaggerReveal className="grid grid-cols-1 gap-4 [grid-auto-rows:1fr] md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {eightThemes.map(({ icon: Icon, title, body, iconBg, iconColour }) => (
          <div
            key={title}
            className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColour}`} />
            </div>
            <h3 className="font-heading text-sm font-bold leading-snug text-gtp-dark-teal">
              {title}
            </h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500">{body}</p>
          </div>
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

const abstractFormEmbedUrl =
  "https://docs.google.com/forms/d/1ZSe8110g8FWBiqGpF5AQNEtBqgmWes5ebNG8eSLmLPc/prefill?embedded=true";
const actionWorkshopFormEmbedUrl =
  "https://docs.google.com/forms/d/19YpOKfMRKrgxq2Yh4WiidFYvfuvHBJ053MUGpNmLGvA/prefill?embedded=true";

function CtaSection() {
  return (
    <SectionWrapper theme="gtp" background="dark">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
          Ready to Submit?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/70">
          Complete the form below for your abstract or action workshop proposal.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-white/20">
            <div className="border-b border-gray-200 bg-gray-50 p-4 text-left">
              <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
                Abstract Submission
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Deadline: <span className="font-semibold text-gray-700">15 May 2026</span>
              </p>
            </div>
            <iframe
              title="GTP 2026 Abstract Submission Form"
              src={abstractFormEmbedUrl}
              className="h-[960px] w-full border-0"
              loading="lazy"
            />
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-white/20">
            <div className="border-b border-gray-200 bg-gray-50 p-4 text-left">
              <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
                Action Workshop Submission
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Deadline: <span className="font-semibold text-gray-700">27 April 2026</span>
              </p>
            </div>
            <iframe
              title="GTP 2026 Action Workshop Submission Form"
              src={actionWorkshopFormEmbedUrl}
              className="h-[960px] w-full border-0"
              loading="lazy"
            />
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
