import { redirect } from "next/navigation";
import { ResourceUploadForm } from "@/components/mpn/resources/resource-upload-form";
import { getAuthenticatedMpnProfile } from "@/lib/mpn/auth";
import type { MpnWorkshop } from "@/lib/mpn/resource-types";
import { createAdminClient } from "@/lib/mpn/supabase/admin";

export default async function MpnAdminResourcesPage() {
  const requester = await getAuthenticatedMpnProfile();
  if (!requester || requester.role !== "admin") {
    redirect("/community/mpn/login");
  }

  const admin = createAdminClient();
  const { data: workshops, error } = await admin
    .from("workshops")
    .select("id, number, title, location")
    .order("number", { ascending: true });

  if (error) throw new Error("Unable to load MPN workshops.");

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-scph-green">
        MPN administration
      </p>
      <h1 className="mt-3 font-heading text-3xl font-bold text-[#0d1f3c]">
        Add a resource
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Publish a resource to the library. Files remain private and are only
        delivered through a signed download link.
      </p>
      <div className="mt-8 rounded-[10px] border border-slate-200 bg-white p-6 sm:p-8">
        <ResourceUploadForm workshops={(workshops ?? []) as MpnWorkshop[]} />
      </div>
    </section>
  );
}
