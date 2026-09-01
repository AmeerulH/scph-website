import type { Metadata } from "next";
import { FloatingNav } from "@/components/mpn/nav/floating-nav";
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
    <div className="min-h-screen bg-[#faf9f7] pt-28 text-slate-800">
      <FloatingNav
        initialProfile={
          profile
            ? { full_name: profile.full_name, role: profile.role }
            : null
        }
      />
      {children}
    </div>
  );
}
