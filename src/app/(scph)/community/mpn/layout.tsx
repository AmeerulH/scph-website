import type { Metadata } from "next";
import Link from "next/link";
import { MpnAuthNav } from "@/components/mpn/nav/auth-nav";
import { getAuthenticatedMpnProfile } from "@/lib/mpn/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media Professional Network",
  description:
    "A community for journalists connected to the Sunway Centre for Planetary Health.",
};

export default async function MpnLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAuthenticatedMpnProfile();

  return (
    <div className="bg-[#faf9f7] pt-24 text-slate-800">
      <div className="border-y border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link className="font-heading text-sm font-semibold text-[#1B4384]" href="/community/mpn">
            Media Professional Network
          </Link>
          <MpnAuthNav
            initialProfile={
              profile
                ? { full_name: profile.full_name, role: profile.role }
                : null
            }
          />
        </div>
      </div>
      {children}
    </div>
  );
}
