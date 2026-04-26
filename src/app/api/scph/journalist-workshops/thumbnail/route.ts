import { type NextRequest, NextResponse } from "next/server";
import {
  driveGetFileMetadata,
  driveGetWorkshopAllowlist,
  getDriveAccessToken,
  getDriveReadonlyClient,
} from "@/lib/google-drive-client";
import {
  JOURNALIST_WORKSHOP_SESSION_COOKIE,
  verifyJournalistWorkshopSession,
} from "@/lib/journalist-workshop-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Drive file ids are alphanumeric, underscore, hyphen (no slashes). */
const DRIVE_FILE_ID_RE = /^[a-zA-Z0-9_-]+$/;

/** Server-side cache: fileId → thumbnailLink, 1-hour TTL. */
const _thumbCache = new Map<string, { url: string; expiresAt: number }>();
const THUMB_TTL_MS = 60 * 60 * 1000;

async function getCachedThumbnailLink(
  drive: Parameters<typeof driveGetFileMetadata>[0],
  fileId: string,
): Promise<string | null> {
  const now = Date.now();
  const cached = _thumbCache.get(fileId);
  if (cached && cached.expiresAt > now) return cached.url;

  // Prune stale entries periodically
  if (_thumbCache.size > 2000) {
    for (const [k, v] of _thumbCache) {
      if (v.expiresAt <= now) _thumbCache.delete(k);
    }
  }

  let meta;
  try {
    meta = await driveGetFileMetadata(drive, fileId, "id, thumbnailLink, hasThumbnail");
  } catch {
    return null;
  }

  const url = meta.thumbnailLink ?? null;
  if (url) _thumbCache.set(fileId, { url, expiresAt: now + THUMB_TTL_MS });
  return url;
}

export async function GET(req: NextRequest) {
  const secret = process.env.JOURNALIST_WORKSHOP_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  const cookie = req.cookies.get(JOURNALIST_WORKSHOP_SESSION_COOKIE)?.value;
  if (!cookie) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const session = verifyJournalistWorkshopSession(cookie, secret);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const fileIdRaw = req.nextUrl.searchParams.get("fileId")?.trim();
  if (!fileIdRaw || !DRIVE_FILE_ID_RE.test(fileIdRaw)) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  let drive;
  try {
    drive = getDriveReadonlyClient();
  } catch {
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  let allowedIds: Set<string>;
  try {
    allowedIds = await driveGetWorkshopAllowlist(drive, session.driveFolderId);
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }

  if (!allowedIds.has(fileIdRaw)) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const thumbnailLink = await getCachedThumbnailLink(drive, fileIdRaw);
  if (!thumbnailLink) {
    return NextResponse.json({ ok: false, error: "No thumbnail" }, { status: 404 });
  }

  let imageBuffer: ArrayBuffer;
  try {
    const token = await getDriveAccessToken();
    const res = await fetch(thumbnailLink, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    imageBuffer = await res.arrayBuffer();
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }

  return new Response(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
