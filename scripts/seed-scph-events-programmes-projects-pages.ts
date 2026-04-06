/**
 * Repo defaults → Sanity `scphEventsPage`, `scphProgrammesPage`, `scphProjectsPage` singletons.
 *
 * Matches [`src/app/(scph)/events/page.tsx`](src/app/(scph)/events/page.tsx),
 * [`programmes/page.tsx`](src/app/(scph)/programmes/page.tsx), and
 * [`projects/page.tsx`](src/app/(scph)/projects/page.tsx) fallbacks.
 *
 * Idempotent: fixed `_id` equal to `_type` for each; one transaction with `createOrReplace`.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-scph-events-programmes-projects-pages.ts
 *   DRY_RUN=1 npx tsx scripts/seed-scph-events-programmes-projects-pages.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import {
  SCPH_PROGRAMMES_PLACEHOLDER_DESCRIPTION,
  SCPH_PROJECTS_PLACEHOLDER_DESCRIPTION,
} from "../src/data/scph-placeholder-pages-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const EVENTS_ID = "scphEventsPage";
const PROGRAMMES_ID = "scphProgrammesPage";
const PROJECTS_ID = "scphProjectsPage";

const eventsDoc = {
  _id: EVENTS_ID,
  _type: "scphEventsPage" as const,
  internalTitle: "Events",
  pageTitle: "Events",
  pageSubtitle: "What's On",
  sections: [] as const,
};

const programmesDoc = {
  _id: PROGRAMMES_ID,
  _type: "scphProgrammesPage" as const,
  internalTitle: "Programmes",
  pageTitle: "Programmes",
  placeholderDescription: SCPH_PROGRAMMES_PLACEHOLDER_DESCRIPTION,
  sections: [] as const,
};

const projectsDoc = {
  _id: PROJECTS_ID,
  _type: "scphProjectsPage" as const,
  internalTitle: "Projects",
  pageTitle: "Projects",
  placeholderDescription: SCPH_PROJECTS_PLACEHOLDER_DESCRIPTION,
  sections: [] as const,
};

async function main() {
  const docs = [eventsDoc, programmesDoc, projectsDoc];

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify(docs, null, 2));
    return;
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error(
      "SANITY_API_TOKEN is not set. Add it to .env.local (see import-gtp-programme-to-sanity.ts).",
    );
    process.exit(1);
  }

  const dataset = process.env.SANITY_DATASET ?? "production";

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });

  await client
    .transaction()
    .createOrReplace(eventsDoc)
    .createOrReplace(programmesDoc)
    .createOrReplace(projectsDoc)
    .commit();

  console.log(
    `Upserted ${EVENTS_ID}, ${PROGRAMMES_ID}, ${PROJECTS_ID} on dataset "${dataset}". Open Studio and Publish each if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
