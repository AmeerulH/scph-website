# Claude.md — SCPH / GTP website

Use this file as the **entry point** for AI-assisted work in this repository. It ties together the project’s markdown documentation and the non‑negotiable conventions. **Authoritative detail lives in the linked files**—keep them in sync when processes change.

---

## Canonical markdown in this repo

| File | Role |
|------|------|
| [`AGENTS.md`](AGENTS.md) | **Master reference**: stack, Sanity ownership, CMS checklist, seed inventory, Next.js standards, code quality, performance/CWV, quick file map. Read before non-trivial features, new sections, or CMS work. |
| [`README.md`](README.md) | **Setup & ops**: install, dev/build, Studio, env vars, webhooks, editor notes, seed/import pointers. |
| [`CONTENT_REFERENCE.md`](CONTENT_REFERENCE.md) | **SCPH marketing copy reference** (scraped legacy site). Use for tone/structure alignment when authoring or migrating SCPH-facing content—not a spec for code. |

Ignore duplicate copies under `.claude/worktrees/`; treat **repo-root** files as source of truth.

Cursor also loads [`.cursor/rules/project-master.mdc`](.cursor/rules/project-master.mdc) (always apply). If anything here conflicts with **`AGENTS.md`**, prefer updating **`AGENTS.md`** and aligning this file.

---

## Before you generate or change code

1. **Read [`AGENTS.md`](AGENTS.md)** for the full checklist when the task is non-trivial (new pages/sections, Sanity schema/fields, large UI, or new data paths).

2. **Sanity CMS**
   - **Editors own published content.** The site reads the **published** API; drafts do not appear live.
   - Many routes **merge** Sanity with code defaults (`mergeGtp*`, `mergeScph*`, `src/data/*`, `gtp-marketing-defaults.ts`, etc.). Changing code defaults does **not** overwrite populated Studio fields after publish.
   - New CMS-backed surfaces: **schema** (`studio/schemaTypes/`) → **deploy schema** → **GROQ + fetch** in `src/sanity/` → **render** (often [`src/components/sections/render-section-block.tsx`](src/components/sections/render-section-block.tsx)) → **seed script** + `package.json` script → document in **README**. If webhooks revalidate by `_type`, extend **`SANITY_TYPE_TO_PATHS`** in [`src/app/api/revalidate/sanity/route.ts`](src/app/api/revalidate/sanity/route.ts). Indexable URLs: [`src/app/sitemap.ts`](src/app/sitemap.ts). GTP editor handbook: [`src/components/scph/team-handbook/team-handbook-gtp.tsx`](src/components/scph/team-handbook/team-handbook-gtp.tsx).

3. **Next.js & React**
   - **App Router** under `src/app/`. **Server Components by default**; `"use client"` only when required.
   - **SCPH** routes: [`src/app/(scph)/`](src/app/(scph)/). **GTP 2026**: [`src/app/events/gtp-2026/`](src/app/events/gtp-2026/).
   - Images: **`next/image`**; Sanity CDN allowed in [`next.config.ts`](next.config.ts).

4. **Quality bar**
   - Minimal, purposeful diffs; match existing naming, imports, and patterns.
   - Reuse merge helpers, section renderers, and [`src/components/ui/`](src/components/ui/) before new abstractions.
   - TypeScript: honest types at Sanity/GROQ boundaries.

5. **Performance**
   - Target strong **Lighthouse / CWV** where realistic (see **§7** in [`AGENTS.md`](AGENTS.md)): limit client JS, avoid huge unoptimised hero images, pair static/ISR with **revalidation** if you introduce caching.

---

## Quick “where is it?” (see §8 in AGENTS.md)

- Revalidation map: `src/app/api/revalidate/sanity/route.ts`
- Public indexable paths: `src/lib/public-indexable-paths.ts`
- Sanity client: `src/sanity/client.ts`
- Footers: `src/sanity/footer.ts` + `src/data/*-footer-defaults.ts`

---

## When in doubt

1. Search for **`getGtp*`**, **`getScph*`**, **`merge*`**, **`_type`** to see if behaviour is CMS-driven.
2. Prefer **one data path**: query → merge → props, not ad hoc fetches in leaf components.
3. For env and scripts, confirm in **`README.md`** and the seed table in **`AGENTS.md`**.
