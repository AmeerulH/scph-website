import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/mpn/supabase/server";

const MPN_BASE_PATH = "/community/mpn";

function safeNext(value: string | null) {
  return value?.startsWith(MPN_BASE_PATH) ? value : `${MPN_BASE_PATH}/pending`;
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const supabase = await createClient();

  const error =
    tokenHash && type
      ? (await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error
      : code
        ? (await supabase.auth.exchangeCodeForSession(code)).error
        : new Error("The verification link is incomplete.");

  if (error) {
    const url = request.nextUrl.clone();
    url.pathname = `${MPN_BASE_PATH}/auth/error`;
    url.searchParams.set("message", error.message);
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = next;
  url.search = "";
  url.searchParams.set("verified", "1");
  return NextResponse.redirect(url);
}
