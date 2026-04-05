import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Building2,
  Leaf,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ScphHero } from "@/components/scph/hero";
import {
  Gtp2026HomeSection,
  Gtp2026HomeEventInquirySection,
} from "@/components/scph/gtp-2026-home-sections";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SectionProseCta } from "@/components/sections/section-prose-cta";
import { StatsRow } from "@/components/sections/stats-row";
import { getSiteUrlString } from "@/lib/site-url";

const homeStats = [
  { value: "3", label: "Priority Areas" },
  { value: "10+", label: "Research Projects" },
  { value: "50+", label: "Partners & Collaborators" },
  { value: "20+", label: "Publications" },
];

// ─── About Section ───────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <SectionWrapper theme="scph" background="default">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — text */}
        <div>
          <div className="mb-4 flex items-center gap-3 text-scph-dark-green">
            <span className="h-px w-8 bg-current opacity-60 shrink-0" />
            <span className="text-sm font-semibold uppercase tracking-[0.15em]">
              About Us
            </span>
          </div>
          <h2 className="font-heading text-4xl font-bold leading-tight text-scph-blue md:text-5xl">
            Sunway Centre for Planetary Health
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-scph-green" />
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Sunway Centre for Planetary Health is a &ldquo;Think-and-Do&rdquo; tank,
            committed to research and advocacy that advances planetary health
            through three priority areas: healthy cities, health-centred
            decarbonisation, and driving an education revolution. Established
            in 2021.
          </p>
          <MagneticButton className="mt-8">
            <Button variant="scph" size="lg" asChild>
              <Link href="/about-us">
                Learn More <ArrowRight />
              </Link>
            </Button>
          </MagneticButton>
        </div>

        {/* Right — group photo */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="relative h-80 w-full overflow-hidden rounded-3xl shadow-md">
            <Image
              src="/images/scph/group-photo-2.png"
              alt="SCPH Group Photo"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 0px, 50vw"
              priority
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
      title="Three Key Priorities"
      subtitle="Our Focus Areas"
      theme="scph"
      background="muted"
    >
      <StaggerReveal
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:py-0 md:pb-0"
        variant="default"
      >
        {priorities.map(({ icon: Icon, title, description, colour, iconBg, iconColour }) => (
          <div
            key={title}
            className="w-[85vw] max-w-[85vw] min-h-[320px] flex-shrink-0 snap-center group flex flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto md:max-w-none"
          >
            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
            >
              <Icon className={`h-7 w-7 ${iconColour}`} />
            </div>
            <h3 className={`font-heading text-xl font-bold ${colour}`}>
              {title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
              {description}
            </p>
            <Link
              href="/programmes"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-scph-blue transition-colors hover:text-scph-dark-green"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

function RoadmapSection() {
  return (
    <SectionProseCta
      title="Planetary Health Roadmap and Action Plan"
      subtitle="How do we 'do' Planetary Health?"
      theme="scph"
      background="muted"
      constrainProse={false}
      prose={
        <p className="mb-10 max-w-3xl text-base leading-relaxed text-gray-600">
          The Planetary Health Roadmap and Action Plan aims to bridge Planetary
          Health discourse between academia and action via policy, political, and
          civil society spaces, and to begin the process of pulling together an
          impactful set of actions that address the interconnected issues of
          human and environmental health. The Roadmap addresses the pressing
          need for a coordinated global response to the environmental challenges
          that threaten human health and biodiversity.
        </p>
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
                Read the Roadmap Action Plan <ArrowRight />
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

// ─── NPHAP ───────────────────────────────────────────────────────────────────

function NphapSection() {
  return (
    <SectionProseCta
      title="The National Planetary Health Action Plan (NPHAP)"
      subtitle="Malaysia's First Action Plan"
      theme="scph"
      background="default"
      actionsInsideProse
      prose={
        <>
          <p className="text-base leading-relaxed text-gray-600">
            At the Planetary Health Annual Meeting 2025 in Rotterdam, Malaysia
            was recognised as the first nation to develop a national-level
            Planetary Health Action Plan, demonstrating leadership in protecting
            people and the planet.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Developed by the Academy of Sciences Malaysia, NPHAP charts a bold,
            whole-of-nation framework to align Malaysia&apos;s development within
            planetary boundaries.
          </p>
        </>
      }
      actions={
        <MagneticButton>
          <Button variant="scph" asChild>
            <a
              href="https://www.akademisains.gov.my/nphap-full-report/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the full NPHAP <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </MagneticButton>
      }
    />
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
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="mb-4 flex w-max animate-marquee will-change-transform">
          {partnerPlaceholders.map((n) => <PartnerLogoItem key={`r1a-${n}`} n={n} />)}
          {partnerPlaceholders.map((n) => <PartnerLogoItem key={`r1b-${n}`} n={n} />)}
        </div>
        <div className="flex w-max animate-marquee-reverse will-change-transform">
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

const homeDescription =
  "Sunway Centre for Planetary Health is a Think-and-Do tank for planetary health research and advocacy in Malaysia—healthy cities, decarbonisation, and education. Host of Global Tipping Points Conference 2026 in Kuala Lumpur.";

export const metadata: Metadata = {
  title: {
    absolute: "Sunway Centre for Planetary Health",
  },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sunway Centre for Planetary Health",
    description: homeDescription,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunway Centre for Planetary Health",
    description: homeDescription,
  },
};

const siteOrigin = getSiteUrlString();
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: "Sunway Centre for Planetary Health",
      url: siteOrigin,
      logo: `${siteOrigin}/images/scph/logo-mixcolor.png`,
      sameAs: [
        "https://www.facebook.com/SunwayCPH",
        "https://www.instagram.com/sunwaycph/",
        "https://my.linkedin.com/showcase/sunway-centre-for-planetary-health/",
        "https://www.tiktok.com/@sunwaycph",
        "https://x.com/SunwayCPH",
        "https://www.youtube.com/@sunwaycentreforplanetaryhe8898",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      url: siteOrigin,
      name: "Sunway Centre for Planetary Health",
      publisher: { "@id": `${siteOrigin}/#organization` },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <ScphHero />
      <StatsRow items={homeStats} variant="blue-band" />
      <Gtp2026HomeSection />
      <Gtp2026HomeEventInquirySection />
      <AboutSection />
      <PriorityAreasSection />
      <RoadmapSection />
      <NphapSection />
      <PartnersSection />
    </>
  );
}
