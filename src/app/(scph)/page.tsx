import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Building2,
  Leaf,
  GraduationCap,
  ShieldAlert,
  Thermometer,
  Wheat,
  Megaphone,
  Landmark,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ScphHero } from "@/components/scph/hero";

// ─── Stats Band ──────────────────────────────────────────────────────────────

const stats = [
  { value: "3", label: "Priority Areas" },
  { value: "10+", label: "Research Projects" },
  { value: "50+", label: "Partners & Collaborators" },
  { value: "Est. 2022", label: "Founded" },
];

function StatsBand() {
  return (
    <div className="bg-scph-blue py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative text-center">
              {/* Divider between stats (desktop only) */}
              {i > 0 && (
                <span className="absolute -left-4 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-white/15 md:block" />
              )}
              <p className="font-heading text-4xl font-bold text-scph-green">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── About Section ───────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <SectionWrapper theme="scph" background="default">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — text */}
        <div>
          <div className="mb-4 flex items-center gap-3 text-scph-dark-green">
            <span className="h-px w-8 bg-current opacity-60 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              About Us
            </span>
          </div>
          <h2 className="font-heading text-4xl font-bold leading-tight text-scph-blue md:text-5xl">
            A Think-and-Do Tank for Planetary Health
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-scph-green" />
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Sunway Centre for Planetary Health is committed to research and
            advocacy that advances planetary health through three priority
            areas: healthy cities, health-centred decarbonisation, and driving
            an education revolution.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            Anchored at Sunway University in Kuala Lumpur, we work across
            disciplines and borders to translate evidence into meaningful action
            for people and the planet.
          </p>
          <Button variant="scph" size="lg" className="mt-8" asChild>
            <Link href="/about-us">
              Read More <ArrowRight />
            </Link>
          </Button>
        </div>

        {/* Right — logo in coloured container (hidden on mobile) */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="flex h-80 w-80 items-center justify-center rounded-3xl bg-scph-blue/8 p-10 ring-1 ring-scph-blue/10">
            <Image
              src="/images/scph/logo-round.png"
              alt="SCPH Round Logo"
              width={220}
              height={220}
              className="h-auto w-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Priority Areas ──────────────────────────────────────────────────────────

const priorities = [
  {
    icon: Building2,
    title: "Healthy Cities",
    description:
      "Advancing urban health through research, policy advocacy, and community engagement. We explore how city design, green spaces, and urban planning can drive healthier populations.",
    colour: "text-scph-blue",
    iconBg: "bg-scph-blue/10",
    iconColour: "text-scph-blue",
  },
  {
    icon: Leaf,
    title: "Health-Centred Decarbonisation",
    description:
      "Integrating health considerations into climate action and decarbonisation strategies. Clean energy transitions can deliver significant co-benefits for human health.",
    colour: "text-scph-dark-green",
    iconBg: "bg-scph-green/15",
    iconColour: "text-scph-dark-green",
  },
  {
    icon: GraduationCap,
    title: "Driving an Education Revolution",
    description:
      "Reimagining education systems to equip the next generation with the knowledge, values, and skills needed to protect and restore planetary health.",
    colour: "text-scph-blue",
    iconBg: "bg-scph-dark-green/10",
    iconColour: "text-scph-dark-green",
  },
];

function PriorityAreasSection() {
  return (
    <SectionWrapper
      title="Three Pillars of Planetary Health"
      subtitle="Our Priority Areas"
      theme="scph"
      background="muted"
    >
      {/* Mobile: horizontal swipe carousel / Desktop: 3-col grid */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0">
        {priorities.map(({ icon: Icon, title, description, colour, iconBg, iconColour }) => (
          <div
            key={title}
            className="w-[85vw] max-w-[85vw] flex-shrink-0 snap-center group flex flex-col rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto md:max-w-none"
          >
            {/* Icon */}
            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
            >
              <Icon className={`h-7 w-7 ${iconColour}`} />
            </div>

            {/* Title */}
            <h3 className={`font-heading text-xl font-bold ${colour}`}>
              {title}
            </h3>

            {/* Body */}
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
              {description}
            </p>

            {/* Link */}
            <Link
              href="/projects"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-scph-blue transition-colors hover:text-scph-dark-green"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── Events Teaser ───────────────────────────────────────────────────────────

function EventsTeaserSection() {
  return (
    <SectionWrapper
      title="Where Science Meets Action"
      subtitle="Upcoming Events"
      theme="scph"
      background="dark"
    >
      {/* Mobile: horizontal swipe carousel / Desktop: 3-col grid */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-x-visible lg:pb-0">
        {/* GTP 2026 — featured large card */}
        <div className="w-[85vw] max-w-[85vw] flex-shrink-0 snap-center col-span-1 flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-gtp-dark-teal to-gtp-dark-teal-dark p-6 shadow-xl lg:w-auto lg:max-w-none lg:col-span-2 lg:p-8">
          <div className="flex items-center gap-3">
            <Image
              src="/images/gtp/logo.png"
              alt="GTP 2026"
              width={80}
              height={32}
              className="h-auto w-16 object-contain brightness-0 invert lg:w-20"
            />
            <Badge variant="gtpOrange">Upcoming · 2026</Badge>
          </div>
          <h3 className="mt-5 font-heading text-2xl font-bold text-white lg:mt-6 lg:text-4xl">
            Global Tipping Points 2026
          </h3>
          <p className="mt-1 text-sm font-medium text-gtp-teal">
            Kuala Lumpur, Malaysia · 2026
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/75 lg:mt-4 lg:text-base">
            A landmark conference bringing together science, finance, culture
            and policy to identify where progress can move fastest and how
            leaders can unlock positive tipping points.
          </p>
          <div className="mt-6 lg:mt-8">
            <Button variant="gtpCta" size="lg" asChild>
              <Link href="/events/gtp-2026">
                Learn More <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        {/* PHAM 2024 — smaller card */}
        <div className="w-[85vw] max-w-[85vw] flex-shrink-0 snap-center flex flex-col overflow-hidden rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm lg:w-auto lg:max-w-none lg:p-8">
          <Badge className="w-fit border border-white/30 bg-white/20 text-white backdrop-blur-sm">Past Event</Badge>
          <h3 className="mt-4 font-heading text-2xl font-bold text-white">
            PHAM 2024
          </h3>
          <p className="mt-1 text-sm font-medium text-scph-green">
            Planetary Health Annual Meeting
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            The 2024 Planetary Health Summit and 6th Annual Meeting —
            From Evidence to Action: Confronting Reality.
          </p>
          <div className="mt-auto pt-6">
            <Button
              variant="scphOutline"
              size="sm"
              className="border-white/40 text-white hover:bg-white/10 hover:border-white/70 hover:text-white"
              asChild
            >
              <a
                href="https://www.pham2024.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website <ExternalLink />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Roadmap Teaser ──────────────────────────────────────────────────────────

const roadmapPillars = [
  { icon: ShieldAlert, label: "Preventing the Next Pandemic" },
  { icon: Thermometer, label: "Tackling the Climate Emergency" },
  { icon: Building2, label: "Creating Healthy Cities" },
  { icon: Wheat, label: "Achieving Sustainable Food Systems" },
  { icon: Megaphone, label: "Advancing Planetary Health Communications" },
  { icon: Landmark, label: "Encouraging Effective Planetary Health Governance" },
  { icon: GraduationCap, label: "Creating A Planetary Health Education Revolution" },
];

function RoadmapTeaserSection() {
  return (
    <SectionWrapper
      title="How Do We 'Do' Planetary Health?"
      subtitle="Planetary Health Roadmap"
      theme="scph"
      background="muted"
    >
      <p className="mb-10 max-w-3xl text-base leading-relaxed text-gray-600">
        The Planetary Health Roadmap and Action Plan was unveiled as the primary
        outcome of PHAM 2024. Drawing on more than 100 experts across four
        working groups, it bridges Planetary Health discourse between academia
        and action via policy, political, and civil society spaces.
      </p>

      {/* Mobile: 2-col grid (4 rows) / Desktop: 4-col grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {roadmapPillars.map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md lg:gap-4 lg:p-5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-scph-blue/10 lg:h-10 lg:w-10">
              <Icon className="h-4 w-4 text-scph-blue lg:h-5 lg:w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-scph-dark-green/70 lg:text-xs">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-0.5 text-xs font-medium leading-snug text-gray-700 lg:text-sm">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button variant="scph" asChild>
          <a
            href="https://drive.google.com/file/d/1ZFUFo09NkJJRpOl5Y5cLmV_HoA_4msRe/view"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Roadmap <ArrowRight />
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://files.visura.co/users/12837/babfa360f16e6c7f017963cd1ed79502.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BookOpen className="mr-2 h-4 w-4" /> Download Briefing Note
          </a>
        </Button>
      </div>
    </SectionWrapper>
  );
}

// ─── Partners ────────────────────────────────────────────────────────────────

const partnerPlaceholders = Array.from({ length: 8 }, (_, i) => i + 1);

function PartnerLogoItem({ n, extraClass }: { n: number; extraClass?: string }) {
  return (
    <div className={`flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 mr-4 ${extraClass ?? ""}`}>
      <span className="text-xs font-medium text-gray-400">Partner Logo</span>
    </div>
  );
}

function PartnersSection() {
  return (
    <SectionWrapper
      title="Building Coalitions for Change"
      subtitle="Our Partners"
      theme="scph"
      background="default"
    >
      {/* Infinite 2-row marquee ticker */}
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Row 1 — scrolls left */}
        <div className="mb-4 flex animate-marquee will-change-transform">
          {partnerPlaceholders.map((n) => <PartnerLogoItem key={`r1a-${n}`} n={n} />)}
          {partnerPlaceholders.map((n) => <PartnerLogoItem key={`r1b-${n}`} n={n} />)}
        </div>
        {/* Row 2 — scrolls right */}
        <div className="flex animate-marquee-reverse will-change-transform">
          {partnerPlaceholders.map((n) => <PartnerLogoItem key={`r2a-${n}`} n={n} />)}
          {partnerPlaceholders.map((n) => <PartnerLogoItem key={`r2b-${n}`} n={n} />)}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        Partner logos coming soon. Interested in partnering?{" "}
        <Link href="/network" className="font-semibold text-scph-blue hover:underline">
          Get in touch →
        </Link>
      </p>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <ScphHero />
      <StatsBand />
      <AboutSection />
      <PriorityAreasSection />
      <EventsTeaserSection />
      <RoadmapTeaserSection />
      <PartnersSection />
    </>
  );
}
