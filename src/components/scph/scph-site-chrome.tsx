"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ScphNavbar } from "@/components/scph/navbar";

export function ScphSiteChrome({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const isMpnPortal = pathname.startsWith("/community/mpn");

  return (
    <>
      {isMpnPortal ? null : <ScphNavbar />}
      <main className="min-h-screen">{children}</main>
      {isMpnPortal ? null : footer}
    </>
  );
}
