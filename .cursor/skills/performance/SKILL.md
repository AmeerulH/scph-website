---
name: scph-performance
description: Unlighthouse full-site scans and Lighthouse Performance ≥80 per URL for scph-website. Use when optimizing LCP/JS, images, fonts, or validating lab scores after UI changes.
---

# Performance (project skill)

Read the full guide: [docs/performance.md](../../../docs/performance.md).

## Contract

- **Unlighthouse (mobile default):** every scanned URL must have **Lighthouse Performance ≥ 80**.
- Set **`UNLIGHTHOUSE_SITE`** or **`SCAN_SITE_URL`**, then `npm run unlighthouse:scan` (or `unlighthouse:scan:desktop`). Reports under `unlighthouse/` (gitignored).

## Quick practices

- Server-first rendering; limit `"use client"` and heavy JS.
- **`next/image`** with sensible sizes; avoid huge hero assets.
- Follow [AGENTS.md](../../../AGENTS.md) §7 for fonts, third-party scripts, and dynamic rendering/revalidation.
