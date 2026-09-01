/**
 * Imports original workshop photos from the saved Drive inventory to the
 * private MPN gallery bucket and creates their gallery metadata.
 *
 * Usage:
 *   npm run import-mpn-workshop-photos
 *   CONFIRM_MPN_WORKSHOP_PHOTO_IMPORT=1 npm run import-mpn-workshop-photos
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import {
  driveOpenMediaDownloadStream,
  getDriveReadonlyClient,
  type DriveListedRow,
} from "../src/lib/google-drive-client";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const ROOT_FOLDER_ID = "12wIHgcAFtO0VERh8rKozjapHfQckiBp8";
const PHOTO_BUCKET = "workshop-photos";
const CONFIRM_IMPORT = process.env.CONFIRM_MPN_WORKSHOP_PHOTO_IMPORT === "1";

const WORKSHOP_FOLDERS = {
  "1. Workshop April 01": 1,
  "2. Workshop Feb 01": 2,
  "3. Workshop June 02": 3,
  "4. Workshop Sept 03": 4,
  "5. Workshop Jan 01": 5,
  "6. Workshop April 2": 6,
  "7. Workshop 3": 7,
} as const;

const PHOTO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heif",
]);

type WorkshopFolder = keyof typeof WORKSHOP_FOLDERS;

type Inventory = {
  rootFolderId: string;
  filesFlat: DriveListedRow[];
};

type PhotoCandidate = {
  file: DriveListedRow;
  workshopNumber: number;
  bytes: number;
  sortOrder: number;
};

function createMpnAdminClient() {
  const url = process.env.NEXT_PUBLIC_MPN_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.MPN_SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_MPN_SUPABASE_URL and MPN_SUPABASE_SERVICE_ROLE_KEY must be set.",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getInventoryPath(): string {
  const configured = process.env.DRIVE_INVENTORY_PATH?.trim();
  return configured
    ? path.resolve(process.cwd(), configured)
    : path.join(
        process.cwd(),
        "scripts",
        "data",
        `drive-inventory-${ROOT_FOLDER_ID}.json`,
      );
}

function loadInventory(): Inventory {
  const inventoryPath = getInventoryPath();
  const parsed = JSON.parse(fs.readFileSync(inventoryPath, "utf8")) as Inventory;
  if (parsed.rootFolderId !== ROOT_FOLDER_ID || !Array.isArray(parsed.filesFlat)) {
    throw new Error(`Invalid Drive inventory: ${inventoryPath}`);
  }
  return parsed;
}

function firstFolderInPath(file: DriveListedRow): string | null {
  return file.path.split("/").filter(Boolean)[1] ?? null;
}

function extensionFor(file: DriveListedRow): string {
  const extension = path.extname(file.name).toLowerCase().replace(".", "");
  if (extension) return extension;
  return file.mimeType === "image/png" ? "png" : "jpg";
}

function storagePath(photo: PhotoCandidate): string {
  return `workshop-${photo.workshopNumber}/${photo.file.id}.${extensionFor(photo.file)}`;
}

function getPhotoCandidates(inventory: Inventory): PhotoCandidate[] {
  const candidates = inventory.filesFlat.flatMap((file) => {
    if (!PHOTO_MIME_TYPES.has(file.mimeType)) return [];
    const bytes = Number(file.size);
    if (!Number.isFinite(bytes) || bytes <= 0) return [];

    const folder = firstFolderInPath(file);
    if (!folder || !(folder in WORKSHOP_FOLDERS)) return [];

    return [
      {
        file,
        workshopNumber: WORKSHOP_FOLDERS[folder as WorkshopFolder],
        bytes,
        sortOrder: 0,
      },
    ];
  });

  candidates.sort((a, b) => a.file.path.localeCompare(b.file.path));
  for (const [index, candidate] of candidates.entries()) {
    candidate.sortOrder = index;
  }

  return candidates;
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function getUploaderId() {
  const admin = createMpnAdminClient();
  const configured = process.env.MPN_IMPORT_UPLOADED_BY?.trim();

  if (configured) {
    const { data, error } = await admin
      .from("profiles")
      .select("id, role")
      .eq("id", configured)
      .maybeSingle();
    if (error || !data || data.role !== "admin") {
      throw new Error("MPN_IMPORT_UPLOADED_BY must identify an admin profile.");
    }
    return data.id;
  }

  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(2);
  if (error) throw new Error(`Unable to load MPN admins: ${error.message}`);
  if (data.length !== 1) {
    throw new Error(
      "Set MPN_IMPORT_UPLOADED_BY to an admin profile UUID when there is not exactly one MPN admin.",
    );
  }
  return data[0].id;
}

async function main() {
  const candidates = getPhotoCandidates(loadInventory());
  const totalBytes = candidates.reduce((total, photo) => total + photo.bytes, 0);

  console.log(
    `${CONFIRM_IMPORT ? "Importing" : "Previewing"} ${candidates.length} photo(s) (${(totalBytes / 1024 ** 3).toFixed(2)} GiB).`,
  );

  if (!CONFIRM_IMPORT) {
    console.log(
      "\nNo photos were uploaded. Re-run with CONFIRM_MPN_WORKSHOP_PHOTO_IMPORT=1 after reviewing this list.",
    );
    return;
  }

  const uploaderId = await getUploaderId();
  const drive = getDriveReadonlyClient();
  const admin = createMpnAdminClient();
  const { data: workshops, error: workshopError } = await admin
    .from("workshops")
    .select("id, number")
    .in("number", [1, 2, 3, 4, 5, 6, 7]);
  if (workshopError) throw new Error(`Unable to load workshops: ${workshopError.message}`);

  const workshopIds = new Map(
    (workshops ?? []).map((workshop) => [workshop.number, workshop.id]),
  );
  if (workshopIds.size !== 7) {
    throw new Error("All Workshops 1–7 must exist before importing photos.");
  }

  let imported = 0;
  let skipped = 0;
  for (const photo of candidates) {
    const { data: existing, error: existingError } = await admin
      .from("workshop_photos")
      .select("id")
      .eq("drive_file_id", photo.file.id)
      .maybeSingle();
    if (existingError) throw new Error(`Unable to check ${photo.file.name}: ${existingError.message}`);
    if (existing) {
      skipped += 1;
      continue;
    }

    const body = await streamToBuffer(
      await driveOpenMediaDownloadStream(drive, photo.file.id),
    );
    const { error: uploadError } = await admin.storage
      .from(PHOTO_BUCKET)
      .upload(storagePath(photo), body, {
        contentType: photo.file.mimeType,
        upsert: false,
      });
    if (uploadError && !/already exists/i.test(uploadError.message)) {
      throw new Error(`Upload failed for ${photo.file.name}: ${uploadError.message}`);
    }

    const { error: insertError } = await admin.from("workshop_photos").insert({
      workshop_id: workshopIds.get(photo.workshopNumber),
      drive_file_id: photo.file.id,
      storage_path: storagePath(photo),
      original_name: photo.file.name,
      content_type: photo.file.mimeType,
      bytes: photo.bytes,
      sort_order: photo.sortOrder,
      uploaded_by: uploaderId,
    });
    if (insertError) {
      await admin.storage.from(PHOTO_BUCKET).remove([storagePath(photo)]);
      throw new Error(`Database insert failed for ${photo.file.name}: ${insertError.message}`);
    }

    imported += 1;
    console.log(`Imported: ${photo.file.name}`);
  }

  console.log(`Complete. Imported: ${imported}; skipped existing: ${skipped}.`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
