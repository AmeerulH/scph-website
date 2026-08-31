import { NextResponse } from "next/server";
import { getAuthenticatedMpnProfile } from "@/lib/mpn/auth";
import { createAdminClient } from "@/lib/mpn/supabase/admin";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ data: null, error: { code, message } }, { status });
}

export async function POST(request: Request) {
  const requester = await getAuthenticatedMpnProfile();
  if (!requester) return errorResponse("UNAUTHENTICATED", "Sign in to continue.", 401);
  if (requester.role !== "admin") return errorResponse("FORBIDDEN", "Administrator access is required.", 403);

  const body = (await request.json().catch(() => null)) as {
    userId?: unknown;
    reason?: unknown;
  } | null;
  const userId = typeof body?.userId === "string" ? body.userId : null;
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  if (!userId) return errorResponse("VALIDATION_ERROR", "A member is required.", 400);
  if (reason.length > 1_000) return errorResponse("VALIDATION_ERROR", "Reason must be 1,000 characters or fewer.", 400);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update({ role: "rejected", rejection_reason: reason || null })
    .eq("id", userId)
    .eq("role", "pending")
    .select("id")
    .maybeSingle();

  if (error) return errorResponse("INTERNAL", "Unable to reject this member.", 500);
  if (!data) return errorResponse("NOT_FOUND", "Pending member not found.", 404);
  return NextResponse.json({ data: { rejected: true }, error: null });
}
