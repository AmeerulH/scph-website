import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type {
  FooterNavLinkResolved,
  ScphFooterResolved,
} from "@/sanity/footer-types";

function isProbablyExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function ScphFooterNavLink({ link }: { link: FooterNavLinkResolved }) {
  const external =
    link.openInNewTab || isProbablyExternalHref(link.href);
  if (external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
      >
        {link.label}
        <ExternalLink className="h-3 w-3 opacity-60" />
      </a>
    );
  }
  return (
    <Link
      href={link.href}
      prefetch={false}
      className="text-sm text-white/70 transition-colors hover:text-white"
    >
      {link.label}
    </Link>
  );
}

function ScphFooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: FooterNavLinkResolved[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <ScphFooterNavLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScphFooter({ data }: { data: ScphFooterResolved }) {
  const addressLines = data.address.split(/\r?\n/).filter((l) => l.trim());

  const logoSizes =
    data.logo.width && data.logo.height
      ? { width: data.logo.width, height: data.logo.height }
      : { width: 180, height: 60 };

  const bottomSizes =
    data.bottomLogo.width && data.bottomLogo.height
      ? { width: data.bottomLogo.width, height: data.bottomLogo.height }
      : { width: 360, height: 120 };

  const logoRemote = data.logo.src.startsWith("http");
  const bottomRemote = data.bottomLogo.src.startsWith("http");

  return (
    <footer className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-scph-green via-scph-blue to-scph-dark-green" />

      <div className="bg-scph-blue text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Image
                src={data.logo.src}
                alt={data.logo.alt}
                width={logoSizes.width}
                height={logoSizes.height}
                className="h-auto w-auto"
                unoptimized={logoRemote && data.logo.src.toLowerCase().includes(".svg")}
              />
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
                {data.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
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

          <Separator className="my-10 bg-white/10" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <ScphFooterLinkColumn
              title={data.columnQuick.title}
              links={data.columnQuick.links}
            />
            <ScphFooterLinkColumn
              title={data.columnCommunity.title}
              links={data.columnCommunity.links}
            />
            <ScphFooterLinkColumn
              title={data.columnConferences.title}
              links={data.columnConferences.links}
            />

            <div className="min-w-0">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-white/70">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                  <a
                    href={`mailto:${data.contactEmail}`}
                    className="break-all transition-colors hover:text-white"
                  >
                    {data.contactEmail}
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/70">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                  <span>
                    {addressLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < addressLines.length - 1 ? (
                          <>
                            <br />
                          </>
                        ) : null}
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/70">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                  <a
                    href={`tel:${data.phoneTel.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-white"
                  >
                    {data.phoneDisplay}
                  </a>
                </li>
              </ul>

              <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                Career Opportunities
              </h3>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                <a
                  href={`mailto:${data.careerEmail}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {data.careerEmail}
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-10 bg-white/10" />

          <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/40 md:flex-row">
            <p>{data.copyrightLine}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
              <span className="shrink-0">{data.partOfLabel}</span>
              <span className="inline-flex shrink-0 items-center overflow-visible py-0.5">
                <Image
                  src={data.bottomLogo.src}
                  alt={data.bottomLogo.alt}
                  width={bottomSizes.width}
                  height={bottomSizes.height}
                  className="h-12 w-auto max-w-[min(90vw,22rem)] object-contain mix-blend-lighten sm:h-14 md:h-16"
                  unoptimized={
                    bottomRemote &&
                    data.bottomLogo.src.toLowerCase().includes(".svg")
                  }
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
