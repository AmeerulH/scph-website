import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getMpnSupabaseConfig } from "@/lib/mpn/supabase/env";

type RegisterPayload = {
  fullName?: unknown;
  email?: unknown;
  password?: unknown;
  organisation?: unknown;
  country?: unknown;
  workshopId?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { data: null, error: { code: "VALIDATION_ERROR", message } },
    { status }
  );
}

export async function POST(request: NextRequest) {
  let body: RegisterPayload;

  try {
    body = (await request.json()) as RegisterPayload;
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const organisation = typeof body.organisation === "string" ? body.organisation.trim() : "";
  const country = typeof body.country === "string" ? body.country.trim().toUpperCase() : "";
  const workshopId = typeof body.workshopId === "string" ? body.workshopId : null;

  if (!fullName || !emailPattern.test(email) || password.length < 8) {
    return errorResponse("Enter a name, valid email address, and password of at least 8 characters.", 400);
  }

  if (country && !/^[A-Z]{2}$/.test(country)) {
    return errorResponse("Country must be a two-letter ISO country code.", 400);
  }

  if (workshopId && !uuidPattern.test(workshopId)) {
    return errorResponse("Select a valid workshop.", 400);
  }

  const { url, publishableKey } = getMpnSupabaseConfig();
  const response = NextResponse.json({
    data: { message: "Check your email to verify your account." },
    error: null,
  });
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
  const origin = new URL(request.url).origin;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        organisation: organisation || null,
        country: country || null,
        workshop_id: workshopId,
      },
      emailRedirectTo: `${origin}/community/mpn/auth/confirm?next=/community/mpn/pending`,
    },
  });

  if (error) {
    return NextResponse.json(
      { data: null, error: { code: "REGISTRATION_ERROR", message: error.message } },
      { status: 400 }
    );
  }

  return response;
}
