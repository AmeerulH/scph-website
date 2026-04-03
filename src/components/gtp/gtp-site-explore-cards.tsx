import Image from "next/image";
import { cn } from "@/lib/utils";

export const GTP_SITE_EXPLORE_CARDS = [
  {
    title: "Governance",
    body: "We urgently need new types of governance to cope with the threat posed by Earth system tipping points.",
    href: "https://global-tipping-points.org/governance/",
    cardClass: "bg-gtp-dark-teal",
    illustration: "governance" as const,
  },
  {
    title: "Earth System Tipping Points",
    body: "Earth system tipping points pose profound risks to national security, food security, health and wellbeing.",
    href: "https://global-tipping-points.org/earth-system-tipping-points/",
    cardClass: "bg-gtp-teal",
    illustration: "earth" as const,
  },
  {
    title: "Positive tipping points",
    body: "We need to identify and trigger positive tipping points to accelerate to net zero.",
    href: "https://global-tipping-points.org/positive-tipping-points/",
    cardClass: "bg-gtp-green",
    illustration: "positive" as const,
  },
] as const;

/** Same `bg-*` utilities as the explore cards — use for theme pillars and other three-column GTP verticals. */
export const GTP_EXPLORE_VERTICAL_BG_CLASSNAMES = [
  GTP_SITE_EXPLORE_CARDS[0].cardClass,
  GTP_SITE_EXPLORE_CARDS[1].cardClass,
  GTP_SITE_EXPLORE_CARDS[2].cardClass,
] as const;

