/** Import only explicitly keyed research sessions from an approved JSON source. */
import {createClient} from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";
import {readFile, writeFile} from "node:fs/promises";
import {prepareResearchSchedule} from "./lib/gtp-research-schedule";

dotenv.config({path: path.join(process.cwd(), ".env.local")});

async function main() {
  const sourcePath = process.argv[2];
  if (!sourcePath) throw new Error("Provide the approved research-schedule JSON file path. See docs/gtp-combined-programme-editing.md.");
  const dataset = process.env.SANITY_DATASET ?? "production";
  const id = "gtp2026Programme";
  const client = createClient({projectId: "y0tkemxm", dataset, apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN?.trim()});
  const documents = await client.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, {ids: [id, `drafts.${id}`]});
  const programme = documents.find((document) => document._id === id);
  if (!programme || typeof programme._rev !== "string") throw new Error("The published programme is missing.");
  const operations = prepareResearchSchedule(JSON.parse(await readFile(sourcePath, "utf8")), programme);
  console.log(JSON.stringify({dataset, revision: programme._rev, operations, untouched: "Other sessions, days, assets and draft documents"}, null, 2));
  if (process.env.DRY_RUN === "1") return;
  if (dataset === "production" && process.env.ALLOW_PRODUCTION !== "1") throw new Error("Refusing production without explicit patch approval and ALLOW_PRODUCTION=1.");
  if (!process.env.SANITY_API_TOKEN?.trim()) throw new Error("SANITY_API_TOKEN is required for a content write.");
  const backupPath = process.env.SANITY_BACKUP_PATH || `/tmp/gtp-research-${dataset}-${Date.now()}.json`;
  await writeFile(backupPath, JSON.stringify(documents, null, 2), {mode: 0o600, flag: "wx"});
  console.log(`Saved full published/draft snapshot with asset references to ${backupPath}`);
  let patch = client.patch(id).ifRevisionId(programme._rev);
  for (const operation of operations) {
    if (operation.existing) {
      const target = `${operation.path}[_key==${JSON.stringify(operation.session._key)}]`;
      patch = patch.set({[`${target}.title`]: operation.session.title, [`${target}.time`]: operation.session.time,
        [`${target}.workshops`]: operation.session.workshops,
        ...(typeof operation.session.venueLine === "string" ? {[`${target}.venueLine`]: operation.session.venueLine} : {})});
    } else {
      patch = patch.setIfMissing({[operation.path]: []}).insert("after", `${operation.path}[-1]`, [operation.session]);
    }
  }
  await patch.commit();
  console.log("Published the reviewed research-session changes. Re-query the public programme and inspect both routes.");
}

main().catch((error) => {console.error(error instanceof Error ? error.message : "Import failed"); process.exitCode = 1;});
