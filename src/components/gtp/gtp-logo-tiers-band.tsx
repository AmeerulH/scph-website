"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import { motion } from "motion/react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import type {
  GtpAboutLogoTiersBandCopy,
  GtpAboutSponsorLogoEntry,
  GtpLogoTierKey,
} from "@/data/gtp-about-page-defaults";
import {
  GTP_LOGO_TIER_KEYS,
  GTP_LOGO_TIER_LABELS,
} from "@/data/gtp-about-page-defaults";
import { cn } from "@/lib/utils";
import { scphSpring } from "@/lib/motion-presets";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type GtpLogoTiersBandProps = {
  variant: "sponsors" | "partners";
  band: GtpAboutLogoTiersBandCopy;
};

const OPTIMIZED_HOSTS = ["cdn.sanity.io", "images.unsplash.com"];

function imgUnoptimized(src: string) {
  if (!src || !/^https?:\/\//i.test(src)) return false;
  try {
    const { hostname } = new URL(src);
    return !OPTIMIZED_HOSTS.includes(hostname);
  } catch {
    return true;
  }
}

const variantStyles = {
  sponsors: {
    background: "default" as const,
    chipClassName: "bg-white",
    ruleClassName: "text-gtp-dark-teal/35",
    stripClassName:
      "from-gtp-dark-teal via-gtp-teal to-[#DB5D00]",
    inviteIconWrapClassName: "bg-white/15 text-white",
    inviteSupport:
      "Join organisations backing climate action and visibility at GTP 2026.",
  },
  partners: {
    background: "muted" as const,
    chipClassName: "bg-slate-100",
    ruleClassName: "text-gtp-teal/40",
    stripClassName: "from-gtp-teal via-gtp-dark-teal to-[#DB5D00]",
    inviteIconWrapClassName: "bg-white/15 text-white",
    inviteSupport:
      "Collaborate with us to shape a conference that drives real-world impact.",
  },
};

function cleanInviteHeadline(
  raw: string,
  variant: "sponsors" | "partners",
): string {
  let text = raw.trim();
  text = text.replace(/^(Sponsor|Partner) logos coming soon\.\s*/i, "");
  text = text.replace(/\s+/g, " ").trim();
  if (!text) {
    return variant === "sponsors"
      ? "Interested in sponsoring?"
      : "Interested in partnering?";
  }
  return text;
}

function cleanInviteCtaLabel(raw: string): string {
  const text = raw.replace(/→/g, "").trim();
  return text || "Get in touch";
}

/** Mix of solid geometry + soft blobs on the invite strip. */
function InviteStripShapes() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 280"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Soft blobs */}
      <circle cx="70" cy="50" r="95" fill="white" fillOpacity="0.07" />
      <ellipse
        cx="1120"
        cy="230"
        rx="130"
        ry="95"
        fill="white"
        fillOpacity="0.08"
      />
      <circle cx="620" cy="250" r="70" fill="white" fillOpacity="0.05" />
      <ellipse
        cx="280"
        cy="250"
        rx="100"
        ry="55"
        fill="white"
        fillOpacity="0.06"
        transform="rotate(-18 280 250)"
      />

      {/* Solid geometric shapes */}
      <rect
        x="160"
        y="36"
        width="52"
        height="52"
        rx="6"
        fill="white"
        fillOpacity="0.12"
        transform="rotate(18 186 62)"
      />
      <rect
        x="980"
        y="48"
        width="40"
        height="40"
        rx="4"
        fill="none"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="2"
        transform="rotate(-14 1000 68)"
      />
      <polygon
        points="1080,40 1112,96 1048,96"
        fill="white"
        fillOpacity="0.14"
      />
      <polygon
        points="90,190 118,240 62,240"
        fill="none"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="2"
      />
      <circle cx="340" cy="58" r="18" fill="white" fillOpacity="0.14" />
      <circle
        cx="860"
        cy="210"
        r="26"
        fill="none"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="2"
      />
      <rect
        x="740"
        y="28"
        width="64"
        height="28"
        rx="14"
        fill="white"
        fillOpacity="0.1"
        transform="rotate(8 772 42)"
      />
      <polygon
        points="480,210 510,210 495,236"
        fill="white"
        fillOpacity="0.16"
      />
      <rect
        x="1040"
        y="170"
        width="36"
        height="36"
        fill="white"
        fillOpacity="0.11"
        transform="rotate(32 1058 188)"
      />
      <circle cx="420" cy="200" r="8" fill="white" fillOpacity="0.2" />
      <circle cx="920" cy="70" r="6" fill="white" fillOpacity="0.18" />
      <circle cx="200" cy="160" r="5" fill="white" fillOpacity="0.16" />

      {/* Thin ring accents */}
      <circle
        cx="150"
        cy="140"
        r="72"
        fill="none"
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
      <circle
        cx="1050"
        cy="120"
        r="58"
        fill="none"
        stroke="white"
        strokeOpacity="0.12"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Metal-true accents for icon + label (not GTP greens for bronze). */
const tierAccentClassName: Record<GtpLogoTierKey, string> = {
  platinum: "text-[#5B6B7A]",
  gold: "text-[#C49212]",
  silver: "text-[#7A8B98]",
  bronze: "text-[#A56B3A]",
};

function TierStarburstIcon({
  tier,
  className,
}: {
  tier: GtpLogoTierKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="1em"
      height="1em"
      aria-hidden
      className={cn(
        "shrink-0 text-[1em] leading-none",
        tierAccentClassName[tier],
        className,
      )}
    >
      <path
        fill="currentColor"
        d="M16 2.5c.55 1.9 1.85 4.55 4.2 6.9 2.35 2.35 5 3.65 6.9 4.2-1.9.55-4.55 1.85-6.9 4.2-2.35 2.35-3.65 5-4.2 6.9-.55-1.9-1.85-4.55-4.2-6.9C9.45 15.45 6.8 14.15 4.9 13.6c1.9-.55 4.55-1.85 6.9-4.2C14.15 7.05 15.45 4.4 16 2.5Z"
      />
      <circle cx="16" cy="16" r="3.25" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function SideWaveRule({
  side,
  className,
  reduceMotion,
}: {
  side: "left" | "right";
  className?: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn(
        "h-px min-w-0 flex-1 rounded-full bg-current",
        className,
      )}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maskImage:
          side === "left"
            ? "linear-gradient(to right, transparent, black 28%)"
            : "linear-gradient(to left, transparent, black 28%)",
        WebkitMaskImage:
          side === "left"
            ? "linear-gradient(to right, transparent, black 28%)"
            : "linear-gradient(to left, transparent, black 28%)",
      }}
    />
  );
}

