import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

type SeedDocument = { _id: string; _type: string; [key: string]: unknown };

export async function runLibrarySeed(documents: SeedDocument[]) {
  config({ path: resolve(".env.local"), quiet: true });
  const dataset = process.env.SANITY_DATASET ?? "production";
  if (process.env.APPLY !== "1" || process.env.DRY_RUN === "1") {
    console.log(JSON.stringify({ dataset, mode: "dry-run", documents }, null, 2));
    return;
  }
  if (dataset === "production" && process.env.ALLOW_PRODUCTION !== "1") throw new Error("Production writes require explicit approval and ALLOW_PRODUCTION=1.");
  if (!process.env.SANITY_API_TOKEN) throw new Error("SANITY_API_TOKEN is required for writes.");
  const client = createClient({ projectId: "y0tkemxm", dataset, apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN });
  const ids = documents.flatMap(d => [d._id, `drafts.${d._id}`]);
  const existing = await client.fetch<SeedDocument[]>("*[_id in $ids]", { ids }, { perspective: "raw" });
  const dir = join(tmpdir(), "gtp-library-backups");
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const backup = join(dir, `seed-${dataset}-${Date.now()}.json`);
  await writeFile(backup, JSON.stringify({ dataset, documents: existing }, null, 2), { mode: 0o600, flag: "wx" });
  const transaction = client.transaction();
  for (const document of documents) {
    const { _id, _type, ...fields } = document;
    if (_type === "gtp2026ResourcesPage" || _type === "gtp2026MediaPage") {
      transaction.createIfNotExists({ _id, _type });
      transaction.patch(_id, p => p.setIfMissing(fields));
    } else transaction.createIfNotExists(document);
  }
  await transaction.commit({ visibility: "sync" });
  console.log(`Created missing shells/settings in ${dataset}. Backup: ${backup}. Existing resources, files and videos were preserved; video cutover was not enabled.`);
}
