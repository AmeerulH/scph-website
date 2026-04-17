/**
 * Shared Google Drive API (read-only) for scripts and Route Handlers.
 * Uses GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY (same service account as GTP Sheets).
 */

import type { Readable } from "node:stream";
import { google } from "googleapis";
import type { drive_v3 } from "googleapis";

export const GOOGLE_DRIVE_FOLDER_MIME = "application/vnd.google-apps.folder";
export const GOOGLE_DRIVE_SHORTCUT_MIME =
  "application/vnd.google-apps.shortcut";
export const GOOGLE_DRIVE_DOCUMENT_MIME = "application/vnd.google-apps.document";
export const GOOGLE_DRIVE_PRESENTATION_MIME =
  "application/vnd.google-apps.presentation";
export const GOOGLE_DRIVE_SPREADSHEET_MIME =
  "application/vnd.google-apps.spreadsheet";

/** Env copy-paste: use the `private_key` value only — no JSON `"` quotes. Literal `\n` → real newlines. */
export function normalizeGooglePrivateKey(
  raw: string | undefined,
): string | undefined {
  if (!raw) return undefined;
  let k = raw.trim();
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1);
  }
  return k.replace(/\\n/g, "\n");
}

export function getDriveReadonlyClient(): drive_v3.Drive {
  const privateKey = normalizeGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();

  if (!privateKey || !clientEmail) {
    throw new Error(
      "Missing GOOGLE_PRIVATE_KEY or GOOGLE_CLIENT_EMAIL (same as GTP submissions).",
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

export async function driveListChildren(
  drive: drive_v3.Drive,
  parentId: string,
): Promise<drive_v3.Schema$File[]> {
  const out: drive_v3.Schema$File[] = [];
  let pageToken: string | undefined;
  const q = `'${parentId}' in parents and trashed = false`;

  do {
    const res = await drive.files.list({
      q,
      fields: "nextPageToken, files(id, name, mimeType, size, modifiedTime)",
      pageSize: 1000,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const batch = res.data.files ?? [];
    out.push(...batch);
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return out;
}

export async function driveGetFileMetadata(
  drive: drive_v3.Drive,
  fileId: string,
  fields = "id, name, mimeType, size, shortcutDetails",
): Promise<drive_v3.Schema$File> {
  const res = await drive.files.get({
    fileId,
    fields,
    supportsAllDrives: true,
  });
  if (!res.data) {
    throw new Error(`Drive files.get returned no data for ${fileId}`);
  }
  return res.data;
}

/** Returns target file id for a shortcut, or null if missing / not a shortcut. */
export async function driveResolveShortcutTargetId(
  drive: drive_v3.Drive,
  shortcutFileId: string,
): Promise<string | null> {
  const meta = await driveGetFileMetadata(
    drive,
    shortcutFileId,
    "id, mimeType, shortcutDetails",
  );
  if (meta.mimeType !== GOOGLE_DRIVE_SHORTCUT_MIME) return null;
  const targetId = meta.shortcutDetails?.targetId;
  return typeof targetId === "string" && targetId.length > 0 ? targetId : null;
}

export type DriveListedRow = {
  id: string;
  name: string;
  mimeType: string;
  size: string | null;
  path: string;
};

export type DriveTreeFile = {
  type: "file";
  id: string;
  name: string;
  mimeType: string;
  size: string | null;
};

export type DriveTreeFolder = {
  type: "folder";
  id: string;
  name: string;
  children: DriveTreeEntry[];
};

export type DriveTreeEntry = DriveTreeFile | DriveTreeFolder;

function sortByName(a: { name?: string | null }, b: { name?: string | null }) {
  return (a.name ?? "").localeCompare(b.name ?? "", undefined, {
    sensitivity: "base",
  });
}

/**
 * Depth-first walk: fills `filesFlat` with every non-folder file and returns a nested tree.
 */
export async function driveWalkFolderTree(
  drive: drive_v3.Drive,
  folderId: string,
  folderName: string,
  folderPath: string,
  depth: number,
  maxDepth: number,
  filesFlat: DriveListedRow[],
  onDepthSkipped?: (folderPath: string, maxDepth: number) => void,
): Promise<DriveTreeFolder> {
  if (depth > maxDepth) {
    onDepthSkipped?.(folderPath, maxDepth);
    return { type: "folder", id: folderId, name: folderName, children: [] };
  }

  const children = (await driveListChildren(drive, folderId)).sort(sortByName);
  const treeChildren: DriveTreeEntry[] = [];

  for (const f of children) {
    const id = f.id;
    const name = f.name;
    const mimeType = f.mimeType;
    if (!id || !name || !mimeType) continue;

    const childPath = `${folderPath}/${name}`;

    if (mimeType === GOOGLE_DRIVE_FOLDER_MIME) {
      const subtree = await driveWalkFolderTree(
        drive,
        id,
        name,
        childPath,
        depth + 1,
        maxDepth,
        filesFlat,
        onDepthSkipped,
      );
      treeChildren.push(subtree);
    } else {
      filesFlat.push({
        id,
        name,
        mimeType,
        size: f.size ?? null,
        path: childPath,
      });
      treeChildren.push({
        type: "file",
        id,
        name,
        mimeType,
        size: f.size ?? null,
      });
    }
  }

  return {
    type: "folder",
    id: folderId,
    name: folderName,
    children: treeChildren,
  };
}

/** Binary download (`alt=media`). Caller sets response headers / piping. */
export async function driveOpenMediaDownloadStream(
  drive: drive_v3.Drive,
  fileId: string,
): Promise<Readable> {
  const res = await drive.files.get(
    {
      fileId,
      alt: "media",
      supportsAllDrives: true,
    },
    { responseType: "stream" },
  );
  const stream = res.data as Readable;
  if (!stream || typeof stream.pipe !== "function") {
    throw new Error("Drive alt=media did not return a readable stream.");
  }
  return stream;
}

/** Export Google Docs / Sheets / Slides to PDF stream. */
export async function driveExportPdfStream(
  drive: drive_v3.Drive,
  fileId: string,
): Promise<Readable> {
  const res = await drive.files.export(
    {
      fileId,
      mimeType: "application/pdf",
    },
    { responseType: "stream" },
  );
  const stream = res.data as Readable;
  if (!stream || typeof stream.pipe !== "function") {
    throw new Error("Drive export did not return a readable stream.");
  }
  return stream;
}