function TierHeader({
  tier,
  label,
  chipClassName,
  ruleClassName,
  reduceMotion,
}: {
  tier: GtpLogoTierKey;
  label: string;
  chipClassName: string;
  ruleClassName: string;
  reduceMotion: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 overflow-visible sm:gap-4",
        ruleClassName,
      )}
    >
      <SideWaveRule
        side="left"
        className="hidden sm:block"
        reduceMotion={reduceMotion}
      />

      <motion.div
        className={cn(
          "relative z-10 flex shrink-0 items-center gap-2.5 px-1 text-base leading-none sm:gap-3",
          chipClassName,
        )}
        initial={
          reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(4px)" }
        }
        whileInView={
          reduceMotion
            ? undefined
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        viewport={{ once: true, amount: 0.7 }}
        transition={{ type: "spring", ...scphSpring, delay: 0.1 }}
      >
        <motion.span
          className="inline-flex"
          initial={
            reduceMotion ? false : { scale: 0.35, rotate: -28, opacity: 0 }
          }
          whileInView={
            reduceMotion ? undefined : { scale: 1, rotate: 0, opacity: 1 }
          }
          viewport={{ once: true, amount: 0.7 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 14,
            delay: 0.18,
          }}
        >
          <TierStarburstIcon tier={tier} />
        </motion.span>
        <h3
          className={cn(
            "font-heading text-[1em] font-semibold uppercase tracking-[0.14em]",
            tierAccentClassName[tier],
          )}
        >
          {label}
        </h3>
      </motion.div>

      <SideWaveRule side="right" reduceMotion={reduceMotion} />
    </div>
  );
}

function GtpLogoTierCell({ entry }: { entry: GtpAboutSponsorLogoEntry }) {
  const remote = imgUnoptimized(entry.logoUrl);
  const image = (
    <span className="flex h-16 w-44 items-center justify-center sm:h-20 sm:w-52">
      <Image
        src={entry.logoUrl}
        alt={entry.name}
        width={220}
        height={80}
        className="max-h-full max-w-full object-contain"
        unoptimized={remote}
      />
    </span>
  );

  const href = entry.href?.trim();
  if (href) {
    const internal = href.startsWith("/") || href.startsWith("#");
    const className =
      "inline-flex items-center justify-center opacity-90 transition-opacity hover:opacity-100";
    if (internal) {
      return (
        <Link href={href} className={className} aria-label={entry.name}>
          {image}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`${entry.name} (opens in new tab)`}
      >
        {image}
      </a>
    );
  }

  return (
    <span className="inline-flex items-center justify-center">{image}</span>
  );
}

