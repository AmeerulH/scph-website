/**
 * Imports the curated MPN shared-resource catalogue from Google Sheets.
 *
 * Usage:
 *   npm run import-mpn-shared-resources
 *   CONFIRM_MPN_SHARED_RESOURCES_IMPORT=1 npm run import-mpn-shared-resources
 */

import * as dotenv from "dotenv";
import { google, type sheets_v4 } from "googleapis";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const SPREADSHEET_ID = "1UMgJtKank0qjLSBtuVzRCDHCyV3MFlc6zKiIl7XBJTM";
const RESOURCE_RANGE = "Resources!A3:G1056";
const CONFIRM_IMPORT =
  process.env.CONFIRM_MPN_SHARED_RESOURCES_IMPORT === "1";

type SharedResource = {
  sheet_row: number;
  title: string;
  description: string | null;
  resource_type: string;
  themes: string[];
  published_date: string | null;
  external_url: string | null;
  file_url: string | null;
};

function googlePrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY?.trim().replace(/\\n/g, "\n");
}

function getSheetsClient() {
  const privateKey = googlePrivateKey();
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  if (!privateKey || !clientEmail) {
    throw new Error("GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY must be set.");
  }
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}

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

function cellValue(cell: sheets_v4.Schema$CellData | undefined): string {
  return cell?.formattedValue?.trim() ?? "";
}

function parseDate(value: string): string | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function urlFromCell(cell: sheets_v4.Schema$CellData | undefined): string | null {
  const value = cellValue(cell);
  const candidate = cell?.hyperlink?.trim() || value;
  return /^https?:\/\//i.test(candidate) ? candidate : null;
}

function getResources(sheet: sheets_v4.Schema$Sheet): SharedResource[] {
  const rowData = sheet.data?.[0]?.rowData ?? [];
  const startRow = (sheet.data?.[0]?.startRow ?? 0) + 1;

  return rowData.flatMap((row, index) => {
    const cells = row.values ?? [];
    const number = cellValue(cells[0]);
    const title = cellValue(cells[3]);
    const resourceType = cellValue(cells[4]);
    if (!number || !title || !resourceType) return [];

    const link = urlFromCell(cells[5]);
    return [
      {
        sheet_row: startRow + index,
        title,
        description: cellValue(cells[6]) || null,
        resource_type: resourceType,
        themes: cellValue(cells[2])
          .split(",")
          .map((theme) => theme.trim())
          .filter(Boolean),
        published_date: parseDate(cellValue(cells[1])),
        external_url: link,
        file_url: link?.includes("drive.google.com") ? link : null,
      },
    ];
  });
}

async function main() {
  const sheets = getSheetsClient();
  const { data } = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    ranges: [RESOURCE_RANGE],
    includeGridData: true,
    fields: "sheets(data(startRow,rowData(values(formattedValue,hyperlink))))",
  });
  const resources = getResources(data.sheets?.[0] ?? {});

  if (resources.length === 0) {
    throw new Error("No complete resource rows were found in the Resources sheet.");
  }

  console.log(
    `${CONFIRM_IMPORT ? "Importing" : "Previewing"} ${resources.length} shared resource row(s).`,
  );
  for (const resource of resources) {
    console.log(
      `${resource.sheet_row}\t${resource.resource_type}\t${resource.title}`,
    );
  }

  if (!CONFIRM_IMPORT) {
    console.log(
      "\nNo rows were written. Re-run with CONFIRM_MPN_SHARED_RESOURCES_IMPORT=1 after reviewing this list.",
    );
    return;
  }

  const { error } = await createMpnAdminClient()
    .from("shared_resources")
    .upsert(resources, { onConflict: "sheet_row" });
  if (error) throw new Error(`Shared resource import failed: ${error.message}`);

  console.log(`Complete. Imported or updated ${resources.length} shared resource row(s).`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
