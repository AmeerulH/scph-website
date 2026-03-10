"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
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

// ─── Nav structure ────────────────────────────────────────────────────────────

type SimpleLink = { label: string; href: string; dropdown?: never };
type DropdownLink = {
  label: string;
  href?: never;
  dropdown: { label: string; href: string }[];
};
type NavItem = SimpleLink | DropdownLink;

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Organising Committee",
    href: "/events/gtp-2026/organising-committee",
  },
  { label: "Programme", href: "/events/gtp-2026/programmes" },
  { label: "Business Forum", href: "/events/gtp-2026/biz-forum" },
  { label: "Media", href: "/events/gtp-2026/media" },
  {
    label: "Get Involved",
    dropdown: [
      { label: "Contact Us", href: "/events/gtp-2026/get-involved#contact" },
      {
        label: "Partnership",
        href: "/events/gtp-2026/get-involved#partnership",
      },
      {
        label: "Collaboration",
        href: "/events/gtp-2026/get-involved#collaboration",
      },
    ],
  },
  {
    label: "Submissions",
    dropdown: [
      { label: "Abstract", href: "/events/gtp-2026/submissions#abstract" },
      { label: "Proposal", href: "/events/gtp-2026/submissions#proposal" },
    ],
  },
];

// ─── Desktop dropdown ─────────────────────────────────────────────────────────

function DesktopDropdown({
  label,
  items,
  isActive,
}: {
  label: string;
  items: { label: string; href: string }[];
  isActive: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          open || isActive
            ? "bg-white/15 text-white"
            : "text-white/75 hover:bg-white/10 hover:text-white",
        )}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-white/10 bg-gtp-dark-teal/95 p-1.5 shadow-xl backdrop-blur-xl">
          {items.map(({ label: itemLabel, href }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {itemLabel}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export function GtpNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [mobileExpanded, setMobileExpanded] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/"
      ? false
      : pathname.startsWith(href);

  const isDropdownActive = (items: { href: string }[]) =>
    items.some(({ href }) => pathname.startsWith(href.split("#")[0]));

  const closeSheet = () => {
    setSheetOpen(false);
    setMobileExpanded(null);
  };

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
        {/* GTP logo */}
        <Link
          href="/events/gtp-2026/about"
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label="GTP 2026 Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/gtp/logo-blue-wide.svg"
            alt="Global Tipping Points 2026"
            className="h-6 w-auto object-contain brightness-0 invert"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) =>
            item.dropdown ? (
              <DesktopDropdown
                key={item.label}
                label={item.label}
                items={item.dropdown}
                isActive={isDropdownActive(item.dropdown)}
              />
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button variant="gtpCta" size="sm" asChild>
            <Link href="/events/gtp-2026/register">Register Now</Link>
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
            {/* Sheet header */}
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
              <nav className="flex flex-col px-4 py-4">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div key={item.label}>
                      <button
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === item.label
                              ? null
                              : item.label,
                          )
                        }
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                          isDropdownActive(item.dropdown)
                            ? "bg-white/15 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            mobileExpanded === item.label && "rotate-180",
                          )}
                        />
                      </button>
                      {mobileExpanded === item.label && (
                        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-4">
                          {item.dropdown.map(({ label: subLabel, href }) => (
                            <SheetClose asChild key={href}>
                              <Link
                                href={href}
                                onClick={closeSheet}
                                className="rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                              >
                                {subLabel}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        onClick={closeSheet}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-white/15 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ),
                )}
              </nav>

              <Separator className="mx-4 bg-white/10" />

              <div className="px-6 py-5">
                <SheetClose asChild>
                  <Button
                    variant="gtpCta"
                    className="w-full"
                    asChild
                  >
                    <Link href="/events/gtp-2026/register" onClick={closeSheet}>
                      Register Now
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
