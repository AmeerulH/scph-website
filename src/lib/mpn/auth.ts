import { createClient } from "@/lib/mpn/supabase/server";

export type MpnRole = "pending" | "member" | "admin" | "rejected";

type MpnProfile = {
  id: string;
  role: MpnRole;
  full_name: string;
};

export async function getAuthenticatedMpnProfile(): Promise<MpnProfile | null> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId =
    typeof claimsData?.claims.sub === "string" ? claimsData.claims.sub : null;

  if (!userId) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", userId)
    .maybeSingle();

  return data as MpnProfile | null;
}
