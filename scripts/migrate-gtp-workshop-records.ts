import {createClient} from "@sanity/client";
import {config} from "dotenv";
import {readFile, writeFile} from "node:fs/promises";
import {isDeepStrictEqual} from "node:util";
import {prepareWorkshopMigration} from "./lib/gtp-workshop-migration";

config({path: ".env.local", quiet: true});

async function main() {
  const dataset = process.env.SANITY_DATASET ?? "production";
  const dryRun = process.env.DRY_RUN === "1";
  if (process.env.SNAPSHOT_PATH && !dryRun) throw new Error("Offline snapshots are for dry runs only");
  const client = createClient({projectId: "y0tkemxm", dataset, apiVersion: "2025-02-19", perspective: "raw", useCdn: false, token: process.env.SANITY_API_TOKEN?.trim()});
  const ids = ["gtp2026Programme", "drafts.gtp2026Programme", "gtp2026ProgrammeActivityPage-action-workshops", "drafts.gtp2026ProgrammeActivityPage-action-workshops"];
  const documents = process.env.SNAPSHOT_PATH
    ? JSON.parse(await readFile(process.env.SNAPSHOT_PATH, "utf8"))
    : await client.fetch<Record<string, unknown>[]>("*[_id in $ids]", {ids});
  const mapping = JSON.parse(await readFile("scripts/data/gtp-workshop-artwork-migration.json", "utf8"));
  const plan = prepareWorkshopMigration(documents, mapping);
  const reviewed = {dataset, patches: plan.patches};
  console.log(JSON.stringify({dataset, dryRun, patches: plan.patches, report: plan.report}, null, 2));
  if (process.env.MIGRATION_PLAN_PATH) {
    if (!dryRun) throw new Error("Plan exports require DRY_RUN=1");
    await writeFile(process.env.MIGRATION_PLAN_PATH, JSON.stringify(reviewed, null, 2), {mode: 0o600, flag: "wx"});
  }
  if (process.env.MIGRATION_PREVIEW_PATH) {
    if (!dryRun) throw new Error("Preview exports require DRY_RUN=1");
    await writeFile(process.env.MIGRATION_PREVIEW_PATH, JSON.stringify(plan.preview, null, 2), {mode: 0o600, flag: "wx"});
  }
  if (dryRun || !plan.patches.length) return;
  if (dataset === "production" && process.env.ALLOW_PRODUCTION !== "1") throw new Error("Production requires exact-change approval and ALLOW_PRODUCTION=1");
  if (!process.env.APPROVED_PLAN_PATH) throw new Error("An exact reviewed dry-run plan is required");
  const approved = JSON.parse(await readFile(process.env.APPROVED_PLAN_PATH, "utf8"));
  if (!isDeepStrictEqual(approved, reviewed)) throw new Error("CMS revisions or changes differ from the reviewed plan; regenerate the dry run");
  if (!process.env.SANITY_API_TOKEN?.trim()) throw new Error("A write token is required");
  const backupPath = process.env.SANITY_BACKUP_PATH || `/tmp/gtp-workshops-${dataset}-${Date.now()}.json`;
  await writeFile(backupPath, JSON.stringify(documents, null, 2), {mode: 0o600, flag: "wx"});
  console.log(`Private full published/draft backup: ${backupPath}`);
  let transaction = client.transaction();
  for (const operation of plan.patches) {
    let patch = client.patch(operation.id).ifRevisionId(operation.revision).set(operation.set);
    if (operation.unset.length) patch = patch.unset(operation.unset);
    transaction = transaction.patch(patch);
  }
  await transaction.commit();
  const current = await client.fetch<Record<string, unknown>[]>("*[_id in $ids]", {ids});
  const expected = (docs: Record<string, unknown>[]) => docs.map(({_rev, _updatedAt, ...doc}) => {
    void _rev; void _updatedAt; return doc;
  }).sort((a, b) => String(a._id).localeCompare(String(b._id)));
  // Object key order is not a content fact. Compare parsed JSON with deep strict equality.
  if (!isDeepStrictEqual(expected(current), expected(plan.preview))) throw new Error("Post-write content differs; inspect private backup and re-query");
  console.log("Verified the exact migrated documents; legacy artwork retained, unrelated fields preserved.");
}

main().catch((error: unknown) => {
  // Never serialize Sanity client errors: request configuration can include credentials.
  const safe = error as {code?: string; statusCode?: number};
  console.error("Workshop migration stopped:", safe.code || safe.statusCode || "validation_or_request_failure");
  process.exitCode = 1;
});
