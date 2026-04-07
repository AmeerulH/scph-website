import Image from "next/image";
import Link from "next/link";
import { Mail, ExternalLink, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type {
  FooterNavLinkResolved,
  GtpFooterContactRowResolved,
  GtpFooterResolved,
} from "@/sanity/footer-types";

function isProbablyExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function GtpFooterNavLink({ link }: { link: FooterNavLinkResolved }) {
  const external =
    link.openInNewTab || isProbablyExternalHref(link.href);
  if (external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white/70 transition-colors hover:text-white"
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
      {link.label}
    </Link>
  );
}

function bannerUsesUnoptimized(src: string): boolean {
  const lower = src.toLowerCase();
  return lower.includes(".svg");
}

function GtpFooterBannerStrip({ banner }: Pick<GtpFooterResolved, "banner">) {
  const className =
    "h-auto w-full max-h-14 object-contain object-center sm:max-h-16 md:max-h-20 lg:max-h-24";

  if (banner.source === "static") {
    return (
      <Image
        src={banner.src}
        alt={banner.alt}
        width={banner.width}
        height={banner.height}
        className={className}
        unoptimized
      />
    );
  }

  const w = banner.width ?? 1901;
  const h = banner.height ?? 101;
  return (
    <Image
      src={banner.url}
      alt={banner.alt}
      width={w}
      height={h}
      className={className}
      unoptimized={bannerUsesUnoptimized(banner.url)}
    />
  );
}

function GtpFooterContactRowView({ row }: { row: GtpFooterContactRowResolved }) {
  if (row.rowType === "email") {
    return (
      <li className="flex items-start gap-2 text-sm text-white/70">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
        <a
          href={`mailto:${row.text}`}
          className="break-all transition-colors hover:text-white"
        >
          {row.text}
        </a>
      </li>
    );
  }
  if (row.rowType === "sitePlain") {
    return (
      <li className="flex items-start gap-2 text-sm text-white/50">
        <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal/70" />
        <span title="Coming soon">{row.text}</span>
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2 text-sm text-white/70">
      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
      <a
        href={row.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 transition-colors hover:text-white"
      >
        {row.text}
        <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
      </a>
    </li>
  );
}

export function GtpFooter({ data }: { data: GtpFooterResolved }) {
  return (
    <footer className="relative overflow-hidden bg-gtp-dark-teal text-white">
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-0 aspect-square h-1/2 min-h-36 max-h-128 overflow-hidden"
        aria-hidden
      >
        <Image
          src="/images/gtp/footer-gtp-mark.svg"
          alt=""
          width={1417}
          height={1347}
          unoptimized
          className="absolute left-0 top-0 h-[240%] w-auto max-w-none select-none opacity-[0.22]"
        />
      </div>

      <div className="relative z-10 mx-auto min-w-0 max-w-7xl px-6 pt-16 pb-0 lg:px-8">
        <div className="w-full min-w-0 px-0.5 pb-1 sm:px-1">
          <div className="mx-auto flex w-full max-w-6xl justify-center px-2">
            <GtpFooterBannerStrip banner={data.banner} />
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {data.quickLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <GtpFooterNavLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Contact
            </h3>
            <ul className="space-y-3">
              {data.contactRows.map((row, i) => (
                <GtpFooterContactRowView key={i} row={row} />
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              {data.socialLinks.map(({ iconSrc, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-200 hover:border-white/60 hover:opacity-100"
                >
                  <Image
                    src={iconSrc}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain brightness-0 invert opacity-80"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="-mx-6 mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 pl-6 pr-6 text-xs text-white/40 lg:-mx-8 lg:pl-8 lg:pr-8">
          <div className="flex flex-col gap-4 text-center md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-x-8 md:gap-y-2 md:text-left lg:gap-x-10">
            <p>{data.copyrightLine}</p>
            <p>
              {data.hostedByPrefix}{" "}
              <a
                href={data.hostedByUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-white/70"
              >
                {data.hostedByLabel}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>

        <div className="h-4 lg:h-5" aria-hidden />
      </div>
    </footer>
  );
}
