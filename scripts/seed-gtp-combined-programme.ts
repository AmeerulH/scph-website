/** Add only missing combined-page copy fields. Never replaces the programme agenda. */
import {createClient} from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";
import {writeFile} from "node:fs/promises";

dotenv.config({path: path.join(process.cwd(), ".env.local")});

const dataset = process.env.SANITY_DATASET ?? "production";
const id = "gtp2026ProgrammeActivityPage-action-workshops";
const missingFields = {
  combinedIntro: "Action Workshops and Research Sessions run simultaneously. Explore both activities below.",
  actionWorkshopsTitle: "Action Workshops",
  researchSessionsTitle: "Research Sessions",
};

async function main() {
  const client = createClient({projectId: "y0tkemxm", dataset, apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN?.trim()});
  const existing = await client.fetch<{_id: string; _rev: string; [key: string]: unknown} | null>(`*[_id == $id][0]`, {id});
  if (!existing) throw new Error("Create the Action Workshops activity-page document in Studio before adding these fields.");
  const proposed = Object.fromEntries(Object.entries(missingFields).filter(([key]) => existing[key] == null));
  console.log(JSON.stringify({dataset, document: id, revision: existing._rev, setIfMissing: proposed, agendaChanged: false}, null, 2));
  if (process.env.DRY_RUN === "1" || !Object.keys(proposed).length) return;
  if (dataset === "production" && process.env.ALLOW_PRODUCTION !== "1") throw new Error("Refusing production without ALLOW_PRODUCTION=1 and explicit approval of this patch.");
  if (!process.env.SANITY_API_TOKEN?.trim()) throw new Error("SANITY_API_TOKEN is required for a content write.");
  const documents = await client.fetch<unknown[]>(`*[_id in $ids]`, {ids: [id, `drafts.${id}`]});
  const backupPath = process.env.SANITY_BACKUP_PATH || `/tmp/gtp-combined-copy-${dataset}-${Date.now()}.json`;
  await writeFile(backupPath, JSON.stringify(documents, null, 2), {mode: 0o600, flag: "wx"});
  console.log(`Saved full snapshot with asset references to ${backupPath}`);
  await client.patch(id).ifRevisionId(existing._rev).setIfMissing(proposed).commit();
  console.log("Added missing fields. Existing copy, arrays and asset references were preserved.");
}

main().catch((error) => {console.error(error instanceof Error ? error.message : "Seed failed"); process.exitCode = 1;});
