# Claude.md — SCPH / GTP website

Use this file as the **entry point** for AI-assisted work in this repository. It ties together the project’s markdown documentation and the non‑negotiable conventions. **Authoritative detail lives in the linked files**—keep them in sync when processes change.

---

## Documentation map

### Root markdown

| File | Role |
|------|------|
| [`AGENTS.md`](AGENTS.md) | **Master reference**: stack, Sanity ownership, CMS checklist, seed inventory, Next.js standards, code quality, performance/CWV, Unlighthouse bar, quick file map. Read before non-trivial features, new sections, or CMS work. |
| [`README.md`](README.md) | **Setup & ops**: install, dev/build, Studio, env vars, webhooks, editor notes, Unlighthouse commands, seed/import pointers. |
| [`CONTENT_REFERENCE.md`](CONTENT_REFERENCE.md) | **SCPH marketing copy reference** (scraped legacy site). Use for tone/structure alignment when authoring or migrating SCPH-facing content—not a spec for code. |
| [`Claude.md`](Claude.md) | This file—navigation for humans and AI. |

### Engineering guides (`docs/`)

| File | Role |
|------|------|
| [`docs/README.md`](docs/README.md) | Index and **recommended read order** for the guides below. |
| [`docs/architecture.md`](docs/architecture.md) | Routes, layouts, Sanity data flow, component layout. |
| [`docs/coding-guidelines.md`](docs/coding-guidelines.md) | Server Components, colocation, TypeScript at CMS boundaries. |
| [`docs/code-quality.md`](docs/code-quality.md) | Lint/build, minimal diffs; points to performance for scans. |
| [`docs/design-system.md`](docs/design-system.md) | Fonts, brand tokens, `ui/` primitives, `next/image`. |
| [`docs/performance.md`](docs/performance.md) | Unlighthouse workflow, **Lighthouse Performance ≥ 80** per scanned URL, triage. |
| [`docs/adr/README.md`](docs/adr/README.md) | Optional ADR convention when recording major technical decisions. |

### Cursor project skills (`.cursor/skills/`)

Short `@`-invokable skills; each links to the matching `docs/` file:

- `architecture` → [`docs/architecture.md`](docs/architecture.md)
- `coding-guidelines` → [`docs/coding-guidelines.md`](docs/coding-guidelines.md)
- `code-quality` → [`docs/code-quality.md`](docs/code-quality.md)
- `design-system` → [`docs/design-system.md`](docs/design-system.md)
- `performance` → [`docs/performance.md`](docs/performance.md)

Ignore duplicate copies under `.claude/worktrees/`; treat **repo-root** files as source of truth.

Cursor also loads [`.cursor/rules/project-master.mdc`](.cursor/rules/project-master.mdc) (always apply). If anything here conflicts with **`AGENTS.md`**, prefer updating **`AGENTS.md`** and aligning this file and `docs/`.

---

## When to read what

| Situation | Start here |
|-----------|------------|
| CMS fields, seeds, merge/revalidation | [`AGENTS.md`](AGENTS.md) §2–4 |
| New route or data flow | [`docs/architecture.md`](docs/architecture.md) → [`AGENTS.md`](AGENTS.md) as needed |
| Implementing components / TS conventions | [`docs/coding-guidelines.md`](docs/coding-guidelines.md) |
| PR hygiene, lint/build | [`docs/code-quality.md`](docs/code-quality.md) |
| Typography, colours, UI primitives, images | [`docs/design-system.md`](docs/design-system.md) |
| Perf regressions, heroes, client JS, full-site lab scores | [`docs/performance.md`](docs/performance.md) |
| Env, Studio, running Unlighthouse | [`README.md`](README.md) |

---

## Performance bar (Unlighthouse)

For **every URL** included in the default full-site Unlighthouse run (sitemap-driven), the **Lighthouse Performance category must be ≥ 80** (mobile scan: `npm run unlighthouse:scan`). Details, env vars, and triage: [`docs/performance.md`](docs/performance.md) and [`README.md`](README.md).

Stretch: push **higher** scores on critical paths when feasible; lab scores complement **Vercel Speed Insights** (real users).

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
   - Meet the **Unlighthouse Performance ≥ 80** contract above; practices in **§7** of [`AGENTS.md`](AGENTS.md) and [`docs/performance.md`](docs/performance.md).

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
