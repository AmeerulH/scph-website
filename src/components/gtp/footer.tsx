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
  { label: "Business Forum", href: "/events/gtp-2026/biz-forum" },
  { label: "Media", href: "/events/gtp-2026/media" },
  { label: "Get Involved", href: "/events/gtp-2026/get-involved" },
  { label: "Submissions", href: "/events/gtp-2026/submissions" },
];

const importantDates = [
  { label: "Action Workshop Submission Deadline", date: "27 April 2026" },
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
    <footer className="bg-gtp-dark-teal text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Top — Logo row (no separators) */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-14">
          <Link href="/events/gtp-2026/about" className="shrink-0">
            <Image
              src="/images/gtp/logo-blue-wide.svg"
              alt="Global Tipping Points 2026"
              width={220}
              height={48}
              className="h-9 w-auto object-contain brightness-0 invert sm:h-11 md:h-16"
            />
          </Link>
          <Image
            src="/images/gtp/logos/exeter-gsi.png"
            alt="University of Exeter — Global Systems Institute"
            width={180}
            height={60}
            className="h-9 w-auto object-contain brightness-0 invert sm:h-11 md:h-16"
          />
          <Link href="/" className="shrink-0">
            <Image
              src="/images/gtp/logos/scph-white.png"
              alt="Sunway Centre for Planetary Health"
              width={180}
              height={60}
              className="h-9 w-auto object-contain sm:h-11 md:h-16"
            />
          </Link>
          <Image
            src="/images/gtp/logos/sunway-uni-white.png"
            alt="Sunway University"
            width={180}
            height={60}
            className="h-9 w-auto object-contain sm:h-11 md:h-16"
          />
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

        <Separator className="my-10 bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/40 md:flex-row">
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
    </footer>
  );
}
