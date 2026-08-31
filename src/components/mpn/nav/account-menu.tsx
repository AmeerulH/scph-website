"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/mpn/supabase/client";

type AccountMenuProps = {
  fullName: string;
  role: "pending" | "member" | "admin" | "rejected";
};

export function AccountMenu({ fullName, role }: AccountMenuProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await createClient().auth.signOut();
    router.replace("/community/mpn");
    router.refresh();
  }

  const roleLabel = role === "pending" ? "Pending approval" : role;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold text-[#0d1f3c]">{fullName}</p>
        <p className="text-xs text-slate-500">{roleLabel}</p>
      </div>
      <Button onClick={signOut} size="sm" variant="outline" disabled={isSigningOut}>
        {isSigningOut ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <LogOut aria-hidden="true" />}
        <span className="hidden sm:inline">{isSigningOut ? "Signing out…" : "Sign out"}</span>
      </Button>
    </div>
  );
}
