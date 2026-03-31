import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Social icon components for platforms not in lucide-react
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

const socialLinks = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: TikTokIcon, href: "#", label: "TikTok" },
  { Icon: XIcon, href: "#", label: "X (Twitter)" },
  { Icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube" },
];

const quickLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Programmes", href: "/programmes" },
  { label: "Research", href: "/research" },
  { label: "Media", href: "/media" },
];

const communityLinks = [
  { label: "Media Professional Network", href: "/network" },
  { label: "Youth Action Network", href: "/network" },
];

const conferenceLinks = [
  { label: "GTP 2026", href: "/events/gtp-2026", external: false },
  { label: "PHAM 2024", href: "https://www.pham2024.com/", external: true },
];

export function ScphFooter() {
  return (
    <footer className="overflow-hidden">
      {/* Gradient header bar */}
      <div className="h-2 bg-gradient-to-r from-scph-green via-scph-blue to-scph-dark-green" />

      <div className="bg-scph-blue text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          {/* Top row — branding + tagline + social */}
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              {/* Logo — use logo-mixcolor.png once provided, falls back to current */}
              <Image
                src="/images/scph/logo-mixcolor.png"
                alt="Sunway Centre for Planetary Health"
                width={180}
                height={60}
                className="h-auto w-auto"
              />
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Sunway Centre for Planetary Health is a &ldquo;Think-and-Do&rdquo; tank,
                committed to research and advocacy that advances planetary
                health through three priority areas: healthy cities,
                health-centred decarbonisation, and driving an education
                revolution.
              </p>
            </div>

            {/* Social icons — square with rounded corners */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/70 transition-all duration-200 hover:border-white/60 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <Separator className="my-10 bg-white/10" />

          {/* Link columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
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

            {/* Community */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                Community
              </h3>
              <ul className="space-y-2.5">
                {communityLinks.map(({ label, href }) => (
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

            {/* Conferences */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                Conferences
              </h3>
              <ul className="space-y-2.5">
                {conferenceLinks.map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {label}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="min-w-0">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-white/70">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                  <a
                    href="mailto:scph@sunway.edu.my"
                    className="break-all transition-colors hover:text-white"
                  >
                    scph@sunway.edu.my
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/70">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                  <span>
                    Sunway University, 5, Jalan Universiti,<br />
                    Bandar Sunway, 47500,<br />
                    Petaling Jaya, Selangor, Malaysia
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/70">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                  <a
                    href="tel:+60374918622"
                    className="transition-colors hover:text-white"
                  >
                    03 – 7491 8622
                  </a>
                </li>
              </ul>

              <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                Career Opportunities
              </h3>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                <a
                  href="mailto:scphcareer@sunway.edu.my"
                  className="break-all transition-colors hover:text-white"
                >
                  scphcareer@sunway.edu.my
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-10 bg-white/10" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/40 md:flex-row">
            <p>© 2026 Sunway Centre for Planetary Health. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span>Part of</span>
              <Image
                src="/images/scph/sunway-uni-logo-white.png"
                alt="Sunway University"
                width={100}
                height={30}
                className="h-6 w-auto object-contain opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
