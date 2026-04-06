/**
 * Repo defaults → Sanity `gtp2026CommitteeMember` documents
 *
 * Source: src/data/gtp-committee-static.ts (same as organising-committee page fallbacks).
 * Idempotent: _id `gtpCommittee-<group>-<slug(name-role)>` with createOrReplace.
 * Uploads photos from public/ when `photoSrc` is set.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-gtp-committee-members.ts
 *   DRY_RUN=1 npx tsx scripts/seed-gtp-committee-members.ts
 */

import { createClient, type SanityClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

import {
  gtpStaticCoChairs,
  gtpStaticPlanningCommittee,
  gtpStaticProgrammeCommittee,
} from "../src/data/gtp-committee-static";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const PUBLIC_DIR = path.join(process.cwd(), "public");

function slugFromName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function docId(
  group: "cochair" | "planning" | "programme",
  name: string,
  role: string,
): string {
  return `gtpCommittee-${group}-${slugFromName(`${name} ${role}`)}`;
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
  let order = 0;

  for (const c of gtpStaticCoChairs) {
    const _id = docId("cochair", c.name, c.role);
    let imageField:
      | { _type: "image"; asset: { _type: "reference"; _ref: string } }
      | { _dryRunNote: string; path: string }
      | undefined;

    if (c.photoSrc?.trim()) {
      if (dryRun) {
        imageField = { _dryRunNote: "would upload from public", path: c.photoSrc };
      } else if (client) {
        imageField = (await uploadImage(client, c.photoSrc, c.name)) ?? undefined;
      }
    }

    const doc: Record<string, unknown> = {
      _id,
      _type: "gtp2026CommitteeMember",
      order: order++,
      committeeGroup: "cochair",
      name: c.name,
      role: c.role,
      designation: c.designation,
      isPlaceholder: false,
    };
    if (c.imageObjectClass?.trim()) {
      doc.imageObjectClass = c.imageObjectClass.trim();
    }
    if (c.imageScaleClass?.trim()) {
      doc.imageScaleClass = c.imageScaleClass.trim();
    }
    if (imageField) doc.image = imageField;

    out.push(doc);
  }

  async function addGrid(
    group: "planning" | "programme",
    members: typeof gtpStaticPlanningCommittee,
  ) {
    for (const m of members) {
      const _id = docId(group, m.name, m.role);
      let imageField:
        | { _type: "image"; asset: { _type: "reference"; _ref: string } }
        | { _dryRunNote: string; path: string }
        | undefined;

      if (m.photoSrc?.trim()) {
        if (dryRun) {
          imageField = {
            _dryRunNote: "would upload from public",
            path: m.photoSrc,
          };
        } else if (client) {
          imageField =
            (await uploadImage(client, m.photoSrc, m.name)) ?? undefined;
        }
      }

      const doc: Record<string, unknown> = {
        _id,
        _type: "gtp2026CommitteeMember",
        order: order++,
        committeeGroup: group,
        name: m.name,
        role: m.role,
        organisation: m.organisation ?? "",
        isPlaceholder: m.isPlaceholder === true,
      };
      if (m.imageObjectClass?.trim()) {
        doc.imageObjectClass = m.imageObjectClass.trim();
      }
      if (imageField) doc.image = imageField;

      out.push(doc);
    }
  }

  await addGrid("planning", gtpStaticPlanningCommittee);
  await addGrid("programme", gtpStaticProgrammeCommittee);

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
  await tx.commit();

  console.log(
    `Upserted ${docs.length} gtp2026CommitteeMember documents on dataset "${dataset}". Open Studio and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
