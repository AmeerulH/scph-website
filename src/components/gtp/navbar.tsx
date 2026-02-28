"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "SCPH", href: "/" },
  {
    label: "Organising Committee",
    href: "/events/gtp-2026/organising-committee",
  },
  { label: "Programmes", href: "/events/gtp-2026/programmes" },
  { label: "Biz Forum", href: "/events/gtp-2026/biz-forum" },
  { label: "Media", href: "/events/gtp-2026/media" },
  { label: "Get Involved", href: "/events/gtp-2026/get-involved" },
];

const ctaLinks = [
  { label: "Registration", href: "/events/gtp-2026/get-involved" },
  { label: "Call for Abstracts", href: "/events/gtp-2026/get-involved" },
  { label: "Call for Proposals", href: "/events/gtp-2026/get-involved" },
  { label: "Contact Us", href: "/events/gtp-2026/get-involved" },
];

export function GtpNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeSheet = () => setSheetOpen(false);

  return (
    <header className="fixed inset-x-2 top-4 z-50 flex justify-center md:inset-x-4">
      <nav
        className={cn(
          "flex w-full max-w-7xl items-center justify-between gap-6 rounded-full border border-white/20 px-4 py-2 transition-all duration-300",
          scrolled
            ? "bg-gtp-dark-teal/90 shadow-xl backdrop-blur-xl"
            : "bg-gtp-dark-teal/75 shadow-lg backdrop-blur-xl",
        )}
      >
        {/* GTP wordmark */}
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
                  : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button variant="gtpCta" size="sm" asChild>
            <Link href="/events/gtp-2026/get-involved">Register Now</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-80 flex-col border-gtp-dark-teal/20 bg-gtp-dark-teal p-0 text-white"
          >
            {/* Sheet header — fixed, never scrolls */}
            <div className="shrink-0 border-b border-white/10 px-6 py-5">
              <SheetTitle className="font-heading text-lg font-bold tracking-wide text-white">
                GTP 2026
              </SheetTitle>
              <SheetDescription className="mt-0.5 text-xs text-white/50">
                Global Tipping Points Conference
              </SheetDescription>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Sheet nav links */}
              <nav className="flex flex-col px-4 py-4">
                {navLinks.map(({ label, href }) => (
                  <SheetClose asChild key={label}>
                    <Link
                      href={href}
                      onClick={closeSheet}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        isActive(href)
                          ? "bg-white/15 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <Separator className="mx-4 bg-white/10" />

              {/* Sheet CTAs */}
              <div className="flex flex-col gap-3 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                  Get Involved
                </p>
                {ctaLinks.map(({ label, href }) => (
                  <SheetClose asChild key={label}>
                    <Button
                      variant="gtpCta"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={href} onClick={closeSheet}>
                        {label}
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