/** Explore cards: icon pair + full-bleed white baseline (same layout as global-tipping-points.org). */
function GtpExploreCardFooterArt({
  leftSrc,
  rightSrc,
  rightImageClassName,
}: {
  leftSrc: string;
  rightSrc: string;
  rightImageClassName?: string;
}) {
  const iconWell =
    "relative size-[4.75rem] shrink-0 overflow-hidden rounded-full bg-transparent sm:size-20";
  const iconFit = "object-contain object-center p-[7%] sm:p-[6%]";

  return (
    <div className="mt-auto w-full shrink-0 pt-6">
      <div className="relative">
        <div className="relative z-10 mb-[-11px] flex w-full justify-end gap-0 pr-5 sm:mb-[-12px] sm:pr-7">
          <div className={`${iconWell} z-[1]`}>
            <Image
              src={leftSrc}
              alt=""
              fill
              unoptimized
              sizes="80px"
              className={iconFit}
              aria-hidden
            />
          </div>
          <div className={`${iconWell} -ml-2.5 z-0 sm:-ml-3`}>
            <Image
              src={rightSrc}
              alt=""
              fill
              unoptimized
              sizes="80px"
              className={cn(iconFit, rightImageClassName)}
              aria-hidden
            />
          </div>
        </div>
        <div className="relative z-20 -mx-6">
          <div className="h-2.5 w-full bg-white sm:h-3" aria-hidden />
          <div className="h-3" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function GtpEarthCardFooterCurve() {
  return (
    <div className="mt-auto w-full shrink-0 pt-6">
      <div className="relative z-20 -mx-6">
        <svg
          className="block aspect-[400/134] w-full overflow-visible sm:mb-[-4px]"
          viewBox="0 -8 400 134"
          preserveAspectRatio="xMidYMax meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <foreignObject x="175" y="-55" width="76" height="76">
            <div className="relative size-full rounded-full bg-transparent">
              <Image
                src="/images/gtp/cards/light-teal-1.svg"
                alt=""
                fill
                unoptimized
                sizes="76px"
                className="object-contain object-center p-[10%]"
                aria-hidden
              />
            </div>
          </foreignObject>
          <foreignObject x="218" y="-20" width="76" height="76">
            <div className="relative size-full rounded-full bg-transparent">
              <Image
                src="/images/gtp/cards/light-teal-2.svg"
                alt=""
                fill
                unoptimized
                sizes="76px"
                className="object-contain object-center p-[10%]"
                aria-hidden
              />
            </div>
          </foreignObject>
          <path
            d="M 0 117 L 100 117 C 155 117 155 9 200 9 C 245 9 245 117 300 117 L 400 117"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-[0.625rem] sm:stroke-[0.75rem]"
          />
        </svg>
        <div className="h-3" aria-hidden />
      </div>
    </div>
  );
}

/** Positive card: hill shifted right; icons on the left ascent (trees lower, turbines higher). */
function GtpPositiveCardFooterCurve() {
  return (
    <div className="mt-auto w-full shrink-0 pt-6">
      <div className="relative z-20 -mx-6">
        <svg
          className="block aspect-[400/134] w-full overflow-visible sm:mb-[-4px]"
          viewBox="0 -8 400 134"
          preserveAspectRatio="xMidYMax meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <foreignObject x="124" y="42" width="76" height="76">
            <div className="relative size-full rounded-full bg-transparent">
              <Image
                src="/images/gtp/cards/green-1.svg"
                alt=""
                fill
                unoptimized
                sizes="76px"
                className="object-contain object-center p-[10%]"
                aria-hidden
              />
            </div>
          </foreignObject>
          <foreignObject x="174" y="-44" width="76" height="76">
            <div className="relative size-full rounded-full bg-transparent">
              <Image
                src="/images/gtp/cards/green-2.svg"
                alt=""
                fill
                unoptimized
                sizes="76px"
                className="object-contain object-center p-[10%]"
                aria-hidden
              />
            </div>
          </foreignObject>
          <path
            d="M 0 117 L 155 117 C 210 117 210 9 255 9 C 300 9 300 117 355 117 L 400 117"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-[0.625rem] sm:stroke-[0.75rem]"
          />
        </svg>
        <div className="h-3" aria-hidden />
      </div>
    </div>
  );
}

function GtpExploreCardIllustration({
  variant,
}: {
  variant: (typeof GTP_SITE_EXPLORE_CARDS)[number]["illustration"];
}) {
  if (variant === "governance") {
    return (
      <GtpExploreCardFooterArt
        leftSrc="/images/gtp/cards/teal-1.svg"
        rightSrc="/images/gtp/cards/teal-2.svg"
        rightImageClassName="object-[56%_38%] sm:object-[58%_36%]"
      />
    );
  }

  if (variant === "earth") {
    return <GtpEarthCardFooterCurve />;
  }

  if (variant === "positive") {
    return <GtpPositiveCardFooterCurve />;
  }

  return <div className="mt-auto shrink-0 pt-6" aria-hidden />;
}

export function GtpSiteExploreCardsGrid({
  topLabel = "Explore on global-tipping-points.org",
  labelClassName,
  className,
}: {
  topLabel?: string;
  /** Override label colour (e.g. on SCPH home). */
  labelClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("mt-14", className)}>
      <p
        className={cn(
          "mb-6 text-center font-heading text-sm font-semibold uppercase tracking-[0.12em] text-gtp-dark-teal/70",
          labelClassName,
        )}
      >
        {topLabel}
      </p>
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-3">
        {GTP_SITE_EXPLORE_CARDS.map(
          ({ title, body, href, cardClass, illustration }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex min-h-[380px] w-full flex-col overflow-hidden rounded-2xl p-6 shadow-lg ring-1 ring-white/15 transition-[flex-grow] duration-1000 ease-in-out md:min-h-[400px] md:min-w-0 md:flex-[1_1_0%] md:hover:flex-grow-[1.45] ${cardClass}`}
              aria-label={`${title} — opens global-tipping-points.org in a new tab`}
            >
              <h3 className="font-heading text-left text-sm font-bold uppercase tracking-[0.08em] text-white">
                {title}
              </h3>
              <div
                className={cn(
                  "mt-3 h-px shrink-0",
                  illustration === "earth"
                    ? "w-[42%] max-w-[13rem] bg-white/70"
                    : "w-12 bg-white/90",
                )}
              />
              <p className="mt-4 flex-1 text-left text-sm leading-relaxed text-white/95">
                {body}
              </p>
              <GtpExploreCardIllustration variant={illustration} />
            </a>
          ),
        )}
      </div>
    </div>
  );
}
