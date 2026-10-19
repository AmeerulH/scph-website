import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { assertMigrationParity, canonicalContent, migrationVideoDocuments, type MigrationDocument } from "./lib/gtp-video-migration";

async function main() {
  config({ path: resolve(".env.local"), quiet: true });
  const dataset = process.env.SANITY_DATASET ?? "production";
  const apply = process.env.APPLY === "1" && process.env.DRY_RUN !== "1";
  if (apply && dataset === "production" && process.env.ALLOW_PRODUCTION !== "1") throw new Error("Production migration requires explicit approval and ALLOW_PRODUCTION=1.");
  if (apply && !process.env.SANITY_API_TOKEN) throw new Error("SANITY_API_TOKEN is required for writes.");
  const client = createClient({ projectId: "y0tkemxm", dataset, apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN });
  const sourceId = "gtp2026MediaPage";
  const sourceDocuments = await client.fetch<MigrationDocument[]>("*[_id in $ids]", { ids: [sourceId, `drafts.${sourceId}`] }, { perspective: "raw" });
  const source = sourceDocuments.find(d => d._id === sourceId);
  if (!source?._rev) throw new Error("Published Media document is missing.");
  if (source.useVideoLibrary === true) { console.log("Individual video library is already active. No writes performed."); return; }
  if (sourceDocuments.some(d => d._id.startsWith("drafts."))) throw new Error("Media has an unpublished draft. Resolve it before migrating; publishing it later could undo cutover.");
  const videos = migrationVideoDocuments(source);
  const targets = videos.length ? await client.fetch<MigrationDocument[]>("*[_id in $ids]", { ids: videos.flatMap(d => [d._id, `drafts.${d._id}`]) }, { perspective: "raw" }) : [];
  assertMigrationParity(videos, targets);
  const plan = { projectId: "y0tkemxm", dataset, sourceId, sourceRevision: source._rev,
    targets: videos.map(d => ({ document: d, revision: targets.find(t => t._id === d._id)?._rev ?? null })) };
  const directory = join(tmpdir(), "gtp-library-backups");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const backup = join(directory, `video-migration-${dataset}-${Date.now()}.json`);
  await writeFile(backup, JSON.stringify({ projectId: "y0tkemxm", dataset, documents: [...sourceDocuments, ...targets] }, null, 2), { mode: 0o600, flag: "wx" });
  const planPath = process.env.MIGRATION_PLAN_PATH;
  if (!apply) {
    const output = planPath || join(directory, `video-plan-${dataset}-${Date.now()}.json`);
    await writeFile(output, JSON.stringify(plan, null, 2), { mode: 0o600, flag: "wx" });
    console.log(JSON.stringify({ mode: "dry-run", dataset, videos: videos.map(v => ({id: v._id, title: v.title})), planPath: output, backup }, null, 2));
    return;
  }
  if (!planPath) throw new Error("Set MIGRATION_PLAN_PATH to a reviewed dry-run plan before applying.");
  const reviewed: unknown = JSON.parse(await readFile(planPath, "utf8"));
  if (canonicalContent(reviewed) !== canonicalContent(plan)) throw new Error("The source or targets changed since the reviewed dry run. Generate and review a new plan.");
  const transaction = client.transaction();
  for (const document of videos) {
    const existing = targets.find(d => d._id === document._id);
    if (existing?._rev) transaction.patch(existing._id, p => p.ifRevisionId(existing._rev!).setIfMissing({ legacyKey: document.legacyKey }));
    else transaction.create(document);
  }
  transaction.patch(sourceId, p => p.ifRevisionId(source._rev!).set({ useVideoLibrary: true }));
  await transaction.commit({ visibility: "sync" });
  const after = await client.fetch<MigrationDocument[]>("*[_id in $ids]", { ids: [sourceId, ...videos.map(v => v._id)] }, { perspective: "raw" });
  if (after.find(d => d._id === sourceId)?.useVideoLibrary !== true ||
    videos.some(v => !after.some(d => d._id === v._id))) throw new Error("Migration committed, but verification is incomplete. Inspect the backup and target documents before proceeding.");
  assertMigrationParity(videos, after.filter(d => d._type === "gtp2026Video"));
  console.log(`Migrated ${videos.length} videos and enabled the library atomically. Original video array retained. Backup: ${backup}`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
