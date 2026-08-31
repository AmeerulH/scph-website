export function getMpnSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_MPN_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_MPN_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error("MPN Supabase environment variables are not configured.");
  }

  return { url, publishableKey };
}
