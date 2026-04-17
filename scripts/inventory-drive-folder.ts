/**
 * Recursively list files under a Google Drive folder (read-only).
 *
 * Uses the same service account as GTP submissions / Sheets:
 *   GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY in `.env.local`.
 *
 * Prerequisites:
 *   - Drive API enabled for the GCP project tied to that service account.
 *   - The folder (and Shared Drive, if applicable) is shared with the service
 *     account email (Viewer is enough).
 *
 * Usage:
 *   DRIVE_FOLDER_ID=12wIHgcAFtO0VERh8rKozjapHfQckiBp8 npm run inventory-drive-folder
 *   npm run inventory-drive-folder -- 12wIHgcAFtO0VERh8rKozjapHfQckiBp8
 *
 * Options (env):
 *   DRIVE_MAX_DEPTH   Max folder nesting (default 30).
 *   DRIVE_JSON=1      Print JSON array of all files (flat) to stdout.
 *   DRIVE_SAVE=1      Write JSON to disk: nested `tree` + `filesFlat` (see below).
 *   DRIVE_OUTPUT=path Override output path (relative to repo root or absolute).
 */

import fs from "node:fs/promises";
import { google } from "googleapis";
import type { drive_v3 } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const FOLDER_MIME = "application/vnd.google-apps.folder";

