import Image from "next/image";
import Link from "next/link";
import { Mail, ExternalLink, Globe } from "lucide-react";
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
  {
    icon: "/images/gtp/social/fb.png",
    href: "https://www.facebook.com/SunwayCPH",
    label: "Facebook",
  },
  {
    icon: "/images/gtp/social/ig.png",
    href: "https://www.instagram.com/sunwaycph/",
    label: "Instagram",
  },
  {
    icon: "/images/gtp/social/li.png",
    href: "https://my.linkedin.com/showcase/sunway-centre-for-planetary-health/",
    label: "LinkedIn",
  },
  {
    icon: "/images/gtp/social/tt.png",
    href: "https://www.tiktok.com/@sunwaycph?is_from_webapp=1&sender_device=pc",
    label: "TikTok",
  },
  {
    icon: "/images/gtp/social/x.png",
    href: "https://x.com/SunwayCPH",
    label: "X / Twitter",
  },
  {
    icon: "/images/gtp/social/yt.png",
    href: "https://www.youtube.com/@sunwaycentreforplanetaryhe8898",
    label: "YouTube",
  },
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
        {/* Single combined partner / host logo strip (not linked) */}
        <div className="w-full min-w-0 px-0.5 pb-1 sm:px-1">
          <div className="mx-auto flex w-full max-w-6xl justify-center px-2">
            <Image
              src="/images/gtp/footer-partner-logos.svg"
              alt="Global Tipping Points Conference 2026 — hosts and partners"
              width={1901}
              height={101}
              className="h-auto w-full max-h-14 object-contain object-center sm:max-h-16 md:max-h-20 lg:max-h-24"
              unoptimized
            />
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
              <li className="flex items-start gap-2 text-sm text-white/50">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal/70" />
                <span title="Coming soon">www.sunwayplanetaryhealth.com.my</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                <a
                  href="https://www.globaltippingpoints.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-white"
                >
                  www.globaltippingpoints.org
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
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
        <div className="-mx-6 mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 pl-6 pr-6 text-xs text-white/40 lg:-mx-8 lg:pl-8 lg:pr-8">
          <div className="flex flex-col gap-4 text-center md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-x-8 md:gap-y-2 md:text-left lg:gap-x-10">
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
        </div>

        <div className="h-4 lg:h-5" aria-hidden />
      </div>
    </footer>
  );
}
