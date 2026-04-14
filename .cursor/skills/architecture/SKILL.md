---
name: scph-architecture
description: SCPH/GTP Next.js app structure, routes, Sanity data flow, and key folders. Use when adding routes, layouts, data fetching, or explaining how the monorepo site is organized.
---

# Architecture (project skill)

Read the full guide: [docs/architecture.md](../../../docs/architecture.md).

## Quick reference

- **SCPH marketing:** `src/app/(scph)/` → URLs like `/`, `/about-us`, `/programmes` (group does not appear in the path).
- **GTP 2026:** `src/app/events/gtp-2026/` → `/events/gtp-2026/*`.
- **Sanity:** Studio in `studio/`; runtime client `src/sanity/client.ts`; merge helpers and GROQ in `src/sanity/*`.
- **Section blocks:** `src/components/sections/render-section-block.tsx`.
- **Sitemap / indexable paths:** `src/lib/public-indexable-paths.ts`, `src/app/sitemap.ts`.
- **CMS checklist and seeds:** [AGENTS.md](../../../AGENTS.md) §3–4.

When behaviour is CMS-driven, defer to [AGENTS.md](../../../AGENTS.md) for ownership, seeds, and revalidation (`SANITY_TYPE_TO_PATHS`).
