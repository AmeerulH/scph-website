import { NextResponse } from "next/server";
import { getAuthenticatedMpnProfile } from "@/lib/mpn/auth";
import { createAdminClient } from "@/lib/mpn/supabase/admin";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ data: null, error: { code, message } }, { status });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const profile = await getAuthenticatedMpnProfile();
  if (!profile) return errorResponse("UNAUTHENTICATED", "Sign in to download this resource.", 401);
  if (profile.role === "rejected") {
    return errorResponse("FORBIDDEN", "Your membership does not have download access.", 403);
  }

  const { id } = await params;
  const admin = createAdminClient();
  const { data: resource, error } = await admin
    .from("resources")
    .select("id, file_url, visibility, workshop_id")
    .eq("id", id)
    .maybeSingle();

  if (error) return errorResponse("INTERNAL", "Unable to prepare this download.", 500);
  if (!resource || !resource.file_url) {
    return errorResponse("NOT_FOUND", "A downloadable file is not available for this resource.", 404);
  }

  const hasAccess =
    resource.visibility === "members" ||
    (resource.visibility === "admins" && profile.role === "admin") ||
    (resource.visibility === "workshop_alumni" &&
      (profile.role === "admin" || resource.workshop_id === profile.workshop_id));

  if (!hasAccess) {
    return errorResponse("FORBIDDEN", "You do not have access to this resource.", 403);
  }

  const { error: downloadLogError } = await admin
    .from("resource_downloads")
    .insert({ resource_id: resource.id, user_id: profile.id });
  if (downloadLogError) {
    return errorResponse("INTERNAL", "Unable to record this download.", 500);
  }

  const { data: signedUrl, error: signedUrlError } = await admin.storage
    .from("resources")
    .createSignedUrl(resource.file_url, 60);
  if (signedUrlError || !signedUrl?.signedUrl) {
    return errorResponse("INTERNAL", "Unable to prepare this download.", 500);
  }

  return NextResponse.json({ data: { url: signedUrl.signedUrl }, error: null });
}
