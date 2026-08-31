import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getMpnSupabaseConfig } from "@/lib/mpn/supabase/env";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
  next?: unknown;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { data: null, error: { code: "LOGIN_ERROR", message } },
    { status }
  );
}

export async function POST(request: NextRequest) {
  let body: LoginPayload;

  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const next = typeof body.next === "string" ? body.next : null;
  const safeNext = next?.startsWith("/community/mpn") ? next : null;

  if (!email || !password) {
    return errorResponse("Enter your email address and password.", 400);
  }

  const { url, publishableKey } = getMpnSupabaseConfig();
  const pendingCookies: Array<{
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
  }> = [];

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        pendingCookies.push(...cookiesToSet);
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return errorResponse(error?.message ?? "Unable to sign in.", 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.role === "rejected") {
    await supabase.auth.signOut();
    return errorResponse(
      "Your membership application was not approved. Please contact SCPH for support.",
      403
    );
  }

  let redirectTo: string;
  if (profile?.role === "pending") {
    redirectTo = "/community/mpn/pending";
  } else {
    redirectTo = safeNext ?? "/community/mpn?signedIn=1";
  }

  const response = NextResponse.json({ data: { redirectTo }, error: null });
  pendingCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );

  return response;
}
