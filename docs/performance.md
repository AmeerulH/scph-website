# Web performance and Unlighthouse

This document defines the **lab audit bar** for full-site scans and how to run them. Practices (RSC-first, images, fonts, scripts) are summarized in [AGENTS.md](../AGENTS.md) §7; this file adds the **Unlighthouse contract** and operational steps.

## Contract: Lighthouse Performance score

For **every URL** included in the default full-site Unlighthouse run (driven from the app sitemap), the **Lighthouse Performance category must be ≥ 80**.

- Default team command is **mobile** (`npm run unlighthouse:scan`). Use **`npm run unlighthouse:scan:desktop`** when you explicitly need desktop lab scores (closer to some desktop Speed Insights views).
- Scores are **synthetic lab** measurements; they complement but do not replace **Vercel Speed Insights** (real users).

## Lab vs field

- **Unlighthouse / Lighthouse:** Controlled environment, good for regressions and before/after comparisons on a fixed origin.
- **Speed Insights / RUM:** Reflects real devices and networks; use for production health over time.

See also the short discussion in [README.md](../README.md) (Unlighthouse section).

## How to run Unlighthouse

1. Serve the site from a stable origin — e.g. **`npm run build && npm run start`** locally, or a preview/production URL.
2. Set **`UNLIGHTHOUSE_SITE`** or **`SCAN_SITE_URL`** to the **origin only** (no path), e.g. `http://localhost:3000` or `https://your-domain`.
3. Run:
   - **`npm run unlighthouse:scan`** — mobile (default workflow for the ≥ 80 bar).
   - **`npm run unlighthouse:scan:desktop`** — desktop form factor.
4. Open the generated report under **`unlighthouse/`** at the repo root (gitignored).

**Configuration:**

- `unlighthouse.config.ts` — scanner uses **sitemap** (`sitemap: true`), **no in-page crawler** (`crawler: false`), excludes `/api/*`, writes to `unlighthouse/`.
- `scripts/unlighthouse-scan.mjs` — requires `UNLIGHTHOUSE_SITE` or `SCAN_SITE_URL`, then invokes the Unlighthouse CLI.

**Which URLs are scanned:** discovered via **`/sitemap.xml`**, aligned with indexable marketing paths in `src/lib/public-indexable-paths.ts` and `src/app/sitemap.ts`.

## When to re-run a scan

- After **hero or above-the-fold image** changes, new **third-party scripts**, meaningful **`"use client"`** boundary changes, or large **dependency** additions.
- Before merging work that touches **layout**, **fonts**, or **global CSS**.

## If a page scores below 80

1. Open the Unlighthouse/Lighthouse report for that URL and read **Opportunities** and **Diagnostics**.
2. Check **LCP** candidates: largest image or text block; ensure `next/image` priority/sizes are appropriate and assets are not oversized.
3. Check **JS execution time**: new client bundles, heavy libraries, or synchronous third-party widgets.
4. Revisit **`"use client"`** boundaries — push logic to the server where possible.
5. Compare with **AGENTS.md** §7 checklist (fonts, dynamic rendering, carousels, third-party scripts).

## See also

- [AGENTS.md](../AGENTS.md) §7 and §8 — Practices and quick paths (`unlighthouse.config.ts`, README).
- [code-quality.md](./code-quality.md) — `npm run build` and lint before merge.
