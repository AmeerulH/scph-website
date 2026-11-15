/**
 * Imports the pre-screened MPN resource subset from a saved Google Drive
 * inventory into the private Supabase `resources` bucket.
 *
 * This deliberately does not import files that may contain personal data,
 * nor report/survey/guidance materials that need a person to review them.
 *
 * Usage:
 *   npm run import-mpn-drive-resources
 *   CONFIRM_MPN_DRIVE_IMPORT=1 npm run import-mpn-drive-resources
 *
 * Optional:
 *   MPN_IMPORT_UPLOADED_BY=<admin profile UUID>
 *   DRIVE_INVENTORY_PATH=scripts/data/drive-inventory-<folder-id>.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { driveOpenMediaDownloadStream, getDriveReadonlyClient, type DriveListedRow } from "../src/lib/google-drive-client";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const ROOT_FOLDER_ID = "12wIHgcAFtO0VERh8rKozjapHfQckiBp8";
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const RESOURCE_BUCKET = "resources";
const CONFIRM_IMPORT = process.env.CONFIRM_MPN_DRIVE_IMPORT === "1";

const SUPPORTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const PRIVATE_CONTENT_PATTERN =
  /\b(certificates?|participants?|attendees?|attendance|registration|contacts?|admin|internal|private)\b/i;
const MANUAL_REVIEW_PATTERN =
  /\b(reports?|surveys?|feedback|evaluations?|guidance|agendas?|speaker profiles?|biograph(?:y|ies)|curriculum vitae|cv)\b/i;
const MANUAL_REVIEW_PATHS = new Set([
  "/Workshop Resources /1. Workshop April 01/24 Climate, Air Pollution and Health/Presentations/(0) 20240415 - Workshop Intro Slides.pdf",
  "/Workshop Resources /1. Workshop April 01/24 Climate, Air Pollution and Health/Presentations/(3B) Reporting Tips - Nidhi Jamwal.pdf",
  "/Workshop Resources /2. Workshop Feb 01/25 Extreme Heat and Health/Presentations/10. Ludwig Federigan - Enhancing Climate Reporting.pdf",
  "/Workshop Resources /2. Workshop Feb 01/25 Extreme Heat and Health/Simulation Exercise/Scenario Group 1 Presentation.pdf",
  "/Workshop Resources /2. Workshop Feb 01/25 Extreme Heat and Health/Simulation Exercise/Scenario Group 2 Presentation.pdf",
  "/Workshop Resources /2. Workshop Feb 01/25 Extreme Heat and Health/Simulation Exercise/Scenario Group 3 Presentation.pdf",
  "/Workshop Resources /3. Workshop June 02/25 Air and Plastic Pollution/Presentations/08. Owen Pinnell - Ethic of Reporting.pdf",
  "/Workshop Resources /4. Workshop Sept 03/25 Intergovernmental Processes/Presentations/2. Master Slides.pdf",
]);

const WORKSHOPS = {
  "1. Workshop April 01": { number: 1, theme: "Climate" },
  "2. Workshop Feb 01": { number: 2, theme: "Climate" },
  "3. Workshop June 02": { number: 3, theme: "Air Pollution" },
  "4. Workshop Sept 03": { number: 4, theme: "Planetary Health" },
  "5. Workshop Jan 01": { number: 5, theme: "Planetary Health" },
  "6. Workshop April 2": { number: 6, theme: "Climate" },
} as const;

type WorkshopFolder = keyof typeof WORKSHOPS;

type Inventory = {
  rootFolderId: string;
  filesFlat: DriveListedRow[];
};

type Candidate = {
  file: DriveListedRow;
  workshopNumber: number | null;
  theme: string;
  visibility: "members" | "workshop_alumni";
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

function getCandidate(file: DriveListedRow): Candidate | null {
  const size = file.size === null ? NaN : Number(file.size);
  if (
    !SUPPORTED_MIME_TYPES.has(file.mimeType) ||
    !Number.isFinite(size) ||
    size <= 0 ||
    size > MAX_FILE_SIZE_BYTES ||
    PRIVATE_CONTENT_PATTERN.test(`${file.path}/${file.name}`) ||
    MANUAL_REVIEW_PATTERN.test(`${file.path}/${file.name}`) ||
    MANUAL_REVIEW_PATHS.has(file.path)
  ) {
    return null;
  }

  const folder = firstFolderInPath(file);
  if (folder === "Shared Resources - PDF") {
    return {
      file,
      workshopNumber: null,
      theme: "Planetary Health",
      visibility: "members",
    };
  }

  if (folder && folder in WORKSHOPS) {
    const workshop = WORKSHOPS[folder as WorkshopFolder];
    return {
      file,
      workshopNumber: workshop.number,
      theme: workshop.theme,
      visibility: "workshop_alumni",
    };
  }

  return null;
}

function resourceTitle(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resourceType(name: string): string {
  if (/\b(tool\s*kit|toolbox)\b/i.test(name)) return "Toolkit";
  if (/\b(data|dataset)\b/i.test(name)) return "Dataset";
  if (/\b(book|handbook)\b/i.test(name)) return "Book";
  if (/\b(research|study)\b/i.test(name)) return "Research";
  return "Guide";
}

function extensionForMime(mimeType: string): string {
  return mimeType === "application/pdf" ? "pdf" : "docx";
}

function storagePath(candidate: Candidate): string {
  const scope = candidate.workshopNumber
    ? `workshop-${candidate.workshopNumber}`
    : "shared";
  return `drive-import/${scope}/${candidate.file.id}.${extensionForMime(candidate.file.mimeType)}`;
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
  const candidates = loadInventory().filesFlat.map(getCandidate).filter(
    (candidate): candidate is Candidate => candidate !== null,
  );

  console.log(
    `${CONFIRM_IMPORT ? "Importing" : "Previewing"} ${candidates.length} screened resource(s).`,
  );
  for (const candidate of candidates) {
    console.log(
      `${candidate.visibility}\t${candidate.workshopNumber ?? "shared"}\t${candidate.file.name}`,
    );
  }

  if (!CONFIRM_IMPORT) {
    console.log(
      "\nNo files were uploaded. Re-run with CONFIRM_MPN_DRIVE_IMPORT=1 after reviewing this list.",
    );
    return;
  }

  const uploaderId = await getUploaderId();
  const drive = getDriveReadonlyClient();
  const admin = createMpnAdminClient();
  let imported = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    const fileUrl = storagePath(candidate);
    const { data: existing, error: existingError } = await admin
      .from("resources")
      .select("id")
      .eq("file_url", fileUrl)
      .maybeSingle();
    if (existingError) throw new Error(`Unable to check ${candidate.file.name}: ${existingError.message}`);
    if (existing) {
      skipped += 1;
      console.log(`Skipped existing: ${candidate.file.name}`);
      continue;
    }

    const workshopId = candidate.workshopNumber
      ? (
          await admin
            .from("workshops")
            .select("id")
            .eq("number", candidate.workshopNumber)
            .single()
        ).data?.id
      : null;
    if (candidate.workshopNumber && !workshopId) {
      throw new Error(`Workshop ${candidate.workshopNumber} is missing from Supabase.`);
    }

    const content = await streamToBuffer(
      await driveOpenMediaDownloadStream(drive, candidate.file.id),
    );
    if (content.byteLength > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Drive returned an oversized file: ${candidate.file.name}`);
    }

    const { error: uploadError } = await admin.storage
      .from(RESOURCE_BUCKET)
      .upload(fileUrl, content, {
        contentType: candidate.file.mimeType,
        upsert: false,
      });
    if (uploadError) throw new Error(`Upload failed for ${candidate.file.name}: ${uploadError.message}`);

    const { error: insertError } = await admin.from("resources").insert({
      title: resourceTitle(candidate.file.name),
      type: resourceType(candidate.file.name),
      theme: candidate.theme,
      source: `Google Drive: ${candidate.file.path}`,
      file_url: fileUrl,
      visibility: candidate.visibility,
      workshop_id: workshopId,
      uploaded_by: uploaderId,
      tags: [
        "Google Drive import",
        ...(candidate.workshopNumber
          ? [`Workshop ${candidate.workshopNumber}`]
          : ["Shared resource"]),
      ],
    });
    if (insertError) {
      await admin.storage.from(RESOURCE_BUCKET).remove([fileUrl]);
      throw new Error(`Database insert failed for ${candidate.file.name}: ${insertError.message}`);
    }

    imported += 1;
    console.log(`Imported: ${candidate.file.name}`);
  }

  console.log(`Complete. Imported: ${imported}; skipped existing: ${skipped}.`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