function normalizeGooglePrivateKey(
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

type ListedRow = {
  id: string;
  name: string;
  mimeType: string;
  size: string | null;
  path: string;
};

type TreeFile = {
  type: "file";
  id: string;
  name: string;
  mimeType: string;
  size: string | null;
};

type TreeFolder = {
  type: "folder";
  id: string;
  name: string;
  children: TreeEntry[];
};

type TreeEntry = TreeFile | TreeFolder;

type InventoryPayload = {
  generatedAt: string;
  rootFolderId: string;
  rootFolderName: string;
  maxDepth: number;
  tree: TreeFolder;
  filesFlat: ListedRow[];
};

function parseSizeBytes(s: string | null | undefined): number | null {
  if (s == null || s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function getDriveClient(): drive_v3.Drive {
  const privateKey = normalizeGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();

  if (!privateKey || !clientEmail) {
    throw new Error(
      "Missing GOOGLE_PRIVATE_KEY or GOOGLE_CLIENT_EMAIL in .env.local (same as GTP submissions).",
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

async function listChildren(
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

async function getEntryMeta(drive: drive_v3.Drive, fileId: string) {
  const res = await drive.files.get({
    fileId,
    fields: "id, name, mimeType",
    supportsAllDrives: true,
  });
  return res.data;
}

function sortByName(a: { name?: string | null }, b: { name?: string | null }) {
  return (a.name ?? "").localeCompare(b.name ?? "", undefined, {
    sensitivity: "base",
  });
}

/**
 * DFS: fills `filesFlat` with every non-folder item and returns a nested tree
 * (folders include all descendants).
 */
async function walkFolderTree(
  drive: drive_v3.Drive,
  folderId: string,
  folderName: string,
  folderPath: string,
  depth: number,
  maxDepth: number,
  filesFlat: ListedRow[],
): Promise<TreeFolder> {
  if (depth > maxDepth) {
    console.warn(
      `Skipping deeper than DRIVE_MAX_DEPTH=${maxDepth} under: ${folderPath}`,
    );
    return { type: "folder", id: folderId, name: folderName, children: [] };
  }

  const children = (await listChildren(drive, folderId)).sort(sortByName);
  const treeChildren: TreeEntry[] = [];

  for (const f of children) {
    const id = f.id;
    const name = f.name;
    const mimeType = f.mimeType;
    if (!id || !name || !mimeType) continue;

    const childPath = `${folderPath}/${name}`;

    if (mimeType === FOLDER_MIME) {
      const subtree = await walkFolderTree(
        drive,
        id,
        name,
        childPath,
        depth + 1,
        maxDepth,
        filesFlat,
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

function summarizeMimeTypes(rows: ListedRow[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of rows) {
    m.set(r.mimeType, (m.get(r.mimeType) ?? 0) + 1);
  }
  return m;
}

/** Drive file/folder ids are URL-safe strings (typically 25+ chars). */
function folderIdFromArgv(): string {
  const idLike = /^[a-zA-Z0-9_-]{15,}$/;
  for (let i = process.argv.length - 1; i >= 2; i--) {
    const s = process.argv[i]?.trim() ?? "";
    if (idLike.test(s)) return s;
  }
  return "";
}

function resolveOutputFile(folderId: string): string {
  const raw = process.env.DRIVE_OUTPUT?.trim();
  if (raw) {
    return path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
  }
  return path.join(
    process.cwd(),
    "scripts",
    "data",
    `drive-inventory-${folderId}.json`,
  );
}

function shouldWriteFile(): boolean {
  if (process.env.DRIVE_OUTPUT?.trim()) return true;
  return process.env.DRIVE_SAVE === "1";
}

function main() {
  const folderId =
    process.env.DRIVE_FOLDER_ID?.trim() || folderIdFromArgv();

  if (!folderId) {
    console.error(
      "Set DRIVE_FOLDER_ID or pass the folder id as the first argument.\n" +
        "Example: DRIVE_FOLDER_ID=12wI... npm run inventory-drive-folder\n" +
        "   or: npm run inventory-drive-folder -- 12wI...",
    );
    process.exit(1);
  }

  const maxDepth = Math.max(
    1,
    Number.parseInt(process.env.DRIVE_MAX_DEPTH ?? "30", 10) || 30,
  );

  return runInventory(folderId, maxDepth);
}

async function runInventory(folderId: string, maxDepth: number) {
  const drive = getDriveClient();
  const filesFlat: ListedRow[] = [];

  let rootName = folderId;
  let tree: TreeFolder;

  try {
    const meta = await getEntryMeta(drive, folderId);
    if (meta.mimeType !== FOLDER_MIME) {
      console.error(
        `Expected a folder id; got mimeType=${meta.mimeType ?? "(unknown)"}`,
      );
      process.exit(1);
    }
    rootName = meta.name ?? folderId;

    tree = await walkFolderTree(
      drive,
      folderId,
      rootName,
      `/${rootName}`,
      0,
      maxDepth,
      filesFlat,
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Drive API error:", msg);
    console.error(
      "\nCheck: Drive API enabled, .env.local credentials, and that this folder is shared with GOOGLE_CLIENT_EMAIL (Viewer).",
    );
    process.exit(1);
  }

  const payload: InventoryPayload = {
    generatedAt: new Date().toISOString(),
    rootFolderId: folderId,
    rootFolderName: rootName,
    maxDepth,
    tree,
    filesFlat,
  };

  if (shouldWriteFile()) {
    const outPath = resolveOutputFile(folderId);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(payload, null, 2), "utf8");
    console.log(`Wrote inventory (${filesFlat.length} files): ${outPath}`);
  }

  if (process.env.DRIVE_JSON === "1") {
    console.log(JSON.stringify(filesFlat, null, 2));
    return;
  }

  const byMime = summarizeMimeTypes(filesFlat);
  const mimeSorted = [...byMime.entries()].sort((a, b) => b[1] - a[1]);

  let totalBytes = 0;
  let counted = 0;
  for (const r of filesFlat) {
    const b = parseSizeBytes(r.size);
    if (b != null) {
      totalBytes += b;
      counted += 1;
    }
  }

  console.log(`Folder root id: ${folderId}`);
  console.log(`Root name: ${rootName}`);
  console.log(`Files found (recursive): ${filesFlat.length}`);
  console.log(
    `Total size (sum of file.size where present): ${totalBytes} bytes across ${counted} files with a size field`,
  );
  console.log("\nBy MIME type:");
  for (const [mime, n] of mimeSorted) {
    console.log(`  ${n}\t${mime}`);
  }

  const withSize = filesFlat
    .map((r) => ({
      ...r,
      bytes: parseSizeBytes(r.size),
    }))
    .filter((r): r is ListedRow & { bytes: number } => r.bytes != null)
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 15);

  if (withSize.length > 0) {
    console.log("\nLargest files (by Drive size field):");
    for (const r of withSize) {
      const mb = (r.bytes / (1024 * 1024)).toFixed(2);
      console.log(`  ${mb} MiB\t${r.name}\t${r.mimeType}`);
    }
  }

  if (!shouldWriteFile()) {
    console.log(
      "\nTip: DRIVE_JSON=1 prints flat JSON to stdout. DRIVE_SAVE=1 writes tree + flat JSON under scripts/data/ (gitignored). DRIVE_OUTPUT=path overrides the file path.",
    );
  }
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
