import Image from "next/image";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import {
  PartnerMarquee,
  PartnerLogoPlaceholder,
} from "@/components/sections/partner-marquee";
import { PlaceholderNotice } from "@/components/sections/placeholder-notice";
import type {
  ScphHomePartnerLogoEntry,
  ScphHomePartnersBandResolved,
} from "@/sanity/scph-home-partners";

function isRemoteImage(src: string) {
  return /^https?:\/\//i.test(src);
}

/** Match legacy home strip width (eight placeholders per row). */
const ROW_MIN_SLOTS = 8;

function PartnerLogoCell({ entry }: { entry: ScphHomePartnerLogoEntry }) {
  const remote = isRemoteImage(entry.logoUrl);
  const card = (
    <span className="flex h-full w-full items-center justify-center px-2">
      <Image
        src={entry.logoUrl}
        alt={entry.name}
        width={160}
        height={56}
        className="h-11 w-auto max-w-[9rem] object-contain"
        unoptimized={remote}
      />
    </span>
  );
  const shellClass =
    "mr-4 flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-2 py-2 transition-opacity hover:opacity-90";

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

export function ScphHomePartnersSection({
  band,
}: {
  band: ScphHomePartnersBandResolved;
}) {
  const cmsLogos = band.partnerLogos.filter(
    (x) => x.logoUrl?.trim() && x.name?.trim(),
  );
  const useCmsMarquee = cmsLogos.length > 0;
  const placeholderPadCount = useCmsMarquee
    ? Math.max(0, ROW_MIN_SLOTS - cmsLogos.length)
    : 0;

  const noticeHref = band.noticeLinkHref.trim();
  const noticeIsInternal =
    noticeHref.startsWith("/") || noticeHref.startsWith("#");

  return (
    <SectionWrapper
      title={band.title}
      subtitle={band.subtitle}
      theme="scph"
      background="default"
    >
      <PartnerMarquee
        maskClassName="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        renderRow={(slot) => (
          <>
            {useCmsMarquee ? (
              <>
                {cmsLogos.map((entry, i) => (
                  <PartnerLogoCell
                    key={`${slot}-${entry.name}-${i}`}
                    entry={entry}
                  />
                ))}
                {Array.from({ length: placeholderPadCount }, (_, i) => (
                  <PartnerLogoPlaceholder key={`${slot}-cms-pad-${i}`} />
                ))}
              </>
            ) : (
              Array.from({ length: ROW_MIN_SLOTS }, (__, n) => (
                <PartnerLogoPlaceholder key={`${slot}-${n}`} />
              ))
            )}
          </>
        )}
      />

      <PlaceholderNotice>
        {band.noticeBeforeLink}
        {noticeIsInternal ? (
          <Link
            href={noticeHref}
            className="font-semibold text-scph-blue hover:underline"
          >
            {band.noticeLinkText}
          </Link>
        ) : (
          <a
            href={noticeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-scph-blue hover:underline"
          >
            {band.noticeLinkText}
          </a>
        )}
      </PlaceholderNotice>
    </SectionWrapper>
  );
}
