import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TrendingDown,
  Lightbulb,
  Zap,
  Download,
  Quote,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { GtpAboutHeroStack } from "@/components/gtp/gtp-about-hero-stack";
import type {
  GtpAboutEventInquiryCopy,
  GtpAboutGalleryBandCopy,
  GtpAboutQuotesBandCopy,
  GtpAboutSpeakersChromeCopy,
  GtpAboutSponsorLogoEntry,
  GtpAboutSponsorsBandCopy,
  GtpAboutThemeIconKey,
  GtpAboutThemesBandCopy,
  GtpAboutWhyMattersCopy,
  GtpWhatIsBandContent,
} from "@/data/gtp-about-page-defaults";
import { mergeGtpAboutPage } from "@/sanity/gtp-about-page-merge";
import {
  getGtp2026AboutPage,
  getGtp2026HighlightSpeakers,
  gtpAboutCmsSectionsRender,
  mapSanityHighlightToProps,
} from "@/sanity/gtp-stage1";
import { buildGtpCarouselSessions, getGtp2026Programme } from "@/sanity/queries";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";
import { gtpHighlightSpeakers } from "@/data/gtp-highlight-speakers";
import { ContactForm } from "@/app/events/gtp-2026/get-involved/contact-form";
import {
  GtpSiteExploreCardsGrid,
  GTP_EXPLORE_VERTICAL_BG_CLASSNAMES,
} from "@/components/gtp/gtp-site-explore-cards";
import { GtpSpeakersHighlightInner } from "@/components/gtp/gtp-speaker-highlight";
import { IconCardGrid } from "@/components/sections/icon-card-grid";
import {
  PartnerLogoPlaceholder,
  PartnerMarquee,
} from "@/components/sections/partner-marquee";
import { PlaceholderNotice } from "@/components/sections/placeholder-notice";
import { GtpEventInquiryPanel } from "@/components/sections/gtp-event-inquiry-panel";
import { TwoColumnTextImages } from "@/components/sections/two-column-text-images";
import { cn } from "@/lib/utils";
import { GTP_2026_REGISTRATION_URL } from "@/lib/gtp-registration-url";
import { getSiteUrlString } from "@/lib/site-url";
const aboutDescription =
  "Global Tipping Points Conference 2026, 12–15 October in Kuala Lumpur—science, finance, culture and policy for positive tipping points, hosted by Sunway Centre for Planetary Health.";

export const metadata: Metadata = {
  title: "Global Tipping Points Conference 2026",
  description: aboutDescription,
  alternates: { canonical: "/events/gtp-2026/about" },
  openGraph: {
    title: "Global Tipping Points Conference 2026",
    description: aboutDescription,
    type: "website",
    url: "/events/gtp-2026/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Tipping Points Conference 2026",
    description: aboutDescription,
  },
};

/** Refetch programme from Sanity on every request (no ISR cache). */
export const dynamic = "force-dynamic";

const gtpSite = getSiteUrlString();
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Global Tipping Points Conference 2026",
  description: aboutDescription,
  startDate: "2026-10-12",
  endDate: "2026-10-15",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Sunway University",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5, Jalan Universiti",
      addressLocality: "Bandar Sunway",
      addressRegion: "Selangor",
      postalCode: "47500",
      addressCountry: "MY",
    },
  },
  image: [`${gtpSite}/images/gtp/forest-bg.jpg`],
  organizer: {
    "@type": "Organization",
    name: "Sunway Centre for Planetary Health",
    url: gtpSite,
  },
  offers: {
    "@type": "Offer",
    url: GTP_2026_REGISTRATION_URL,
    availability: "https://schema.org/InStock",
    validFrom: "2026-01-01",
  },
};

// ─── About GTP (New Reality) ──────────────────────────────────────────────────

