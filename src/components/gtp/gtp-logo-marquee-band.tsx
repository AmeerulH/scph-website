import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import {
  PartnerMarquee,
  PartnerLogoPlaceholder,
  type PartnerMarqueeSlot,
} from "@/components/sections/partner-marquee";
import { PlaceholderNotice } from "@/components/sections/placeholder-notice";
import type { GtpAboutSponsorLogoEntry } from "@/data/gtp-about-page-defaults";
import { cn } from "@/lib/utils";

export type GtpLogoMarqueeBandProps = {
  variant: "sponsors" | "partners";
  title: string;
  subtitle: string;
  logos: GtpAboutSponsorLogoEntry[];
  noticeBeforeLink: string;
  noticeLinkText: string;
  noticeLinkHref: string;
  /** Static fallback strip when CMS rows are empty (e.g. PIK on partners). */
  renderFallbackRow?: (slot: PartnerMarqueeSlot) => ReactNode;
  rowMinSlots?: number;
};

const ROW_MIN_SLOTS = 8;

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
    placeholderLabel: "Sponsor Logo",
    noticeClassName: undefined,
    linkClassName: "font-semibold text-gtp-dark-teal hover:underline",
    logoShellClassName:
      "mr-4 flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm transition-opacity hover:opacity-90",
    placeholderClassName: "border-gray-100 bg-gray-50",
  },
  partners: {
    background: "muted" as const,
    placeholderLabel: "Partner Logo",
    noticeClassName: "text-gray-500",
    linkClassName: "font-semibold text-gtp-teal hover:underline",
    logoShellClassName:
      "mr-4 flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-gtp-teal/15 bg-white px-3 py-2 shadow-sm ring-1 ring-gtp-teal/10 transition-opacity hover:opacity-90",
    placeholderClassName: "border-gtp-teal/15 bg-white ring-1 ring-gtp-teal/10",
  },
};

function GtpLogoMarqueeCell({
  entry,
  shellClassName,
}: {
  entry: GtpAboutSponsorLogoEntry;
  shellClassName: string;
}) {
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

  const href = entry.href?.trim();
  if (href) {
    const internal = href.startsWith("/") || href.startsWith("#");
    if (internal) {
      return (
        <Link href={href} className={shellClassName}>
          {card}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={shellClassName}
        aria-label={`${entry.name} (opens in new tab)`}
      >
        {card}
      </a>
    );
  }

  return <div className={shellClassName}>{card}</div>;
}

export function GtpPikPartnerLogo({
  shellClassName,
}: {
  shellClassName?: string;
}) {
  return (
    <a
      href="https://www.pik-potsdam.de/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "mr-4 flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-gtp-teal/15 bg-white px-3 py-2 shadow-sm ring-1 ring-gtp-teal/10 transition-opacity hover:opacity-90",
        shellClassName,
      )}
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

export function GtpLogoMarqueeBand({
  variant,
  title,
  subtitle,
  logos,
  noticeBeforeLink,
  noticeLinkText,
  noticeLinkHref,
  renderFallbackRow,
  rowMinSlots = ROW_MIN_SLOTS,
}: GtpLogoMarqueeBandProps) {
  const styles = variantStyles[variant];
  const cmsLogos = logos.filter((x) => x.logoUrl?.trim() && x.name?.trim());
  const useCmsMarquee = cmsLogos.length > 0;
  const placeholderPadCount = useCmsMarquee
    ? Math.max(0, rowMinSlots - cmsLogos.length)
    : 0;

  const noticeHref = noticeLinkHref.trim();
  const noticeIsInternal =
    noticeHref.startsWith("/") || noticeHref.startsWith("#");

  return (
    <SectionWrapper
      title={title}
      subtitle={subtitle}
      theme="gtp"
      background={styles.background}
    >
      <PartnerMarquee
        maskClassName="px-1 py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:py-4"
        forwardStripClassName="mb-5"
        renderRow={(slot) => (
          <>
            {useCmsMarquee ? (
              <>
                {cmsLogos.map((entry, i) => (
                  <GtpLogoMarqueeCell
                    key={`${slot}-${entry.name}-${i}`}
                    entry={entry}
                    shellClassName={styles.logoShellClassName}
                  />
                ))}
                {Array.from({ length: placeholderPadCount }, (_, i) => (
                  <PartnerLogoPlaceholder
                    key={`${slot}-cms-pad-${i}`}
                    elevated
                    label={styles.placeholderLabel}
                    className={styles.placeholderClassName}
                  />
                ))}
              </>
            ) : renderFallbackRow ? (
              renderFallbackRow(slot)
            ) : (
              Array.from({ length: rowMinSlots }, (_, i) => (
                <PartnerLogoPlaceholder
                  key={`${slot}-ph-${i}`}
                  elevated
                  label={styles.placeholderLabel}
                  className={styles.placeholderClassName}
                />
              ))
            )}
          </>
        )}
      />

      <PlaceholderNotice className={styles.noticeClassName}>
        {noticeBeforeLink}
        {noticeIsInternal ? (
          <Link href={noticeHref} className={styles.linkClassName}>
            {noticeLinkText}
          </Link>
        ) : (
          <a
            href={noticeHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkClassName}
          >
            {noticeLinkText}
          </a>
        )}
      </PlaceholderNotice>
    </SectionWrapper>
  );
}
