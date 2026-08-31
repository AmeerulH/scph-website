"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getMpnSupabaseConfig } from "./env";

export function createClient() {
  const { url, publishableKey } = getMpnSupabaseConfig();
  return createBrowserClient(url, publishableKey);
}
