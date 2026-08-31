import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getMpnSupabaseConfig } from "./env";

export function createAdminClient() {
  const serviceRoleKey = process.env.MPN_SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("MPN service role key is not configured.");
  }

  const { url } = getMpnSupabaseConfig();
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
