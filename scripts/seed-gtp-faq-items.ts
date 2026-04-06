/**
 * Repo FAQ seed → Sanity `gtp2026FaqItem` documents (one per row)
 *
 * Source: scripts/data/gtp-faq-seed.json (edit questions/answers there; re-run to upsert).
 * Idempotent: fixed _id `gtpFaqItem-<slug-from-question>` (+ numeric suffix if slug collides).
 * `order` is the array index in the JSON file.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-gtp-faq-items.ts
 *   DRY_RUN=1 npx tsx scripts/seed-gtp-faq-items.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const SEED_PATH = path.join(process.cwd(), "scripts", "data", "gtp-faq-seed.json");

const ID_PREFIX = "gtpFaqItem-";

type FaqSeedRow = {
  question?: unknown;
  answer?: unknown;
};

function slugFromQuestion(question: string): string {
  return question
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function loadSeed(): { question: string; answer: string }[] {
  if (!fs.existsSync(SEED_PATH)) {
    throw new Error(`Seed file not found: ${SEED_PATH}`);
  }
  const raw = JSON.parse(fs.readFileSync(SEED_PATH, "utf8")) as unknown;
  if (!Array.isArray(raw)) {
    throw new Error("gtp-faq-seed.json must be a JSON array");
  }
  const out: { question: string; answer: string }[] = [];
  for (let i = 0; i < raw.length; i++) {
    const row = raw[i] as FaqSeedRow;
    const question =
      typeof row.question === "string" ? row.question.trim() : "";
    const answer = typeof row.answer === "string" ? row.answer.trim() : "";
    if (!question || !answer) {
      throw new Error(
        `Invalid FAQ row at index ${i}: question and answer must be non-empty strings`,
      );
    }
    out.push({ question, answer });
  }
  return out;
}

function assignIds(
  rows: { question: string; answer: string }[],
): { _id: string; question: string; answer: string; order: number }[] {
  const slugCounts = new Map<string, number>();
  return rows.map((row, order) => {
    const base = slugFromQuestion(row.question);
    const slug = base || `item-${order}`;
    const n = (slugCounts.get(slug) ?? 0) + 1;
    slugCounts.set(slug, n);
    const _id =
      n === 1 ? `${ID_PREFIX}${slug}` : `${ID_PREFIX}${slug}-${n}`;
    return { _id, ...row, order };
  });
}

async function main() {
  const dryRun = Boolean(process.env.DRY_RUN);
  const dataset = process.env.SANITY_DATASET ?? "production";

  const rows = loadSeed();
  const withIds = assignIds(rows);

  const docs: Record<string, unknown>[] = withIds.map(
    ({ _id, question, answer, order }) => ({
      _id,
      _type: "gtp2026FaqItem",
      order,
      question,
      answer,
    }),
  );

  if (dryRun) {
    console.log(JSON.stringify(docs, null, 2));
    return;
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.error(
      "SANITY_API_TOKEN is not set. Add it to .env.local (see import-gtp-programme-to-sanity.ts).",
    );
    process.exit(1);
  }

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  let tx = client.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(
      doc as { _id: string; _type: string } & Record<string, unknown>,
    );
  }
  await tx.commit();

  console.log(
    `Upserted ${docs.length} gtp2026FaqItem documents on dataset "${dataset}". Open Studio and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