export function GtpLogoTiersBand({ variant, band }: GtpLogoTiersBandProps) {
  const styles = variantStyles[variant];
  const reduceMotion = useReducedMotion();
  const tiers = GTP_LOGO_TIER_KEYS.map((key) => ({
    key,
    label: GTP_LOGO_TIER_LABELS[key],
    logos: band.tiers[key].filter(
      (x) => Boolean(x.logoUrl?.trim() && x.name?.trim()),
    ),
  }));

  const noticeHref = band.noticeLinkHref.trim();
  const noticeIsInternal =
    noticeHref.startsWith("/") || noticeHref.startsWith("#");
  const inviteHeadline = cleanInviteHeadline(band.noticeBeforeLink, variant);
  const inviteCtaLabel = cleanInviteCtaLabel(band.noticeLinkText);

  const ctaButton = (
    <Button
      variant="gtpSecondary"
      size="lg"
      className="border-0 bg-white text-gtp-dark-teal shadow-md hover:bg-white/95 hover:text-gtp-dark-teal"
      asChild
    >
      {noticeIsInternal ? (
        <Link href={noticeHref}>
          {inviteCtaLabel}
          <ArrowRight className="ml-2 inline h-4 w-4" />
        </Link>
      ) : (
        <a href={noticeHref} target="_blank" rel="noopener noreferrer">
          {inviteCtaLabel}
          <ArrowRight className="ml-2 inline h-4 w-4" />
        </a>
      )}
    </Button>
  );

  return (
    <SectionWrapper
      title={band.title}
      subtitle={band.subtitle}
      theme="gtp"
      background={styles.background}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 sm:gap-12">
        {tiers.map((tier) => (
          <div key={tier.key} className="w-full">
            <TierHeader
              tier={tier.key}
              label={tier.label}
              chipClassName={styles.chipClassName}
              ruleClassName={styles.ruleClassName}
              reduceMotion={reduceMotion}
            />
            {tier.logos.length > 0 ? (
              <motion.ul
                className="mt-10 flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-8 p-0 py-2 sm:mt-12 sm:gap-x-12 sm:py-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.08,
                      delayChildren: reduceMotion ? 0 : 0.28,
                    },
                  },
                }}
              >
                {tier.logos.map((entry, i) => (
                  <motion.li
                    key={`${tier.key}-${entry.name}-${i}`}
                    variants={{
                      hidden: reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 18, scale: 0.88, rotate: -2 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotate: 0,
                        transition: {
                          type: "spring",
                          stiffness: 160,
                          damping: 16,
                        },
                      },
                    }}
                  >
                    <GtpLogoTierCell entry={entry} />
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                className="mt-10 flex justify-center py-2 sm:mt-12 sm:py-3"
                initial={
                  reduceMotion ? false : { opacity: 0, y: 12, scale: 0.94 }
                }
                whileInView={
                  reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
                }
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  type: "spring",
                  ...scphSpring,
                  delay: 0.25,
                }}
              >
                <p
                  className={cn(
                    "inline-flex w-fit items-center justify-center rounded-full border border-dashed px-6 py-2.5 text-center text-sm tracking-wide text-gray-400 sm:px-7 sm:py-3 sm:text-[0.9375rem]",
                    variant === "partners"
                      ? "border-gtp-teal/25 bg-white/60"
                      : "border-gtp-dark-teal/15 bg-gray-50/80",
                  )}
                >
                  Coming soon
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.div
        className={cn(
          "relative mx-auto mt-14 w-full max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br px-6 py-10 text-center sm:mt-16 sm:px-10 sm:py-12",
          styles.stripClassName,
        )}
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 28, scale: 0.97, borderRadius: "1.75rem" }
        }
        whileInView={
          reduceMotion
            ? undefined
            : { opacity: 1, y: 0, scale: 1, borderRadius: "1rem" }
        }
        viewport={{ once: true, amount: 0.35 }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <InviteStripShapes />
        </motion.div>
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", ...scphSpring, delay: 0.18 }}
        >
          <motion.div
            className={cn(
              "flex size-12 items-center justify-center rounded-full sm:size-14",
              styles.inviteIconWrapClassName,
            )}
            initial={reduceMotion ? false : { scale: 0.6, rotate: -12 }}
            whileInView={reduceMotion ? undefined : { scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 14,
              delay: 0.28,
            }}
          >
            <Handshake className="size-6 sm:size-7" aria-hidden />
          </motion.div>
          <h3 className="mt-5 font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {inviteHeadline}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {styles.inviteSupport}
          </p>
          <div className="mt-7">{ctaButton}</div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
