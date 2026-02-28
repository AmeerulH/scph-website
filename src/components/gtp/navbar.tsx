"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Organising Committee", href: "/events/gtp-2026/organising-committee" },
  { label: "Programmes", href: "/events/gtp-2026/programmes" },
  { label: "Biz Forum", href: "/events/gtp-2026/biz-forum" },
  { label: "Media", href: "/events/gtp-2026/media" },
  { label: "Get Involved", href: "/events/gtp-2026/get-involved" },
];

export function GtpNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-4 top-4 z-50 flex justify-center">
      <nav
        className={cn(
          "flex w-full max-w-7xl items-center justify-between gap-6 rounded-full border border-white/20 px-4 py-2 transition-all duration-300",
          scrolled
            ? "bg-gtp-dark-teal/90 shadow-xl backdrop-blur-xl"
            : "bg-gtp-dark-teal/75 shadow-lg backdrop-blur-xl"
        )}
      >
        {/* GTP wordmark / home link */}
        <Link
          href="/events/gtp-2026/about"
          className="shrink-0 font-heading text-sm font-bold tracking-wide text-white/90 transition-colors hover:text-white"
        >
          GTP 2026
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-white/15 text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:block">
          <Button variant="gtpCta" size="sm" asChild>
            <Link href="/events/gtp-2026/get-involved">Register Now</Link>
          </Button>
        </div>

        {/* Mobile hamburger — placeholder, wired up in Step 8 */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:bg-white/10 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </nav>
    </header>
  );
}
