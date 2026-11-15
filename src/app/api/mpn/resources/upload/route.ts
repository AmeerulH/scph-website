import { NextResponse } from "next/server";
import { getAuthenticatedMpnProfile } from "@/lib/mpn/auth";
import { RESOURCE_THEMES, RESOURCE_TYPES } from "@/lib/mpn/filter-options";
import { createAdminClient } from "@/lib/mpn/supabase/admin";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
]);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ data: null, error: { code, message } }, { status });
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const requester = await getAuthenticatedMpnProfile();
  if (!requester) return errorResponse("UNAUTHENTICATED", "Sign in to continue.", 401);
  if (requester.role !== "admin") {
    return errorResponse("FORBIDDEN", "Administrator access is required.", 403);
  }

  const formData = await request.formData();
  const title = textValue(formData, "title");
  const description = textValue(formData, "description");
  const type = textValue(formData, "type");
  const theme = textValue(formData, "theme");
  const source = textValue(formData, "source");
  const publishedDate = textValue(formData, "published_date");
  const articleUrl = textValue(formData, "article_url");
  const visibility = textValue(formData, "visibility");
  const workshopId = textValue(formData, "workshop_id");
  const tags = formData
    .getAll("tags")
    .filter((tag): tag is string => typeof tag === "string")
    .flatMap((tag) => tag.split(","))
    .map((tag) => tag.trim())
    .filter(Boolean);
  const uploadedFile = formData.get("file");
  const file = uploadedFile instanceof File && uploadedFile.size > 0 ? uploadedFile : null;

  if (!title || !RESOURCE_TYPES.includes(type as (typeof RESOURCE_TYPES)[number])) {
    return errorResponse("VALIDATION_ERROR", "Enter a title and valid resource type.", 400);
  }
  if (!RESOURCE_THEMES.includes(theme as (typeof RESOURCE_THEMES)[number])) {
    return errorResponse("VALIDATION_ERROR", "Select a valid resource theme.", 400);
  }
  if (!["members", "workshop_alumni", "admins"].includes(visibility)) {
    return errorResponse("VALIDATION_ERROR", "Select a valid visibility level.", 400);
  }
  if (workshopId && !UUID_PATTERN.test(workshopId)) {
    return errorResponse("VALIDATION_ERROR", "Select a valid workshop.", 400);
  }
  if (visibility === "workshop_alumni" && !workshopId) {
    return errorResponse("VALIDATION_ERROR", "Workshop alumni resources require a workshop.", 400);
  }
  if (publishedDate && !/^\d{4}-\d{2}-\d{2}$/.test(publishedDate)) {
    return errorResponse("VALIDATION_ERROR", "Enter a valid publication date.", 400);
  }
  if (articleUrl) {
    try {
      const url = new URL(articleUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      return errorResponse("VALIDATION_ERROR", "Enter a valid article URL.", 400);
    }
  }
  if (file && (!ALLOWED_FILE_TYPES.has(file.type) || file.size > MAX_FILE_SIZE)) {
    return errorResponse(
      "VALIDATION_ERROR",
      "Upload a PDF, Word, or Excel file smaller than 25 MB.",
      400
    );
  }

  const admin = createAdminClient();
  const { data: resource, error: insertError } = await admin
    .from("resources")
    .insert({
      title,
      description: description || null,
      type,
      theme,
      source: source || null,
      published_date: publishedDate || null,
      article_url: articleUrl || null,
      visibility,
      workshop_id: workshopId || null,
      uploaded_by: requester.id,
      tags: tags.length > 0 ? tags : null,
    })
    .select("id, title")
    .single();

  if (insertError || !resource) {
    return errorResponse("INTERNAL", "Unable to create this resource.", 500);
  }

  if (file) {
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `${resource.id}/${safeFilename}`;
    const { error: uploadError } = await admin.storage
      .from("resources")
      .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      await admin.from("resources").delete().eq("id", resource.id);
      return errorResponse("INTERNAL", "Unable to upload this resource file.", 500);
    }

    const { error: updateError } = await admin
      .from("resources")
      .update({ file_url: storagePath })
      .eq("id", resource.id);
    if (updateError) {
      await admin.storage.from("resources").remove([storagePath]);
      await admin.from("resources").delete().eq("id", resource.id);
      return errorResponse("INTERNAL", "Unable to save this resource file.", 500);
    }
  }

  return NextResponse.json({ data: { resource }, error: null }, { status: 201 });
}
