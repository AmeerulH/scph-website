import type { Metadata } from "next";
import { Suspense } from "react";
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
import { IconCardGrid } from "@/components/sections/icon-card-grid";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SectionProseCta } from "@/components/sections/section-prose-cta";
import { StatsRow } from "@/components/sections/stats-row";
import { TwoColumnTextImages } from "@/components/sections/two-column-text-images";
import {
  RenderSectionBlock,
  RenderSectionBlocks,
} from "@/components/sections/render-section-block";
import {
  getGtp2026HighlightSpeakers,
  mapSanityHighlightToProps,
} from "@/sanity/gtp-stage1";
import {
  getScphHomePage,
  type ScphHomeAboutSectionData,
  type ScphHomePrioritiesSectionData,
} from "@/sanity/queries";
import {
  resolveScphHomeHero,
  resolveScphHomeHighlightedEvents,
} from "@/sanity/scph-home-resolvers";
import {
  mergeScphHomePartnersBand,
  scphHomePartnersHasQualifyingLogos,
} from "@/sanity/scph-home-partners";
import { ScphHomePartnersSection } from "@/components/scph/scph-home-partners-section";
import type {
  SectionProseCtaBlock,
  SectionStatsRowBlock,
} from "@/sanity/section-block-types";
import { getSiteUrlString } from "@/lib/site-url";

const homeStats = [
  { value: "3", label: "Priority Areas" },
  { value: "10+", label: "Research Projects" },
  { value: "50+", label: "Partners & Collaborators" },
  { value: "20+", label: "Publications" },
];

function cmsStatsRowIsUsable(
  row: SectionStatsRowBlock | null | undefined,
): row is SectionStatsRowBlock {
  if (!row || row._type !== "sectionStatsRow" || row.enabled === false) {
    return false;
  }
  const items = row.items?.filter((i) => i.value && i.label) ?? [];
  return items.length > 0;
}

function cmsHomeProseCtaUsable(
  block: SectionProseCtaBlock | null | undefined,
): block is SectionProseCtaBlock {
  if (!block || block.enabled === false) return false;
  if (block._type != null && block._type !== "sectionProseCta") return false;
  const hasTitle = Boolean(block.title?.trim());
  const hasBody = Boolean(block.body?.trim());
  const hasCtas =
    block.ctas?.some((c) => c.label?.trim() && c.href?.trim()) ?? false;
  return hasTitle || hasBody || hasCtas;
}

// ─── About Section ───────────────────────────────────────────────────────────

const DEFAULT_ABOUT = {
  eyebrow: "About Us",
  title: "Sunway Centre for Planetary Health",
  body: 'Sunway Centre for Planetary Health is a \u201cThink-and-Do\u201d tank, committed to research and advocacy that advances planetary health through three priority areas: healthy cities, health-centred decarbonisation, and driving an education revolution. Established in 2021.',
  ctaLabel: "Learn More",
  ctaHref: "/about-us",
};

function AboutSection({ cms }: { cms?: ScphHomeAboutSectionData }) {
  if (cms?.enabled === false) return null;
  const eyebrow = cms?.eyebrow?.trim() || DEFAULT_ABOUT.eyebrow;
  const title = cms?.title?.trim() || DEFAULT_ABOUT.title;
  const body = cms?.body?.trim() || DEFAULT_ABOUT.body;
  const ctaLabel = cms?.ctaLabel?.trim() || DEFAULT_ABOUT.ctaLabel;
  const ctaHref = cms?.ctaHref?.trim() || DEFAULT_ABOUT.ctaHref;
  const isExternal = /^https?:\/\//i.test(ctaHref);

  return (
    <SectionWrapper theme="scph" background="default">
      <TwoColumnTextImages
        align="center"
        text={
          <>
            <div className="mb-4 flex items-center gap-3 text-scph-dark-green">
              <span className="h-px w-8 shrink-0 bg-current opacity-60" />
              <span className="text-sm font-semibold uppercase tracking-[0.15em]">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-heading text-4xl font-bold leading-tight text-scph-blue md:text-5xl">
              {title}
            </h2>
            <div className="mt-4 h-1 w-20 rounded-full bg-scph-green" />
            <p className="mt-6 text-lg leading-relaxed text-gray-600">{body}</p>
            <MagneticButton className="mt-8">
              <Button variant="scph" size="lg" asChild>
                {isExternal ? (
                  <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                    {ctaLabel} <ArrowRight />
                  </a>
                ) : (
                  <Link href={ctaHref}>
                    {ctaLabel} <ArrowRight />
                  </Link>
                )}
              </Button>
            </MagneticButton>
          </>
        }
        media={
          <div className="hidden items-center justify-center lg:flex">
            <div className="relative h-80 w-full overflow-hidden rounded-3xl shadow-md">
              <Image
                src="/images/scph/group-photo-2.png"
                alt="SCPH Group Photo"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0px, 50vw"
              />
            </div>
          </div>
        }
      />
    </SectionWrapper>
  );
}

// ─── Priority Areas ──────────────────────────────────────────────────────────

