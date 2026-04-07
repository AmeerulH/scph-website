/**
 * Repo FAQ seed → Sanity `gtp2026FaqGroup` documents (one per tab) with embedded
 * `items[]` (`gtp2026FaqAccordionItem` objects).
 *
 * Source: scripts/data/gtp-faq-seed.json (`groups` with nested `items`).
 * Idempotent: fixed group `_id` from JSON; stable `_key` per accordion row from group + question slug.
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

type FaqSeedItem = {
  question?: unknown;
  answer?: unknown;
};

type FaqSeedGroup = {
  _id?: unknown;
  title?: unknown;
  order?: unknown;
  items?: unknown;
};

type FaqSeedFile = {
  groups?: unknown;
};

function slugFromQuestion(question: string): string {
  return question
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function groupKeyFromId(groupId: string): string {
  const stripped = groupId.replace(/^gtpFaqGroup-/, "");
  return stripped || "group";
}

function loadSeed(): {
  groupId: string;
  title: string;
  order: number;
  items: { question: string; answer: string }[];
}[] {
  if (!fs.existsSync(SEED_PATH)) {
    throw new Error(`Seed file not found: ${SEED_PATH}`);
  }
  const raw = JSON.parse(fs.readFileSync(SEED_PATH, "utf8")) as FaqSeedFile;
  const groups = raw.groups;
  if (!Array.isArray(groups)) {
    throw new Error("gtp-faq-seed.json must contain a `groups` array");
  }
  const out: {
    groupId: string;
    title: string;
    order: number;
    items: { question: string; answer: string }[];
  }[] = [];

  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi] as FaqSeedGroup;
    const groupId = typeof g._id === "string" ? g._id.trim() : "";
    const title = typeof g.title === "string" ? g.title.trim() : "";
    const order = typeof g.order === "number" && Number.isFinite(g.order) ? g.order : gi;
    if (!groupId || !title) {
      throw new Error(
        `Invalid FAQ group at index ${gi}: _id and title must be non-empty strings`,
      );
    }
    const itemsRaw = g.items;
    if (!Array.isArray(itemsRaw)) {
      throw new Error(`FAQ group "${groupId}" must have an items array`);
    }
    const items: { question: string; answer: string }[] = [];
    for (let ii = 0; ii < itemsRaw.length; ii++) {
      const row = itemsRaw[ii] as FaqSeedItem;
      const question =
        typeof row.question === "string" ? row.question.trim() : "";
      const answer = typeof row.answer === "string" ? row.answer.trim() : "";
      if (!question || !answer) {
        throw new Error(
          `Invalid FAQ item in group "${groupId}" at index ${ii}: question and answer must be non-empty strings`,
        );
      }
      items.push({ question, answer });
    }
    out.push({ groupId, title, order, items });
  }
  return out;
}

function buildEmbeddedItems(
  groupId: string,
  rows: { question: string; answer: string }[],
): Record<string, unknown>[] {
  const gKey = groupKeyFromId(groupId);
  const slugCounts = new Map<string, number>();
  return rows.map((row, order) => {
    const base = slugFromQuestion(row.question);
    const slug = (base || `item-${order}`).slice(0, 48);
    const n = (slugCounts.get(slug) ?? 0) + 1;
    slugCounts.set(slug, n);
    const keyBody = n === 1 ? slug : `${slug}-${n}`;
    const _key = `${gKey}-${keyBody}`
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 120);

    return {
      _key,
      _type: "gtp2026FaqAccordionItem",
      order,
      question: row.question,
      answer: row.answer,
    };
  });
}

async function main() {
  const dryRun = Boolean(process.env.DRY_RUN);
  const dataset = process.env.SANITY_DATASET ?? "production";

  const seedGroups = loadSeed();

  const groupDocs = seedGroups.map((g) => ({
    _id: g.groupId,
    _type: "gtp2026FaqGroup" as const,
    order: g.order,
    title: g.title,
    items: buildEmbeddedItems(g.groupId, g.items),
  }));

  if (dryRun) {
    console.log(JSON.stringify(groupDocs, null, 2));
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
  for (const doc of groupDocs) {
    tx = tx.createOrReplace(doc as {_id: string; _type: string} & Record<string, unknown>);
  }
  await tx.commit();

  const itemCount = groupDocs.reduce((n, d) => n + (d.items as unknown[]).length, 0);
  console.log(
    `Upserted ${groupDocs.length} gtp2026FaqGroup tab document(s) with ${itemCount} embedded FAQ item(s) on dataset "${dataset}". Open Studio and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