function WhatIsGtpSection({ content }: { content: GtpWhatIsBandContent }) {
  const [para1, para2] = content.bodyParagraphs;
  const coverSrc = content.reportCoverSrc;
  const coverRemote = /^https?:\/\//i.test(coverSrc);

  return (
    <SectionWrapper
      title={content.title}
      subtitle={content.eyebrow}
      theme="gtp"
      background="default"
      id="about"
    >
      <TwoColumnTextImages
        align="start"
        text={
          <>
            {para1 ? (
              <p className="text-lg leading-relaxed text-gray-600">{para1}</p>
            ) : null}
            {para2 ? (
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                {para2}
              </p>
            ) : null}
            <p className="mt-4 text-sm text-gray-500">
              {content.learnMoreIntro}{" "}
              <a
                href={content.learnMoreLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gtp-teal hover:underline"
              >
                {content.learnMoreLinkLabel}
              </a>
            </p>

            <blockquote className="mt-8 rounded-2xl bg-gtp-teal/10 p-6 ring-1 ring-gtp-teal/20">
              <Quote className="mb-3 h-6 w-6 text-gtp-teal/50" />
              <p className="font-heading text-lg font-semibold italic leading-snug text-gtp-dark-teal">
                &ldquo;{content.quote}&rdquo;
              </p>
            </blockquote>
          </>
        }
        media={
          <div className="flex flex-col items-center gap-5">
            <div className="mx-auto w-full max-w-[200px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-gtp-dark-teal/10">
              <Image
                src={coverSrc}
                alt="Global Tipping Points 2025 Report Cover"
                width={200}
                height={266}
                className="h-auto w-full object-cover"
                unoptimized={coverRemote}
              />
            </div>
            <Button variant="gtpSecondary" size="default" asChild>
              <a
                href={content.downloadButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                {content.downloadButtonLabel}
              </a>
            </Button>
          </div>
        }
      />

      <GtpSiteExploreCardsGrid />
    </SectionWrapper>
  );
}

// ─── About Conference ─────────────────────────────────────────────────────────

function imgUnoptimized(src: string) {
  return /^https?:\/\//i.test(src);
}

function WhyItMattersSection({ content }: { content: GtpAboutWhyMattersCopy }) {
  const [p1, p2, p3] = content.bodyParagraphs;
  const ctaInternal =
    content.ctaHref.startsWith("/") || content.ctaHref.startsWith("#");

  return (
    <SectionWrapper
      title={content.title}
      subtitle={content.eyebrow}
      theme="gtp"
      background="dark"
    >
      <TwoColumnTextImages
        align="start"
        text={
          <>
            {p1 ? (
              <p className="text-lg leading-relaxed text-white/80">{p1}</p>
            ) : null}
            {p2 ? (
              <p className="mt-4 text-base leading-relaxed text-white/75">
                {p2}
              </p>
            ) : null}
            {p3 ? (
              <p className="mt-4 text-base leading-relaxed text-white/70">
                {p3}
              </p>
            ) : null}
            <Button variant="gtpSecondary" size="lg" className="mt-8" asChild>
              {ctaInternal ? (
                <Link href={content.ctaHref}>
                  {content.ctaLabel}{" "}
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </Link>
              ) : (
                <a
                  href={content.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content.ctaLabel}{" "}
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </a>
              )}
            </Button>
          </>
        }
        media={
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            <div className="relative row-span-2 min-h-[280px] overflow-hidden rounded-2xl">
              <Image
                src={content.tallImageSrc}
                alt={content.tallImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized={imgUnoptimized(content.tallImageSrc)}
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={content.topRightImageSrc}
                alt={content.topRightImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized={imgUnoptimized(content.topRightImageSrc)}
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={content.bottomRightImageSrc}
                alt={content.bottomRightImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized={imgUnoptimized(content.bottomRightImageSrc)}
              />
            </div>
          </div>
        }
      />
    </SectionWrapper>
  );
}

// ─── Conference Themes ────────────────────────────────────────────────────────

const THEME_ICONS: Record<
  GtpAboutThemeIconKey,
  typeof TrendingDown
> = {
  "trending-down": TrendingDown,
  lightbulb: Lightbulb,
  zap: Zap,
};

function ThemesSection({ content }: { content: GtpAboutThemesBandCopy }) {
  const items = content.themes.map((t, i) => ({
    id: t.id,
    num: t.num,
    icon: THEME_ICONS[t.icon],
    title: t.title,
    body: t.body,
    bgClass:
      GTP_EXPLORE_VERTICAL_BG_CLASSNAMES[
        i % GTP_EXPLORE_VERTICAL_BG_CLASSNAMES.length
      ]!,
    iconWrap: "bg-white/15",
    iconColour: "text-white",
    bodyClass: "text-white/85",
    numClass: "text-white/35",
    titleClass: "text-white",
  }));

  return (
    <SectionWrapper
      title={content.title}
      subtitle={content.subtitle}
      theme="gtp"
      background="muted"
    >
      <IconCardGrid
        variant="gtp-gradient-pillar"
        gridClassName="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-3"
        itemClassName="w-full min-w-0 flex-1 basis-0 md:flex-[1_1_0%]"
        items={items}
      />
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-gtp-teal">
        {content.footerBlurb}
      </p>
    </SectionWrapper>
  );
}

// ─── Speaker Highlights ───────────────────────────────────────────────────────

function SpeakersSection({
  chrome,
  speakers,
}: {
  chrome: GtpAboutSpeakersChromeCopy;
  speakers: GtpHighlightSpeaker[];
}) {
  return (
    <SectionWrapper
      title={chrome.title}
      subtitle={chrome.subtitle}
      theme="gtp"
      background="default"
    >
      <GtpSpeakersHighlightInner staggerVariant="long" speakers={speakers} />
    </SectionWrapper>
  );
}

// ─── Event inquiry (above sponsors) ───────────────────────────────────────────

function EventInquirySection({
  content,
}: {
  content: GtpAboutEventInquiryCopy;
}) {
  return (
    <SectionWrapper
      title={content.title}
      subtitle={content.subtitle}
      theme="gtp"
      background="default"
      id="event-inquiry"
    >
      <GtpEventInquiryPanel>
        <p className="mb-6 text-center text-sm leading-relaxed text-gray-600">
          {content.intro}
        </p>
        <ContactForm />
      </GtpEventInquiryPanel>
    </SectionWrapper>
  );
}

// ─── Sponsors & Partners ──────────────────────────────────────────────────────

function PikPartnerLogo() {
  return (
    <a
      href="https://www.pik-potsdam.de/"
      target="_blank"
      rel="noopener noreferrer"
      className="mr-4 flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm transition-opacity hover:opacity-90"
      aria-label="Potsdam Institute for Climate Impact Research (opens in new tab)"
    >
      <Image
        src="/images/gtp/logos/pik-logo.png"
        alt="Potsdam Institute for Climate Impact Research (PIK)"
        width={160}
        height={56}
        className="h-11 w-auto max-w-[10rem] object-contain"
      />
    </a>
  );
}

const sponsorRowSlots = [
  "pik",
  ...Array.from({ length: 7 }, (_, i) => `ph-${i}`),
] as const;

/** When using CMS logos, pad with placeholders up to this many slots per row (legacy PIK strip width). */
const SPONSOR_ROW_MIN_SLOTS = sponsorRowSlots.length;

function GtpSponsorLogoCell({ entry }: { entry: GtpAboutSponsorLogoEntry }) {
  const remote = imgUnoptimized(entry.logoUrl);
  const card = (
    <span className="flex h-full w-full items-center justify-center px-2">
      <Image
        src={entry.logoUrl}
        alt={entry.name}
        width={160}
        height={56}
        className="h-11 w-auto max-w-[10rem] object-contain"
        unoptimized={remote}
      />
    </span>
  );
  const shellClass =
    "mr-4 flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm transition-opacity hover:opacity-90";

  const href = entry.href?.trim();
  if (href) {
    const internal = href.startsWith("/") || href.startsWith("#");
    if (internal) {
      return (
        <Link href={href} className={shellClass}>
          {card}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={shellClass}
        aria-label={`${entry.name} (opens in new tab)`}
      >
        {card}
      </a>
    );
  }

  return <div className={shellClass}>{card}</div>;
}

function SponsorsSection({ band }: { band: GtpAboutSponsorsBandCopy }) {
  const cmsLogos = band.sponsorLogos.filter((x) => x.logoUrl?.trim() && x.name?.trim());
  const useCmsMarquee = cmsLogos.length > 0;
  const placeholderPadCount = useCmsMarquee
    ? Math.max(0, SPONSOR_ROW_MIN_SLOTS - cmsLogos.length)
    : 0;

  return (
    <SectionWrapper
      title={band.title}
      subtitle={band.subtitle}
      theme="gtp"
      background="default"
    >
      {/*
        Vertical padding so card shadows aren’t clipped by overflow-hidden (needed for horizontal mask).
      */}
      <PartnerMarquee
        maskClassName="px-1 py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:py-4"
        forwardStripClassName="mb-5"
        renderRow={(slot) => (
          <>
            {useCmsMarquee ? (
              <>
                {cmsLogos.map((entry, i) => (
                  <GtpSponsorLogoCell
                    key={`${slot}-${entry.name}-${i}`}
                    entry={entry}
                  />
                ))}
                {Array.from({ length: placeholderPadCount }, (_, i) => (
                  <PartnerLogoPlaceholder
                    key={`${slot}-cms-pad-${i}`}
                    elevated
                  />
                ))}
              </>
            ) : (
              sponsorRowSlots.map((id) =>
                id === "pik" ? (
                  <PikPartnerLogo key={`${slot}-${id}`} />
                ) : (
                  <PartnerLogoPlaceholder key={`${slot}-${id}`} elevated />
                ),
              )
            )}
          </>
        )}
      />

      <PlaceholderNotice>
        {band.noticeBeforeLink}
        <Link
          href={band.noticeLinkHref}
          className="font-semibold text-gtp-dark-teal hover:underline"
        >
          {band.noticeLinkText}
        </Link>
      </PlaceholderNotice>
    </SectionWrapper>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

// Each bento group is a fixed-height flex item; groups vary in width & layout.
// Height anchor: h-72 (288 px).
// The strip renders two identical copies wrapped in their own shrink-0 flex
// containers so the browser measures each copy as one concrete element.
// translateX(-50%) then equals EXACTLY one copy's width → seamless loop.

function GalleryImg({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 hover:scale-105"
      sizes={sizes}
      unoptimized={imgUnoptimized(src)}
    />
  );
}

function BentoGroups({ slides }: { slides: GtpAboutGalleryBandCopy["slides"] }) {
  const slide = (i: number) => slides[i] ?? slides[0]!;
  return (
    <div className="flex h-72 shrink-0">
      <div className="relative mr-3 h-72 w-120 shrink-0 overflow-hidden rounded-2xl">
        <GalleryImg
          src={slide(0).src}
          alt={slide(0).alt}
          sizes="480px"
        />
      </div>

      <div className="mr-3 flex h-72 w-85 shrink-0 gap-2">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <GalleryImg
            src={slide(1).src}
            alt={slide(1).alt}
            sizes="168px"
          />
        </div>
        <div className="flex w-40 flex-col gap-2">
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <GalleryImg
              src={slide(2).src}
              alt={slide(2).alt}
              sizes="160px"
            />
          </div>
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <GalleryImg
              src={slide(3).src}
              alt={slide(3).alt}
              sizes="160px"
            />
          </div>
        </div>
      </div>

      <div className="relative mr-3 h-72 w-105 shrink-0 overflow-hidden rounded-2xl">
        <GalleryImg
          src={slide(4).src}
          alt={slide(4).alt}
          sizes="420px"
        />
      </div>

      <div className="mr-3 grid h-72 w-85 shrink-0 grid-cols-2 grid-rows-2 gap-2">
        <div className="relative overflow-hidden rounded-2xl">
          <GalleryImg
            src={slide(5).src}
            alt={slide(5).alt}
            sizes="168px"
          />
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <GalleryImg
            src={slide(6).src}
            alt={slide(6).alt}
            sizes="168px"
          />
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <GalleryImg
            src={slide(7).src}
            alt={slide(7).alt}
            sizes="168px"
          />
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <GalleryImg
            src={slide(8).src}
            alt={slide(8).alt}
            sizes="168px"
          />
        </div>
      </div>

      <div className="mr-3 flex h-72 w-85 shrink-0 gap-2">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <GalleryImg
            src={slide(9).src}
            alt={slide(9).alt}
            sizes="168px"
          />
        </div>
        <div className="flex w-40 flex-col gap-2">
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <GalleryImg
              src={slide(10).src}
              alt={slide(10).alt}
              sizes="160px"
            />
          </div>
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <GalleryImg
              src={slide(11).src}
              alt={slide(11).alt}
              sizes="160px"
            />
          </div>
        </div>
      </div>

      <div className="relative mr-3 h-72 w-105 shrink-0 overflow-hidden rounded-2xl">
        <GalleryImg
          src={slide(12).src}
          alt={slide(12).alt}
          sizes="420px"
        />
      </div>

      <div className="mr-3 flex h-72 w-95 shrink-0 gap-2">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <GalleryImg
            src={slide(13).src}
            alt={slide(13).alt}
            sizes="188px"
          />
        </div>
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <GalleryImg
            src={slide(14).src}
            alt={slide(14).alt}
            sizes="188px"
          />
        </div>
      </div>
    </div>
  );
}

function GalleryBentoStrip({
  slides,
}: {
  slides: GtpAboutGalleryBandCopy["slides"];
}) {
  return (
    <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="flex w-max animate-marquee will-change-transform">
        <BentoGroups slides={slides} />
        <BentoGroups slides={slides} />
      </div>
    </div>
  );
}

function GallerySection({ band }: { band: GtpAboutGalleryBandCopy }) {
  const footerInternal =
    band.footerLinkHref.startsWith("/") || band.footerLinkHref.startsWith("#");

  return (
    <SectionWrapper
      title={band.title}
      subtitle={band.subtitle}
      theme="gtp"
      background="dark"
    >
      <GalleryBentoStrip slides={band.slides} />

      <p className="mt-6 text-center text-sm text-white/60">
        {band.footerText}{" "}
        {footerInternal ? (
          <Link
            href={band.footerLinkHref}
            className="font-semibold text-gtp-teal hover:text-white hover:underline"
          >
            {band.footerLinkLabel}
          </Link>
        ) : (
          <a
            href={band.footerLinkHref}
            className="font-semibold text-gtp-teal hover:text-white hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {band.footerLinkLabel}
          </a>
        )}
      </p>
    </SectionWrapper>
  );
}

// ─── Quote Section ────────────────────────────────────────────────────────────

function QuoteSection({ band }: { band: GtpAboutQuotesBandCopy }) {
  return (
    <SectionWrapper
      title={band.title}
      subtitle={band.subtitle}
      theme="gtp"
      background="dark"
    >
      <StaggerReveal className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-4 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-x-visible md:px-0 md:pb-0">
        {band.quotes.map(
          ({
            name,
            designation,
            quote,
            photoSrc,
            avatarObjectClass,
            avatarScaleClass,
          }) => (
            <div
              key={name}
              className="flex w-[85vw] max-w-[85vw] shrink-0 snap-center flex min-h-[320px] flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:w-auto md:max-w-none"
            >
              <Quote className="mb-4 h-8 w-8 shrink-0 text-gtp-teal/60" />

              <p className="flex-1 font-heading text-base font-semibold italic leading-relaxed text-white/90">
                &ldquo;{quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-5">
                {photoSrc?.trim() ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-gtp-teal/30">
                    <Image
                      src={photoSrc}
                      alt={name}
                      fill
                      className={cn(
                        "object-cover",
                        avatarObjectClass ?? "object-center",
                        avatarScaleClass,
                      )}
                      sizes="56px"
                      unoptimized={imgUnoptimized(photoSrc)}
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gtp-teal/10 ring-2 ring-gtp-teal/20">
                    <UserCircle2 className="h-8 w-8 text-gtp-teal/40" />
                  </div>
                )}
                <div>
                  <p className="font-heading text-sm font-bold text-white">
                    {name}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                    {designation}
                  </p>
                </div>
              </div>
            </div>
          ),
        )}
      </StaggerReveal>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GtpAboutPage() {
  const [programme, aboutCms, highlightRows] = await Promise.all([
    getGtp2026Programme(),
    getGtp2026AboutPage().catch(() => null),
    getGtp2026HighlightSpeakers().catch(() => []),
  ]);
  const carouselSessions = buildGtpCarouselSessions(programme);
  const aboutSections = aboutCms?.sections ?? null;
  const showAboutCmsBands = gtpAboutCmsSectionsRender(aboutSections);
  const about = mergeGtpAboutPage(aboutCms);
  const speakersList =
    highlightRows.length > 0
      ? mapSanityHighlightToProps(highlightRows)
      : gtpHighlightSpeakers;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <GtpAboutHeroStack
        carouselSessions={carouselSessions}
        heroCopy={about.hero}
      />
      {showAboutCmsBands ? (
        <RenderSectionBlocks blocks={aboutSections ?? []} />
      ) : null}
      <WhyItMattersSection content={about.whyMatters} />
      <ThemesSection content={about.themes} />
      <SpeakersSection chrome={about.speakersChrome} speakers={speakersList} />
      <WhatIsGtpSection content={about.whatIs} />
      <QuoteSection band={about.quotes} />
      <GallerySection band={about.gallery} />
      <EventInquirySection content={about.eventInquiry} />
      <SponsorsSection band={about.sponsors} />
    </>
  );
}
