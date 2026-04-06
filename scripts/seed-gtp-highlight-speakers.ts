/**
 * Repo defaults → Sanity `gtp2026HighlightSpeaker` documents (one per speaker)
 *
 * Source: src/data/gtp-highlight-speakers.ts (same data as the site fallback grid).
 * Idempotent: fixed _id `gtpHighlightSpeaker-<slug-from-name>` with createOrReplace.
 * Uploads local photos under public/ when `photoSrc` is set (same pattern as import-team).
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-gtp-highlight-speakers.ts
 *   DRY_RUN=1 npx tsx scripts/seed-gtp-highlight-speakers.ts
 */

import { createClient, type SanityClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

import { gtpHighlightSpeakers } from "../src/data/gtp-highlight-speakers";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const PUBLIC_DIR = path.join(process.cwd(), "public");

const ID_PREFIX = "gtpHighlightSpeaker-";

function slugFromName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadImage(
  client: SanityClient,
  imagePath: string,
  label: string,
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  const localPath = path.join(PUBLIC_DIR, imagePath.replace(/^\//, ""));

  if (!fs.existsSync(localPath)) {
    console.warn(`   ⚠️  Image not found, skipping: ${localPath}`);
    return null;
  }

  const ext = path.extname(localPath).replace(".", "") || "jpg";
  const fileStream = fs.createReadStream(localPath);

  try {
    const asset = await client.assets.upload("image", fileStream, {
      filename: path.basename(localPath),
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });
    console.log(`   ✅ Image uploaded for ${label}: ${asset._id}`);
    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`   ⚠️  Image upload failed for ${label}: ${msg}`);
    return null;
  }
}

async function buildDocuments(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>[]> {
  const out: Record<string, unknown>[] = [];

  for (let i = 0; i < gtpHighlightSpeakers.length; i++) {
    const s = gtpHighlightSpeakers[i]!;
    const slug = slugFromName(s.name);
    const _id = `${ID_PREFIX}${slug}`;

    let imageField:
      | { _type: "image"; asset: { _type: "reference"; _ref: string } }
      | { _dryRunNote: string; path: string }
      | undefined;

    if (s.photoSrc?.trim()) {
      if (dryRun) {
        imageField = { _dryRunNote: "would upload from public", path: s.photoSrc };
      } else if (client) {
        imageField = (await uploadImage(client, s.photoSrc, s.name)) ?? undefined;
      }
    }

    const sessions = (s.sessions ?? [])
      .filter((slot) => slot.title?.trim() && slot.date?.trim())
      .map((slot) => ({
        _type: "gtp2026HighlightSessionSlot" as const,
        title: slot.title.trim(),
        date: slot.date.trim(),
      }));

    const doc: Record<string, unknown> = {
      _id,
      _type: "gtp2026HighlightSpeaker",
      order: i,
      name: s.name,
      role: s.role,
      organisation: s.organisation,
      bio: s.bio,
      session: s.session,
      sessionDate: s.sessionDate,
      photoUnoptimized: s.photoUnoptimized === true,
    };

    if (s.photoClassName?.trim()) {
      doc.photoClassName = s.photoClassName.trim();
    }
    if (sessions.length > 0) {
      doc.sessions = sessions;
    }
    if (imageField) {
      doc.image = imageField;
    }

    out.push(doc);
  }

  return out;
}

async function main() {
  const dryRun = Boolean(process.env.DRY_RUN);
  const dataset = process.env.SANITY_DATASET ?? "production";

  if (!dryRun && !process.env.SANITY_API_TOKEN) {
    console.error(
      "SANITY_API_TOKEN is not set. Add it to .env.local (see import-gtp-programme-to-sanity.ts).",
    );
    process.exit(1);
  }

  const client =
    !dryRun && process.env.SANITY_API_TOKEN
      ? createClient({
          projectId: "y0tkemxm",
          dataset,
          apiVersion: "2024-01-01",
          token: process.env.SANITY_API_TOKEN,
          useCdn: false,
        })
      : null;

  const docs = await buildDocuments(client, dryRun);

  if (dryRun) {
    console.log(JSON.stringify(docs, null, 2));
    return;
  }

  let tx = client!.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(
      doc as {_id: string; _type: string} & Record<string, unknown>,
    );
  }
  await tx.commit({ autoGenerateArrayKeys: true });

  console.log(
    `Upserted ${docs.length} gtp2026HighlightSpeaker documents on dataset "${dataset}". Open Studio and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
