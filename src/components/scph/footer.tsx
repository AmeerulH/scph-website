import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

/** Same PNG icons and profile URLs as `src/components/gtp/footer.tsx`. */
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
  { label: "GTP 2026", href: "/events/gtp-2026/about", external: false },
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

            {/* Social icons — same PNGs + styling as GTP footer */}
            <div className="flex flex-wrap gap-3">
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
                        prefetch={false}
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
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
              <span className="shrink-0">Part of</span>
              <span className="inline-flex shrink-0 items-center overflow-visible py-0.5">
                <Image
                  src="/images/gtp/logos/sunway-uni-white.png"
                  alt="Sunway University"
                  width={360}
                  height={120}
                  className="h-12 w-auto max-w-[min(90vw,22rem)] object-contain mix-blend-lighten sm:h-14 md:h-16"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
