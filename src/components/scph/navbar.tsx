"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ChevronDown, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const aboutLinks = [
  { label: "Our Foundation", href: "/about-us#foundation" },
  { label: "Our Strategy", href: "/about-us#strategy" },
  { label: "Meet The Team", href: "/about-us#team" },
];

const navLinks = [
  { label: "Programmes", href: "/programmes" },
  { label: "Research", href: "/research" },
  { label: "Media", href: "/media" },
  { label: "Community", href: "/network" },
];

const conferenceLinks = [
  {
    label: "GTP 2026",
    href: "/events/gtp-2026/about",
    description: "Global Tipping Points Conference, Kuala Lumpur",
    external: false,
  },
  {
    label: "PHAM 2024",
    href: "https://www.pham2024.com/",
    description: "Planetary Health Annual Meeting 2024",
    external: true,
  },
];

export function ScphNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [conferencesOpen, setConferencesOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/about-us" ? pathname.startsWith("/about-us") : pathname === href;
  const closeSheet = () => setSheetOpen(false);

  return (
    <header className="fixed inset-x-2 top-4 z-50 flex justify-center md:inset-x-4">
      <nav
        className={cn(
          "flex w-full max-w-7xl items-center justify-between gap-6 rounded-full border border-white/30 px-4 py-2 transition-all duration-300",
          "backdrop-blur-[20px] backdrop-saturate-[1.8]",
          scrolled ? "bg-white/60 shadow-xl" : "bg-white/40 shadow-lg"
        )}
        style={
          {
            // Liquid Glass 2026: dynamic backdrop for content behind
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
          } as React.CSSProperties
        }
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/scph/logo.png"
            alt="Sunway Centre for Planetary Health"
            width={160}
            height={48}
            className="h-8 w-auto object-contain"
            priority
            fetchPriority="high"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {/* About Us: clickable link + hover dropdown */}
              <NavigationMenuItem>
                <div className="relative group/aboutus">
                  <Link
                    href="/about-us"
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      pathname.startsWith("/about-us")
                        ? "bg-scph-blue/10 text-scph-blue"
                        : "text-gray-700 hover:bg-gray-100 hover:text-scph-blue"
                    )}
                  >
                    About Us
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover/aboutus:opacity-100 group-hover/aboutus:visible transition-all duration-200 z-50">
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-xl p-2 w-64">
                      <ul>
                        {aboutLinks.map(({ label, href }) => (
                          <li key={label}>
                            <Link
                              href={href}
                              className="flex rounded-xl px-4 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-scph-blue/5"
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </NavigationMenuItem>

              {navLinks.map(({ label, href }) => (
                <NavigationMenuItem key={label}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        isActive(href)
                          ? "bg-scph-blue/10 text-scph-blue"
                          : "text-gray-700 hover:bg-gray-100 hover:text-scph-blue"
                      )}
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              {/* Conferences dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100",
                    pathname.startsWith("/events")
                      ? "bg-scph-blue/10 text-scph-blue"
                      : "text-gray-700 hover:text-scph-blue"
                  )}
                >
                  Conferences
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-2xl border-gray-100 shadow-xl !left-auto right-0">
                  <ul className="w-72 p-2">
                    {conferenceLinks.map(({ label, href, description, external }) => (
                      <li key={label}>
                        {external ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                {label}
                                <ExternalLink className="h-3 w-3 text-gray-400" />
                              </div>
                              <p className="mt-0.5 text-xs text-gray-500">{description}</p>
                            </div>
                          </a>
                        ) : (
                          <Link
                            href={href}
                            prefetch={false}
                            className="flex items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-scph-blue/5"
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{label}</div>
                              <p className="mt-0.5 text-xs text-gray-500">{description}</p>
                            </div>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 p-0">
            {/* Sheet header */}
            <div className="shrink-0 border-b border-gray-100 px-6 py-5">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Sunway Centre for Planetary Health site navigation
              </SheetDescription>
              <Image
                src="/images/scph/logo.png"
                alt="Sunway Centre for Planetary Health"
                width={140}
                height={40}
                className="h-7 w-auto object-contain"
              />
            </div>

            {/* Sheet nav links */}
            <nav className="flex flex-col px-4 py-4">
              {/* About Us: clickable link + expandable sub-items */}
              <div
                className={cn(
                  "flex items-center rounded-xl transition-colors",
                  pathname.startsWith("/about-us")
                    ? "bg-scph-blue/8"
                    : "hover:bg-gray-50"
                )}
              >
                <SheetClose asChild>
                  <Link
                    href="/about-us"
                    onClick={closeSheet}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-medium",
                      pathname.startsWith("/about-us")
                        ? "text-scph-blue"
                        : "text-gray-700 hover:text-scph-blue"
                    )}
                  >
                    About Us
                  </Link>
                </SheetClose>
                <button
                  onClick={() => setAboutOpen((p) => !p)}
                  className="p-3 text-gray-500 hover:text-scph-blue"
                  aria-label={aboutOpen ? "Collapse About Us menu" : "Expand About Us menu"}
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      aboutOpen && "rotate-90"
                    )}
                  />
                </button>
              </div>
              {aboutOpen && (
                <div className="ml-4 flex flex-col gap-1 border-l-2 border-scph-blue/15 pl-4">
                  {aboutLinks.map(({ label, href }) => (
                    <SheetClose asChild key={label}>
                      <Link
                        href={href}
                        onClick={closeSheet}
                        className="rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:text-scph-blue"
                      >
                        {label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              )}

              {navLinks.map(({ label, href }) => (
                <SheetClose asChild key={label}>
                  <Link
                    href={href}
                    onClick={closeSheet}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive(href)
                        ? "bg-scph-blue/8 text-scph-blue"
                        : "text-gray-700 hover:bg-gray-50 hover:text-scph-blue"
                    )}
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}

              {/* Conferences expandable */}
              <button
                onClick={() => setConferencesOpen((p) => !p)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  pathname.startsWith("/events")
                    ? "bg-scph-blue/8 text-scph-blue"
                    : "text-gray-700 hover:bg-gray-50 hover:text-scph-blue"
                )}
              >
                Conferences
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    conferencesOpen && "rotate-90"
                  )}
                />
              </button>

              {conferencesOpen && (
                <div className="ml-4 flex flex-col gap-1 border-l-2 border-scph-blue/15 pl-4">
                  {conferenceLinks.map(({ label, href, external }) =>
                    external ? (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeSheet}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:text-scph-blue"
                      >
                        {label}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                    ) : (
                      <SheetClose asChild key={label}>
                        <Link
                          href={href}
                          prefetch={false}
                          onClick={closeSheet}
                          className="rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:text-scph-blue"
                        >
                          {label}
                        </Link>
                      </SheetClose>
                    )
                  )}
                </div>
              )}
            </nav>

            <Separator className="mx-4" />
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
