import { createClient } from "@/lib/mpn/supabase/server";
import {
  getResourceWorkshop,
  type MpnResource,
  type MpnWorkshop,
} from "@/lib/mpn/resource-types";

export { getResourceWorkshop, type MpnResource, type MpnWorkshop };

export async function getMpnResources(): Promise<MpnResource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources_public")
    .select(
      "id, title, description, type, theme, source, published_date, article_url, visibility, workshop_id, download_count, tags, workshops(id, number, title, location)"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load MPN resources.");
  return (data ?? []) as MpnResource[];
}

export async function getMpnResource(id: string): Promise<MpnResource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources_public")
    .select(
      "id, title, description, type, theme, source, published_date, article_url, visibility, workshop_id, download_count, tags, workshops(id, number, title, location)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("Unable to load this MPN resource.");
  return data as MpnResource | null;
}

