/**
 * Migration: gtp2026HighlightSpeaker → gtp2026Speaker
 *
 * Reads all published gtp2026HighlightSpeaker documents from Sanity and
 * creates matching gtp2026Speaker documents. Image asset references are copied
 * directly — no re-upload needed.
 *
 * Idempotent: fixed _id `gtpSpeaker-<name-slug>` with createOrReplace.
 * Does NOT delete the original gtp2026HighlightSpeaker documents.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npm run migrate-highlight-speakers-to-speakers
 *   DRY_RUN=1 npm run migrate-highlight-speakers-to-speakers
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const ID_PREFIX = "gtpSpeaker-";

type RawHighlightSpeaker = {
  _id: string;
  order?: number | null;
  name: string;
  role?: string | null;
  organisation?: string | null;
  bio?: string | null;
  session?: string | null;
  sessionDate?: string | null;
  photoClassName?: string | null;
  photoUnoptimized?: boolean | null;
  image?: {
    _type: string;
    asset?: { _type: string; _ref: string; [k: string]: unknown };
    [k: string]: unknown;
  } | null;
  sessions?: {
    _key?: string;
    _type?: string;
    title?: string | null;
    date?: string | null;
  }[] | null;
};

function slugFromName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const dryRun = Boolean(process.env.DRY_RUN);
  const dataset = process.env.SANITY_DATASET ?? "production";

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error("SANITY_API_TOKEN is not set. Add it to .env.local (Editor+ role required).");
    process.exit(1);
  }

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });

  // Fetch all published highlight speaker docs with raw image references
  const source: RawHighlightSpeaker[] = await client.fetch(
    `*[_type == "gtp2026HighlightSpeaker"] | order(order asc, name asc) {
      _id, order, name, role, organisation, bio,
      session, sessionDate, photoClassName, photoUnoptimized,
      image,
      sessions[] { _key, _type, title, date }
    }`,
  );

  if (source.length === 0) {
    console.log("No gtp2026HighlightSpeaker documents found. Nothing to migrate.");
    return;
  }

  console.log(`Found ${source.length} highlight speaker(s) to migrate.`);

  const docs = source.map((s, i) => {
    const slug = slugFromName(s.name);
    const doc: Record<string, unknown> = {
      _id: `${ID_PREFIX}${slug}`,
      _type: "gtp2026Speaker",
      order: s.order ?? i,
      name: s.name,
      role: s.role ?? "",
      organisation: s.organisation ?? "",
      bio: s.bio ?? "",
      session: s.session ?? "",
      sessionDate: s.sessionDate ?? "",
      photoUnoptimized: s.photoUnoptimized === true,
    };

    if (s.photoClassName?.trim()) {
      doc.photoClassName = s.photoClassName.trim();
    }

    // Copy image asset reference directly — the asset already exists in Sanity
    if (s.image?.asset?._ref) {
      doc.image = {
        _type: "image",
        asset: { _type: "reference", _ref: s.image.asset._ref },
      };
    }

    if (s.sessions && s.sessions.length > 0) {
      doc.sessions = s.sessions
        .filter((slot) => slot.title?.trim() && slot.date?.trim())
        .map((slot) => ({
          _type: "gtp2026HighlightSessionSlot",
          title: slot.title!.trim(),
          date: slot.date!.trim(),
        }));
    }

    return doc;
  });

  if (dryRun) {
    console.log(JSON.stringify(docs, null, 2));
    return;
  }

  let tx = client.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(doc as { _id: string; _type: string } & Record<string, unknown>);
  }
  await tx.commit({ autoGenerateArrayKeys: true });

  console.log(
    `Migrated ${docs.length} speaker(s) to gtp2026Speaker on dataset "${dataset}".`,
  );
  console.log("Open Studio → GTP 2026 Speakers page → Speakers and Publish each one.");
  console.log("Original gtp2026HighlightSpeaker documents are unchanged.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
