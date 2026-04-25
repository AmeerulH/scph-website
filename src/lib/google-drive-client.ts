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

/** Max folders walked upward (shared drives / nested trees). */
const DRIVE_PARENT_WALK_MAX = 80;

/**
 * True if `fileId` is a strict descendant of `ancestorFolderId` (walks parents; supports multi-parent).
 * Returns false if `fileId` is the folder itself or unrelated.
 */
export async function driveFileDescendantOfFolder(
  drive: drive_v3.Drive,
  fileId: string,
  ancestorFolderId: string,
): Promise<boolean> {
  if (!fileId || !ancestorFolderId || fileId === ancestorFolderId) return false;

  const seen = new Set<string>();
  const queue: string[] = [fileId];
  let apiCalls = 0;

  while (queue.length > 0 && apiCalls < DRIVE_PARENT_WALK_MAX) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);

    let parents: string[];
    try {
      apiCalls += 1;
      const res = await drive.files.get({
        fileId: id,
        fields: "parents",
        supportsAllDrives: true,
      });
      parents = res.data.parents ?? [];
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        const e = err as {
          code?: string | number;
          message?: string;
          response?: { status?: number };
        };
        console.error("[drive] descendant-walk files.get failed", {
          fileId: id,
          ancestorFolderId,
          code: e?.code,
          status: e?.response?.status,
          message: e?.message,
        });
      }
      return false;
    }

    if (parents.includes(ancestorFolderId)) return true;

    for (const p of parents) {
      if (!seen.has(p)) queue.push(p);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn("[drive] descendant-walk exhausted without match", {
      startFileId: fileId,
      ancestorFolderId,
      visitedCount: seen.size,
      apiCalls,
    });
    try {
      const probe = await drive.files.get({
        fileId,
        fields:
          "id,name,mimeType,driveId,parents,shortcutDetails,owners(emailAddress)",
        supportsAllDrives: true,
      });
      console.warn("[drive] descendant-walk probe", {
        startFileId: fileId,
        ancestorFolderId,
        driveId: probe.data.driveId ?? null,
        parents: probe.data.parents ?? null,
        mimeType: probe.data.mimeType,
        isShortcut:
          probe.data.mimeType === "application/vnd.google-apps.shortcut",
        shortcutTargetId: probe.data.shortcutDetails?.targetId ?? null,
        owners: probe.data.owners?.map((o) => o.emailAddress) ?? null,
      });
    } catch (err) {
      console.warn("[drive] descendant-walk probe failed", err);
    }
  }
  return false;
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

/** Export Google Workspace file to a concrete MIME (e.g. PDF, PNG for drawings). */
export async function driveExportStream(
  drive: drive_v3.Drive,
  fileId: string,
  exportMimeType: string,
): Promise<Readable> {
  const res = await drive.files.export(
    {
      fileId,
      mimeType: exportMimeType,
    },
    { responseType: "stream" },
  );
  const stream = res.data as Readable;
  if (!stream || typeof stream.pipe !== "function") {
    throw new Error("Drive export did not return a readable stream.");
  }
  return stream;
}

/** Export Google Docs / Sheets / Slides to PDF stream. */
export async function driveExportPdfStream(
  drive: drive_v3.Drive,
  fileId: string,
): Promise<Readable> {
  return driveExportStream(drive, fileId, "application/pdf");
}

// ---------------------------------------------------------------------------
// Listing-based file membership (replaces parent-walk auth for shared folders)
// ---------------------------------------------------------------------------

type AllowlistEntry = { ids: Set<string>; expiresAt: number };
const _allowlistCache = new Map<string, AllowlistEntry>();
const ALLOWLIST_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function _collectIds(
  drive: drive_v3.Drive,
  folderId: string,
  ids: Set<string>,
  depth: number,
): Promise<void> {
  if (depth > 10) return;
  const children = await driveListChildren(drive, folderId);
  for (const f of children) {
    if (!f.id) continue;
    if (f.mimeType === GOOGLE_DRIVE_FOLDER_MIME) {
      await _collectIds(drive, f.id, ids, depth + 1);
    } else {
      ids.add(f.id);
    }
  }
}

/**
 * Returns the set of all non-folder file IDs reachable from `driveFolderId`.
 * Result is cached for 5 minutes per folder, shared across sessions.
 * Uses files.list (works with folder-share) instead of files.get(parents).
 */
export async function driveGetWorkshopAllowlist(
  drive: drive_v3.Drive,
  driveFolderId: string,
): Promise<Set<string>> {
  const now = Date.now();

  const cached = _allowlistCache.get(driveFolderId);
  if (cached && cached.expiresAt > now) return cached.ids;

  // Prune stale entries
  for (const [k, v] of _allowlistCache) {
    if (v.expiresAt <= now) _allowlistCache.delete(k);
  }

  const ids = new Set<string>();
  await _collectIds(drive, driveFolderId, ids, 0);
  _allowlistCache.set(driveFolderId, { ids, expiresAt: now + ALLOWLIST_TTL_MS });
  return ids;
}
