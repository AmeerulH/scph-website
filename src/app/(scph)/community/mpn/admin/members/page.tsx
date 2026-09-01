import Link from "next/link";
import { redirect } from "next/navigation";
import { PendingMembers } from "@/components/mpn/admin/pending-members";
import { Button } from "@/components/ui/button";
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
    <section className="mx-auto max-w-4xl px-5 pb-16 pt-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-scph-green">MPN administration</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold text-[#0d1f3c]">Pending memberships</h1>
        <Button asChild size="sm" variant="scphOutline">
          <Link href="/community/mpn/admin/resources">Add resource</Link>
        </Button>
      </div>
      <p className="mt-2 text-slate-600">Verify workshop attendance before approving an applicant.</p>
      <div className="mt-8"><PendingMembers members={members ?? []} /></div>
    </section>
  );
}
