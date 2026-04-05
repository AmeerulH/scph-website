import type { Metadata } from "next";
import {
  ArrowRight,
  ShieldAlert,
  Thermometer,
  Building2,
  Wheat,
  Megaphone,
  Landmark,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScphPageHero } from "@/components/sections/heroes";
import { SectionProseCta } from "@/components/sections/section-prose-cta";
import { StatsRow } from "@/components/sections/stats-row";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Planetary Health Roadmap and research at Sunway Centre for Planetary Health—policy, cities, food systems, and climate-health action in Malaysia.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research | Sunway Centre for Planetary Health",
    description:
      "Explore our planetary health research themes and roadmap for real-world impact.",
    url: "/research",
  },
};

const researchStats = [
  { value: "100+", label: "Experts" },
  { value: "4", label: "Working Groups" },
  { value: "7", label: "Action Areas" },
  { value: "2024", label: "Published" },
];

// ─── Roadmap intro ────────────────────────────────────────────────────────────

function RoadmapIntroSection() {
  return (
    <SectionProseCta
      scrollProgress
      title="How Do We 'Do' Planetary Health?"
      subtitle="The Roadmap"
      theme="scph"
      background="default"
      prose={
        <>
          <p className="text-lg leading-relaxed text-gray-600">
            The Planetary Health Roadmap and Action Plan was unveiled as the
            primary outcome of the 2024 Planetary Health Summit and 6th Annual
            Meeting (PHAM 2024). In today&apos;s world, marked by escalating
            environmental challenges and their impact on human well-being, the
            Roadmap and Action Plan can help to answer the question: &ldquo;How
            do we &lsquo;do&rsquo; Planetary Health?&rdquo;
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            The development of this Roadmap and Action Plan was made possible
            through the collaborative efforts of experts working across four
            working groups and includes more than 100 experts from prestigious
            institutions around the planet. The document aims to bridge Planetary
            Health discourse between academia and action via policy, political,
            and civil society spaces, and to begin the process of pulling together
            an impactful set of actions that address the interconnected issues of
            human and environmental health.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            The Roadmap addresses the pressing need for a coordinated global
            response to the environmental challenges that threaten human health
            and biodiversity.
          </p>
        </>
      }
      actions={
        <>
          <MagneticButton>
            <Button variant="scph" asChild>
              <a
                href="https://drive.google.com/file/d/1ZFUFo09NkJJRpOl5Y5cLmV_HoA_4msRe/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the Full Roadmap <ArrowRight />
              </a>
            </Button>
          </MagneticButton>
          <Button variant="outline" asChild>
            <a
              href="https://files.visura.co/users/12837/babfa360f16e6c7f017963cd1ed79502.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="mr-2 h-4 w-4" /> Download Briefing Note
            </a>
          </Button>
        </>
      }
    />
  );
}

// ─── 7 Pillars ────────────────────────────────────────────────────────────────

const pillars = [
  {
    num: "01",
    icon: ShieldAlert,
    title: "Preventing the Next Pandemic",
    description:
      "Strengthening global health architecture to detect, prevent, and respond to infectious disease threats shaped by environmental disruption.",
  },
  {
    num: "02",
    icon: Thermometer,
    title: "Tackling the Climate Emergency",
    description:
      "Integrating health at the centre of climate policy to accelerate decarbonisation while delivering co-benefits for human well-being.",
  },
  {
    num: "03",
    icon: Building2,
    title: "Creating Healthy Cities",
    description:
      "Advancing urban design, green infrastructure, and city governance to build environments where people and the planet thrive.",
  },
  {
    num: "04",
    icon: Wheat,
    title: "Achieving Sustainable Food Systems",
    description:
      "Transforming how food is produced, distributed, and consumed to nourish people while restoring natural ecosystems.",
  },
  {
    num: "05",
    icon: Megaphone,
    title: "Advancing Planetary Health Communications",
    description:
      "Building public understanding, narrative, and civic engagement around the connections between human health and the health of the planet.",
  },
  {
    num: "06",
    icon: Landmark,
    title: "Encouraging Effective Planetary Health Governance",
    description:
      "Designing political, institutional, and policy frameworks that enable coordinated intersectoral action on planetary health.",
  },
  {
    num: "07",
    icon: GraduationCap,
    title: "Creating A Planetary Health Education Revolution",
    description:
      "Reimagining education systems to equip the next generation with the knowledge, values, and skills to protect and restore planetary health.",
  },
];

function PillarsSection() {
  return (
    <SectionWrapper
      title="Seven Pathways to Planetary Health"
      subtitle="Action Areas"
      theme="scph"
      background="muted"
    >
      <StaggerReveal
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        variant="long"
      >
        {pillars.map(({ num, icon: Icon, title, description }) => (
          <div
            key={num}
            className="flex flex-col min-h-[320px] rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-scph-blue/10">
                <Icon className="h-6 w-6 text-scph-blue" />
              </div>
              <span className="font-heading text-sm font-bold text-scph-dark-green/60">
                {num}
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold leading-snug text-scph-blue">
              {title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          </div>
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  return (
    <>
      <ScphPageHero
        eyebrow="Research"
        title={<>Planetary Health Roadmap &amp; Action Plan</>}
        lede="Bridging Planetary Health discourse between academia and action via policy, political, and civil society spaces."
      />
      <StatsRow items={researchStats} variant="light-green" />
      <RoadmapIntroSection />
      <PillarsSection />
    </>
  );
}
