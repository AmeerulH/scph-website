#!/usr/bin/env node
/**
 * Runs Unlighthouse with a required site origin (lab Lighthouse audits).
 * Usage: UNLIGHTHOUSE_SITE=https://example.com node scripts/unlighthouse-scan.mjs [--desktop ...]
 */
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const cli = resolve(root, "node_modules/unlighthouse/bin/unlighthouse.mjs");

const site =
  process.env.UNLIGHTHOUSE_SITE?.trim() ||
  process.env.SCAN_SITE_URL?.trim();

if (!site) {
  console.error(
    "Set UNLIGHTHOUSE_SITE or SCAN_SITE_URL to the origin to scan " +
      "(e.g. https://your-domain or http://localhost:3000).",
  );
  process.exit(1);
}

const passThrough = process.argv.slice(2);

const result = spawnSync(
  process.execPath,
  [cli, "--site", site, ...passThrough],
  { stdio: "inherit", cwd: root, env: process.env },
);

process.exit(result.status === null ? 1 : result.status);
