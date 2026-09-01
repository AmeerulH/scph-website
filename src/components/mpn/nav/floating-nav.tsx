"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MpnAuthNav } from "@/components/mpn/nav/auth-nav";
import type { MpnRole } from "@/lib/mpn/auth";
import { cn } from "@/lib/utils";

type FloatingNavProps = {
  initialProfile: {
    full_name: string;
    role: MpnRole;
  } | null;
};

const links = [
  { href: "/community/mpn", label: "Home", exact: true },
  { href: "/community/mpn/resources", label: "Resources" },
];

export function FloatingNav({ initialProfile }: FloatingNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks =
    initialProfile?.role === "admin"
      ? [...links, { href: "/community/mpn/admin/members", label: "Admin" }]
      : links;

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <header className="fixed inset-x-4 top-2.5 z-40 flex justify-center sm:inset-x-5">
      <nav className="flex h-16 w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-slate-200 bg-white px-4 shadow-[0_4px_24px_rgba(0,0,0,0.10)] sm:px-6">
        <Link
          className="shrink-0 font-heading text-sm font-bold text-scph-blue"
          href="/community/mpn"
        >
          <span className="sm:hidden">MPN</span>
          <span className="hidden sm:inline">Media Professional Network</span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, exact }) => (
            <Link
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                isActive(href, exact)
                  ? "bg-scph-blue text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-scph-blue"
              )}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <MpnAuthNav initialProfile={initialProfile} />
        </div>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close MPN navigation" : "Open MPN navigation"}
          className="grid size-9 place-items-center rounded-full text-scph-blue hover:bg-slate-100 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </nav>

      {menuOpen ? (
        <div className="absolute top-[calc(100%+8px)] w-full max-w-6xl rounded-xl border border-slate-200 bg-white p-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)] md:hidden">
          <div className="grid gap-1">
            {navLinks.map(({ href, label, exact }) => (
              <Link
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-semibold",
                  isActive(href, exact)
                    ? "bg-scph-blue text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
                href={href}
                key={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-3 border-t border-slate-200 px-4 pt-3">
            <MpnAuthNav initialProfile={initialProfile} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
