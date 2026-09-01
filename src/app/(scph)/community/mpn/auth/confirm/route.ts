import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { notifyAdminsOfPendingMember } from "@/lib/mpn/email";
import { getMpnSupabaseConfig } from "@/lib/mpn/supabase/env";

const MPN_BASE_PATH = "/community/mpn";

function safeNext(value: string | null) {
  return value?.startsWith(MPN_BASE_PATH) ? value : `${MPN_BASE_PATH}/pending`;
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const pendingCookies: Array<{
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
  }> = [];
  const { url: supabaseUrl, publishableKey } = getMpnSupabaseConfig();
  const supabase = createServerClient(supabaseUrl, publishableKey, {
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

  const { data, error } =
    tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : { data: { user: null, session: null }, error: new Error("The verification link is incomplete.") };

  if (error) {
    const url = request.nextUrl.clone();
    url.pathname = `${MPN_BASE_PATH}/auth/error`;
    url.searchParams.set("message", error.message);
    return NextResponse.redirect(url);
  }

  if (data.user) {
    const emailResult = await notifyAdminsOfPendingMember(data.user.id);
    if (!emailResult.sent) {
      console.warn("Email verified but admin alert was not sent:", emailResult.reason);
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = next;
  url.search = "";
  url.searchParams.set("verified", "1");
  const response = NextResponse.redirect(url);
  pendingCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );
  return response;
}
