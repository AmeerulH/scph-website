import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getMpnSupabaseConfig } from "@/lib/mpn/supabase/env";

const MPN_BASE_PATH = "/community/mpn";
const ADMIN_PATH = `${MPN_BASE_PATH}/admin`;
const MEMBER_PATHS = [`${MPN_BASE_PATH}/publications/submit`];
const AUTH_PATHS = [
  `${MPN_BASE_PATH}/profile`,
  `${MPN_BASE_PATH}/pending`,
  ...MEMBER_PATHS,
];

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `${MPN_BASE_PATH}/login`;
  url.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return url;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getMpnSupabaseConfig();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId =
    typeof claimsData?.claims.sub === "string" ? claimsData.claims.sub : null;
  const path = request.nextUrl.pathname;

  if (!userId) {
    if (AUTH_PATHS.some((protectedPath) => path.startsWith(protectedPath)) || path.startsWith(ADMIN_PATH)) {
      return NextResponse.redirect(redirectToLogin(request));
    }
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  const role = profile?.role;

  if (path.startsWith(ADMIN_PATH) && role !== "admin") {
    return NextResponse.redirect(new URL(`${MPN_BASE_PATH}/login`, request.url));
  }

  if (MEMBER_PATHS.some((protectedPath) => path.startsWith(protectedPath)) && !["member", "admin"].includes(role ?? "")) {
    const destination =
      role === "pending" ? `${MPN_BASE_PATH}/pending` : `${MPN_BASE_PATH}/login`;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (path.startsWith(`${MPN_BASE_PATH}/pending`) && ["member", "admin"].includes(role ?? "")) {
    return NextResponse.redirect(new URL(MPN_BASE_PATH, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/community/mpn/:path*"],
};
