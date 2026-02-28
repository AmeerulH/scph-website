import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, CalendarDays, Linkedin, Twitter, Instagram, Youtube, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "About", href: "/events/gtp-2026/about" },
  { label: "Organising Committee", href: "/events/gtp-2026/organising-committee" },
  { label: "Programmes", href: "/events/gtp-2026/programmes" },
  { label: "Biz Forum", href: "/events/gtp-2026/biz-forum" },
  { label: "Media", href: "/events/gtp-2026/media" },
  { label: "Get Involved", href: "/events/gtp-2026/get-involved" },
];

const importantDates = [
  { label: "Abstract Submission Opens", date: "TBC" },
  { label: "Abstract Submission Deadline", date: "TBC" },
  { label: "Registration Opens", date: "TBC" },
  { label: "Early Bird Deadline", date: "TBC" },
  { label: "Conference Dates", date: "2026, Kuala Lumpur" },
];

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter / X" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function GtpFooter() {
  return (
    <footer className="bg-gtp-dark-teal text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Top — Three logos */}
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          <Link href="/events/gtp-2026/about" className="shrink-0">
            <Image
              src="/images/gtp/logo.png"
              alt="Global Tipping Points 2026"
              width={200}
              height={80}
              className="h-20 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <div className="hidden h-14 w-px bg-white/20 md:block" />
          <Link href="/" className="shrink-0">
            <Image
              src="/images/scph/logo.png"
              alt="Sunway Centre for Planetary Health"
              width={200}
              height={60}
              className="h-12 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <div className="hidden h-14 w-px bg-white/20 md:block" />
          <Image
            src="/images/scph/sunway-uni-logo-white.png"
            alt="Sunway University"
            width={200}
            height={60}
            className="h-14 w-auto object-contain"
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
                  <span className="text-xs font-medium text-white/50">{label}</span>
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
                <span>info@gtp2026.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                <span>12–15 October 2026</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gtp-teal" />
                <span>Kuala Lumpur, Malaysia</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all duration-200 hover:border-white/60 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
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
