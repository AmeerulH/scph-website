import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, CalendarDays, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "About", href: "/events/gtp-2026/about" },
  {
    label: "Organising Committee",
    href: "/events/gtp-2026/organising-committee",
  },
  { label: "Programme", href: "/events/gtp-2026/programmes" },
  { label: "FAQ", href: "/events/gtp-2026/faq" },
  { label: "Get Involved", href: "/events/gtp-2026/get-involved" },
  { label: "Submissions", href: "/events/gtp-2026/submissions" },
];

const importantDates = [
  { label: "Action Workshop Submission Deadline", date: "8 May 2026" },
  { label: "Abstract Submission Deadline", date: "15 May 2026" },
  { label: "Registration Opens", date: "TBC" },
  { label: "Early Bird Registration", date: "TBC" },
];

const socialLinks = [
  { icon: "/images/gtp/social/fb.png", href: "#", label: "Facebook" },
  { icon: "/images/gtp/social/ig.png", href: "#", label: "Instagram" },
  { icon: "/images/gtp/social/li.png", href: "#", label: "LinkedIn" },
  { icon: "/images/gtp/social/tt.png", href: "#", label: "TikTok" },
  { icon: "/images/gtp/social/x.png", href: "#", label: "X / Twitter" },
  { icon: "/images/gtp/social/yt.png", href: "#", label: "YouTube" },
];

export function GtpFooter() {
  return (
    <footer className="relative overflow-hidden bg-gtp-dark-teal text-white">
      {/* Cropped GTP mark: clip ≈50% of footer height; SVG oversized so only top-left of art shows */}
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
        {/* Top — mobile: wrap, no horizontal scroll; md+: single centered row with scroll only if needed */}
        <div className="w-full min-w-0 overflow-x-visible pb-1 md:overflow-x-auto md:[-ms-overflow-style:none] md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden px-0.5 sm:px-1">
          <div className="mx-auto flex w-full max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-5 sm:gap-x-2.5 md:w-max md:max-w-none md:flex-nowrap md:gap-x-3 md:gap-y-0 lg:gap-x-4">
            <Link
              href="/events/gtp-2026/about"
              className="flex h-14 shrink-0 items-center max-md:basis-full max-md:justify-center sm:h-18 md:h-20"
            >
              <Image
                src="/images/gtp/logo-blue-wide.svg"
                alt="Global Tipping Points 2026"
                width={288}
                height={38}
                className="h-[76%] w-auto max-h-full max-w-[min(92vw,18rem)] object-contain object-center brightness-0 invert sm:h-[78%] sm:max-w-[min(48vw,13.5rem)] md:h-[80%] md:max-w-56 lg:max-w-60 xl:max-w-64"
              />
            </Link>
            <span className="inline-flex h-14 shrink-0 items-center justify-center overflow-visible rounded-sm bg-gtp-dark-teal px-4 py-1.5 max-md:basis-[calc(50%-0.25rem)] max-md:min-w-0 sm:h-18 sm:px-7 sm:py-2 md:h-20 md:basis-auto md:px-9 md:py-2.5">
              <Image
                src="/images/gtp/logos/exeter-gsi-lockup.png"
                alt="University of Exeter — Global Systems Institute"
                width={1024}
                height={602}
                className="h-[85%] w-auto max-w-full object-contain object-center mix-blend-screen sm:max-w-[min(38vw,13rem)] md:h-[88%] md:max-w-[min(36vw,15rem)] lg:max-w-68"
              />
            </span>
            <Link
              href="/"
              className="flex h-14 shrink-0 items-center max-md:basis-[calc(50%-0.25rem)] max-md:min-w-0 max-md:justify-center sm:h-18 md:h-20 md:basis-auto"
            >
              <Image
                src="/images/scph/logo-mixcolor.png"
                alt="Sunway Centre for Planetary Health"
                width={180}
                height={60}
                className="h-full w-auto max-h-full max-w-full object-contain object-center sm:max-w-40 md:max-w-none"
              />
            </Link>
            <span className="inline-flex h-14 shrink-0 items-center justify-center overflow-visible rounded-sm bg-gtp-dark-teal px-4 py-1.5 max-md:basis-full max-md:justify-center sm:h-18 sm:px-7 sm:py-2 md:h-20 md:basis-auto md:px-9 md:py-2.5">
              <Image
                src="/images/gtp/logos/sunway-uni-white.png"
                alt="Sunway University"
                width={360}
                height={120}
                className="h-[85%] w-auto max-w-[min(88vw,20rem)] object-contain mix-blend-screen sm:max-w-[min(38vw,12rem)] md:h-[88%] md:max-w-[min(36vw,14rem)] lg:max-w-68"
              />
            </span>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Middle — Link columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Dates */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Important Dates
            </h3>
            <ul className="space-y-3">
              {importantDates.map(({ label, date }) => (
                <li key={label} className="flex flex-col">
                  <span className="text-xs font-medium text-white/50">
                    {label}
                  </span>
                  <span className="text-sm text-white/80">{date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                <span>scph_gtpc2026@sunway.edu.my</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                <span>12–15 October 2026</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                <span>Sunway University, Malaysia</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-200 hover:border-white/60 hover:opacity-100"
                >
                  <Image
                    src={icon}
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

        {/* Bottom bar */}
        <div className="-mx-6 mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 pl-6 pr-0 text-xs text-white/40 lg:-mx-8 lg:pl-8 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-6 md:gap-y-2">
          <div className="flex flex-col gap-4 text-center md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-2 md:text-left lg:gap-x-10">
            <p>© 2026 Global Tipping Points Conference. All rights reserved.</p>
            <p>
              Hosted by{" "}
              <a
                href="https://sunwayuniversity.edu.my/research/planetaryhealth"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-white/70"
              >
                Sunway Centre for Planetary Health
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
          <a
            href="https://global-tipping-points.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="m-0 flex shrink-0 justify-center p-0 leading-0 md:justify-end"
            aria-label="Global Tipping Points (opens in a new tab)"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gtp/logo-blue-wide.svg"
              alt=""
              width={288}
              height={38}
              decoding="async"
              className="m-0 block h-7 w-auto max-w-none brightness-0 invert opacity-90 transition-opacity hover:opacity-100"
            />
          </a>
        </div>

        <div className="h-4 lg:h-5" aria-hidden />
      </div>
    </footer>
  );
}
