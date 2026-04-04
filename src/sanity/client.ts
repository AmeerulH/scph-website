import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "y0tkemxm",
  /** Override with SANITY_DATASET in .env.local (e.g. `development`) for local CMS testing. */
  dataset: process.env.SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
