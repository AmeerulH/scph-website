"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ChevronDown, Menu, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Media", href: "/media" },
  { label: "Network", href: "/network" },
];

const eventLinks = [
  {
    label: "GTP 2026",
    href: "/events/gtp-2026",
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
  const [eventsOpen, setEventsOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  const closeSheet = () => setSheetOpen(false);

  return (
    <header className="fixed inset-x-2 top-4 z-50 flex justify-center md:inset-x-4">
      <nav
        className={cn(
          "flex w-full max-w-7xl items-center justify-between gap-6 rounded-full border border-white/30 px-4 py-2 transition-all duration-300",
          scrolled
            ? "bg-white/60 shadow-xl backdrop-blur-xl"
            : "bg-white/40 shadow-lg backdrop-blur-xl"
        )}
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
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
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

              {/* Events dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100",
                    pathname.startsWith("/events")
                      ? "bg-scph-blue/10 text-scph-blue"
                      : "text-gray-700 hover:text-scph-blue"
                  )}
                >
                  Events
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-2xl border-gray-100 shadow-xl">
                  <ul className="w-72 p-2">
                    {eventLinks.map(({ label, href, description, external }) => (
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

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button variant="scph" size="sm" asChild>
            <Link href="/network">Contact Us</Link>
          </Button>
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
            <div className="border-b border-gray-100 px-6 py-5">
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

              {/* Events expandable section */}
              <button
                onClick={() => setEventsOpen((p) => !p)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  pathname.startsWith("/events")
                    ? "bg-scph-blue/8 text-scph-blue"
                    : "text-gray-700 hover:bg-gray-50 hover:text-scph-blue"
                )}
              >
                Events
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    eventsOpen && "rotate-90"
                  )}
                />
              </button>

              {eventsOpen && (
                <div className="ml-4 flex flex-col gap-1 border-l-2 border-scph-blue/15 pl-4">
                  {eventLinks.map(({ label, href, external }) =>
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

            {/* Sheet CTA */}
            <div className="px-6 py-4">
              <SheetClose asChild>
                <Button variant="scph" className="w-full" asChild>
                  <Link href="/network" onClick={closeSheet}>
                    Contact Us
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
