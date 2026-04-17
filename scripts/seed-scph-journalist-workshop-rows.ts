/**
 * Upserts `workshops[]` on Sanity `scphJournalistWorkshopsPage` from JSON (Drive folder ids + slugs).
 *
 * Source: [`scripts/data/journalist-workshops-seed.json`](scripts/data/journalist-workshops-seed.json)
 * (derived from Workshop Resources inventory). Does **not** replace page title/intro if the document
 * already exists—only patches `workshops`. Creates the singleton shell if missing (same as page seed).
 *
 * **Access codes:** Defaults use `REPLACE-ME-*` placeholders. To set real codes without editing the
 * committed JSON, run with:
 *   `JOURNALIST_WORKSHOP_ACCESS_CODES='code1,code2,...,code7' npm run seed-scph-journalist-workshop-rows`
 * (seven comma-separated values, same order as in the JSON file.)
 *
 * Prerequisites: SANITY_API_TOKEN, schema deployed (`scphJournalistWorkshopsPage` exists in Studio).
 *
 * Usage:
 *   npm run seed-scph-journalist-workshop-rows
 *   DRY_RUN=1 npm run seed-scph-journalist-workshop-rows
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "scphJournalistWorkshopsPage";
const SEED_PATH = path.join(
  process.cwd(),
  "scripts",
  "data",
  "journalist-workshops-seed.json",
);

type SeedWorkshop = {
  title: string;
  slug: string;
  accessCode: string;
  driveFolderId: string;
  enabled?: boolean;
  sortOrder?: number;
};

type SeedFile = {
  workshops: SeedWorkshop[];
};

function loadSeed(): SeedFile {
  const raw = fs.readFileSync(SEED_PATH, "utf8");
  const parsed = JSON.parse(raw) as SeedFile;
  if (!Array.isArray(parsed.workshops) || parsed.workshops.length === 0) {
    throw new Error(`Invalid seed: ${SEED_PATH} must contain a non-empty workshops array.`);
  }
  return parsed;
}

function codesFromEnv(count: number): string[] | null {
  const raw = process.env.JOURNALIST_WORKSHOP_ACCESS_CODES?.trim();
  if (!raw) return null;
  const parts = raw.split(",").map((s) => s.trim());
  if (parts.length !== count) {
    throw new Error(
      `JOURNALIST_WORKSHOP_ACCESS_CODES must have exactly ${count} comma-separated values (got ${parts.length}).`,
    );
  }
  return parts;
}

function buildWorkshopsForSanity(seed: SeedFile): Record<string, unknown>[] {
  const envCodes = codesFromEnv(seed.workshops.length);
  return seed.workshops.map((w, i) => {
    const code = envCodes?.[i] ?? w.accessCode;
    if (!code?.trim()) {
      throw new Error(`Missing accessCode for workshop index ${i} (${w.title}).`);
    }
    return {
      _type: "scphJournalistWorkshopRow",
      _key: w.slug.replace(/[^a-z0-9-]/gi, "-").slice(0, 40) || `w-${i}`,
      title: w.title,
      slug: { _type: "slug", current: w.slug },
      accessCode: code.trim(),
      driveFolderId: w.driveFolderId,
      enabled: w.enabled !== false,
      sortOrder: typeof w.sortOrder === "number" ? w.sortOrder : i,
    };
  });
}

function buildShellDocument(workshops: Record<string, unknown>[]) {
  return {
    _id: DOC_ID,
    _type: "scphJournalistWorkshopsPage",
    internalTitle: "Journalist workshops",
    pageTitle: "Journalist workshops",
    intro: "",
    workshops,
  };
}

async function main() {
  const seed = loadSeed();
  const workshops = buildWorkshopsForSanity(seed);

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify({ workshops }, null, 2));
    return;
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error("SANITY_API_TOKEN is not set in .env.local.");
    process.exit(1);
  }

  const dataset = process.env.SANITY_DATASET ?? "production";

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });

  const existing = await client.fetch<boolean>(
    `defined(*[_id == $id][0]._id)`,
    { id: DOC_ID },
  );

  if (!existing) {
    await client.createOrReplace(buildShellDocument(workshops));
    console.log(
      `Created ${DOC_ID} with ${workshops.length} workshop row(s) on "${dataset}". Publish in Studio.`,
    );
    return;
  }

  await client.patch(DOC_ID).set({ workshops }).commit();
  console.log(
    `Patched ${DOC_ID}.workshops (${workshops.length} row(s)) on "${dataset}". Publish in Studio if drafts are used.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
