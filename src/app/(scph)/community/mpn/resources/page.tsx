import type { Metadata } from "next";
import { ResourcesBrowser } from "@/components/mpn/resources/resources-browser";
import { getMpnResources, type MpnWorkshop } from "@/lib/mpn/resources";
import { createClient } from "@/lib/mpn/supabase/server";

export const metadata: Metadata = {
  title: "Resources | Media Professional Network",
  description: "Research, reports, toolkits, and workshop materials from MPN.",
};

export default async function MpnResourcesPage() {
  const supabase = await createClient();
  const [{ data: workshopData, error: workshopError }, resources] = await Promise.all([
    supabase
      .from("workshops")
      .select("id, number, title, location")
      .order("number", { ascending: true }),
    getMpnResources(),
  ]);

  if (workshopError) throw new Error("Unable to load MPN workshops.");

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-scph-green">
        Media Professional Network
      </p>
      <h1 className="mt-3 font-heading text-3xl font-bold text-[#0d1f3c]">
        Resources library
      </h1>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-7 text-slate-600">
        Research, reporting tools, and materials shared through the SCPH
        journalist workshop network.
      </p>
      <ResourcesBrowser
        resources={resources}
        workshops={(workshopData ?? []) as MpnWorkshop[]}
      />
    </section>
  );
}
