import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, ExternalLink, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Media", href: "/media" },
  { label: "Network", href: "/network" },
];

const eventLinks = [
  { label: "GTP 2026", href: "/events/gtp-2026", external: false },
  { label: "PHAM 2024", href: "https://www.pham2024.com/", external: true },
];

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter / X" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function ScphFooter() {
  return (
    <footer className="bg-scph-blue text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Top row — branding + tagline */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Image
              src="/images/scph/logo.png"
              alt="Sunway Centre for Planetary Health"
              width={180}
              height={60}
              className="h-auto w-auto brightness-0 invert"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Advancing planetary health through research, advocacy, and
              action — committed to healthy cities, health-centred
              decarbonisation, and driving an education revolution.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex gap-3">
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

        <Separator className="my-10 bg-white/10" />

        {/* Middle — link columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
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

          {/* Events */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Events
            </h3>
            <ul className="space-y-2.5">
              {eventLinks.map(({ label, href, external }) => (
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

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                <span>info@scph.sunway.edu.my</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-scph-green" />
                <span>
                  Sunway University<br />
                  Subang Jaya, Selangor<br />
                  Malaysia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/40 md:flex-row">
          <p>© 2026 Sunway Centre for Planetary Health. All rights reserved.</p>
          <p>Part of Sunway University, Kuala Lumpur</p>
        </div>
      </div>
    </footer>
  );
}
