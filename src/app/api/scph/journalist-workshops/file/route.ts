import { Readable } from "node:stream";
import { type NextRequest, NextResponse } from "next/server";
import {
  driveExportPdfStream,
  driveExportStream,
  driveFileDescendantOfFolder,
  driveGetFileMetadata,
  driveOpenMediaDownloadStream,
  driveResolveShortcutTargetId,
  getDriveReadonlyClient,
  GOOGLE_DRIVE_DOCUMENT_MIME,
  GOOGLE_DRIVE_FOLDER_MIME,
  GOOGLE_DRIVE_PRESENTATION_MIME,
  GOOGLE_DRIVE_SHORTCUT_MIME,
  GOOGLE_DRIVE_SPREADSHEET_MIME,
} from "@/lib/google-drive-client";
import {
  JOURNALIST_WORKSHOP_SESSION_COOKIE,
  verifyJournalistWorkshopSession,
} from "@/lib/journalist-workshop-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Google Drawings — export as PNG (read-only). */
const GOOGLE_DRIVE_DRAWING_MIME = "application/vnd.google-apps.drawing";

/** Drive file ids are alphanumeric, underscore, hyphen (no slashes). */
const DRIVE_FILE_ID_RE = /^[a-zA-Z0-9_-]+$/;

function notFound() {
  return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
}

function dispositionFilename(name: string): string {
  const s = (name || "download")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/[\r\n]/g, "")
    .trim()
    .slice(0, 200);
  return s.length > 0 ? s : "download";
}

export async function GET(req: NextRequest) {
  const secret = process.env.JOURNALIST_WORKSHOP_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const cookie = req.cookies.get(JOURNALIST_WORKSHOP_SESSION_COOKIE)?.value;
  if (!cookie) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const session = verifyJournalistWorkshopSession(cookie, secret);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const fileIdRaw = req.nextUrl.searchParams.get("fileId")?.trim();
  if (!fileIdRaw || !DRIVE_FILE_ID_RE.test(fileIdRaw)) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  let drive;
  try {
    drive = getDriveReadonlyClient();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const rootId = session.driveFolderId;

  let meta;
  try {
    meta = await driveGetFileMetadata(
      drive,
      fileIdRaw,
      "id, name, mimeType, shortcutDetails",
    );
  } catch {
    return notFound();
  }

  const mime = meta.mimeType ?? "";
  if (mime === GOOGLE_DRIVE_FOLDER_MIME) {
    return notFound();
  }

  let contentId = fileIdRaw;
  let contentMime = mime;
  let downloadName = meta.name ?? "download";

  if (mime === GOOGLE_DRIVE_SHORTCUT_MIME) {
    const shortcutInTree = await driveFileDescendantOfFolder(drive, fileIdRaw, rootId);
    if (!shortcutInTree) return notFound();

    const targetId = await driveResolveShortcutTargetId(drive, fileIdRaw);
    if (!targetId) return notFound();

    const targetInTree = await driveFileDescendantOfFolder(drive, targetId, rootId);
    if (!targetInTree) return notFound();

    try {
      const targetMeta = await driveGetFileMetadata(
        drive,
        targetId,
        "id, name, mimeType",
      );
      contentId = targetId;
      contentMime = targetMeta.mimeType ?? "";
      downloadName = targetMeta.name ?? downloadName;
    } catch {
      return notFound();
    }

    if (contentMime === GOOGLE_DRIVE_SHORTCUT_MIME) {
      return notFound();
    }
  } else {
    const inTree = await driveFileDescendantOfFolder(drive, fileIdRaw, rootId);
    if (!inTree) return notFound();
  }

  if (contentMime === GOOGLE_DRIVE_FOLDER_MIME) {
    return notFound();
  }

  const headers = new Headers();
  headers.set("Cache-Control", "private, no-store");

  let nodeStream: Readable;
  let outMime: string;

  try {
    if (
      contentMime === GOOGLE_DRIVE_DOCUMENT_MIME ||
      contentMime === GOOGLE_DRIVE_PRESENTATION_MIME ||
      contentMime === GOOGLE_DRIVE_SPREADSHEET_MIME
    ) {
      nodeStream = await driveExportPdfStream(drive, contentId);
      outMime = "application/pdf";
      const base = downloadName.replace(/\.pdf$/i, "");
      downloadName = `${base}.pdf`;
    } else if (contentMime === GOOGLE_DRIVE_DRAWING_MIME) {
      nodeStream = await driveExportStream(drive, contentId, "image/png");
      outMime = "image/png";
      const base = downloadName.replace(/\.(png|svg)$/i, "");
      downloadName = `${base}.png`;
    } else if (contentMime.startsWith("application/vnd.google-apps.")) {
      return notFound();
    } else {
      nodeStream = await driveOpenMediaDownloadStream(drive, contentId);
      outMime =
        contentMime.length > 0 ? contentMime : "application/octet-stream";
    }
  } catch {
    return notFound();
  }

  headers.set("Content-Type", outMime);
  const safe = dispositionFilename(downloadName);
  headers.set("Content-Disposition", `attachment; filename="${safe}"`);

  const web = Readable.toWeb(nodeStream) as unknown as ReadableStream<Uint8Array>;
  return new Response(web, { status: 200, headers });
}
