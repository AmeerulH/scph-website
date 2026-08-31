import { redirect } from "next/navigation";
import { PendingMembers } from "@/components/mpn/admin/pending-members";
import { getAuthenticatedMpnProfile } from "@/lib/mpn/auth";
import { createAdminClient } from "@/lib/mpn/supabase/admin";

export default async function MpnAdminMembersPage() {
  const requester = await getAuthenticatedMpnProfile();
  if (!requester || requester.role !== "admin") redirect("/community/mpn/login");

  const admin = createAdminClient();
  const { data: members, error } = await admin
    .from("profiles")
    .select("id, full_name, email, organisation, country, created_at, workshops(number, title)")
    .eq("role", "pending")
    .order("created_at", { ascending: true });

  if (error) throw new Error("Unable to load pending MPN members.");

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#50B58B]">MPN administration</p>
      <h1 className="mt-3 font-heading text-3xl font-semibold text-[#0d1f3c]">Pending memberships</h1>
      <p className="mt-2 text-slate-600">Verify workshop attendance before approving an applicant.</p>
      <div className="mt-8"><PendingMembers members={members ?? []} /></div>
    </section>
  );
}
