"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountMenu } from "@/components/mpn/nav/account-menu";
import type { MpnRole } from "@/lib/mpn/auth";
import { createClient } from "@/lib/mpn/supabase/client";

type MpnAuthProfile = {
  full_name: string;
  role: MpnRole;
};

type MpnAuthNavProps = {
  initialProfile: MpnAuthProfile | null;
};

export function MpnAuthNav({ initialProfile }: MpnAuthNavProps) {
  const [profile, setProfile] = useState<MpnAuthProfile | null>(initialProfile);

  useEffect(() => {
    const supabase = createClient();

    async function syncProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          full_name: data.full_name,
          role: data.role as MpnRole,
        });
      }
    }

    void syncProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (profile) {
    return <AccountMenu fullName={profile.full_name} role={profile.role} />;
  }

  return (
    <Link className="text-sm font-medium text-[#1B4384] hover:underline" href="/community/mpn/login">
      Member sign in
    </Link>
  );
}