const DEFAULT_PRIORITIES = [
  {
    id: "healthy-cities",
    icon: Building2,
    title: "Healthy Cities",
    description:
      "Advancing urban health through research, policy advocacy, and community engagement. We explore how city design, green spaces, and urban planning can drive healthier populations.",
    titleClassName: "text-scph-blue",
    iconBgClassName: "bg-scph-blue/10",
    iconClassName: "text-scph-blue",
  },
  {
    id: "decarbonisation",
    icon: Leaf,
    title: "Health-Centred Decarbonisation",
    description:
      "Integrating health considerations into climate action and decarbonisation strategies. Clean energy transitions can deliver significant co-benefits for human health.",
    titleClassName: "text-scph-dark-green",
    iconBgClassName: "bg-scph-green/15",
    iconClassName: "text-scph-dark-green",
  },
  {
    id: "education-revolution",
    icon: GraduationCap,
    title: "Driving an Education Revolution",
    description:
      "Reimagining education systems to equip the next generation with the knowledge, values, and skills needed to protect and restore planetary health.",
    titleClassName: "text-scph-blue",
    iconBgClassName: "bg-scph-dark-green/10",
    iconClassName: "text-scph-dark-green",
  },
];

function PriorityAreasSection({ cms }: { cms?: ScphHomePrioritiesSectionData }) {
  if (cms?.enabled === false) return null;
  const sectionTitle = cms?.sectionTitle?.trim() || "Three Key Priorities";
  const sectionSubtitle = cms?.sectionSubtitle?.trim() || "Our Focus Areas";
  const linkHref = cms?.linkHref?.trim() || "/programmes";

  const resolvedPriorities = DEFAULT_PRIORITIES.map((p, i) => {
    const cmsCard = cms?.cards?.[i];
    return {
      ...p,
      title: cmsCard?.title?.trim() || p.title,
      description: cmsCard?.description?.trim() || p.description,
    };
  });

  return (
    <SectionWrapper
      title={sectionTitle}
      subtitle={sectionSubtitle}
      theme="scph"
      background="muted"
    >
      <IconCardGrid
        variant="scph-priority"
        gridClassName="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:py-0 md:pb-0"
        items={resolvedPriorities}
        linkHref={linkHref}
      />
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

/** Refetch home CMS slices on each request so production edits show without redeploying. */
export const revalidate = 300;

async function HomeGtpHighlightSection() {
  const highlightRows = await getGtp2026HighlightSpeakers().catch(() => []);
  const highlightSpeakersFromCms =
    highlightRows.length > 0 ? mapSanityHighlightToProps(highlightRows) : undefined;
  return <Gtp2026HomeSection highlightSpeakers={highlightSpeakersFromCms} />;
}

export default async function HomePage() {
  const homeDoc = await getScphHomePage().catch(() => null);
  const heroCopy = resolveScphHomeHero(homeDoc?.hero);
  const highlightedEvents = resolveScphHomeHighlightedEvents(
    homeDoc?.highlightedEvents,
  );
  const cmsStats = homeDoc?.statsRow;
  const introSections = homeDoc?.introSections ?? null;
  const cmsAbout = homeDoc?.aboutSection ?? null;
  const cmsPriorities = homeDoc?.priorityAreasSection ?? null;
  const cmsRoadmap = homeDoc?.roadmapSection;
  const cmsNphap = homeDoc?.nphapSection;
  const partnersBand = mergeScphHomePartnersBand(homeDoc?.partnersBand);
  const showPartnersSection =
    partnersBand.showBand && scphHomePartnersHasQualifyingLogos(partnersBand);
  // Default to showing GTP sections when the document doesn't exist yet
  const showGtpSection = homeDoc?.showGtpSection ?? true;
  const showGtpInquirySection = homeDoc?.showGtpInquirySection ?? true;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <ScphHero hero={heroCopy} highlightedEvents={highlightedEvents} />
      {cmsStatsRowIsUsable(cmsStats) ? (
        <RenderSectionBlock
          block={{
            ...cmsStats,
            _type: "sectionStatsRow",
            _key: cmsStats._key ?? "home-stats",
          }}
        />
      ) : (
        <StatsRow items={homeStats} variant="blue-band" />
      )}
      <RenderSectionBlocks blocks={introSections ?? []} />
      <AboutSection cms={cmsAbout} />
      <PriorityAreasSection cms={cmsPriorities} />
      {cmsHomeProseCtaUsable(cmsRoadmap) ? (
        <RenderSectionBlock
          block={{
            ...cmsRoadmap,
            _type: "sectionProseCta",
            _key: cmsRoadmap._key ?? "home-roadmap",
          }}
        />
      ) : (
        <RoadmapSection />
      )}
      {cmsHomeProseCtaUsable(cmsNphap) ? (
        <RenderSectionBlock
          block={{
            ...cmsNphap,
            _type: "sectionProseCta",
            _key: cmsNphap._key ?? "home-nphap",
          }}
        />
      ) : (
        <NphapSection />
      )}
      {showPartnersSection ? (
        <ScphHomePartnersSection band={partnersBand} />
      ) : null}
      {showGtpSection && (
        <Suspense fallback={<Gtp2026HomeSection />}>
          <HomeGtpHighlightSection />
        </Suspense>
      )}
      {showGtpInquirySection && <Gtp2026HomeEventInquirySection />}
    </>
  );
}
