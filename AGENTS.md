# AGENTS.md — SCPH & GTP 2026 website

This document is the **master reference** for anyone (including Cursor) working on this repo. Read it before starting non-trivial features, new sections, or CMS-related edits.

---

## 1. Project overview

- **Stack:** Next.js (App Router), React, TypeScript, Tailwind, Sanity CMS.
- **Sites in one app:** Sunway Centre for Planetary Health (SCPH) under `src/app/(scph)/`, and **Global Tipping Points 2026** under `src/app/events/gtp-2026/`.
- **Content:** Most marketing copy and structured sections are authored in **Sanity Studio** (`studio/`). The team maintains what appears on the public site by **publishing** documents there.

---

## 2. Sanity CMS: who owns the frontend content?

- **Editors own published content.** If a field exists in Sanity and is populated, it usually **overrides or merges with** code defaults.
- **Published vs draft:** The website reads the **published** API. Unpublished drafts do not appear on the live site.
- **Merge / fallback pattern:** Many routes use helpers such as `mergeGtpAboutPage`, `mergeGtpGetInvolvedCopy`, `mergeGtpSubmissionsCopy`, etc., plus defaults in `src/data/*` or `src/sanity/gtp-marketing-defaults.ts`. That means:
  - **Changing defaults in code** updates behaviour only when Studio fields are empty or when merge logic uses the default for that field.
  - **Changing copy in Studio** wins for that field after publish—**code defaults do not overwrite existing CMS values** on the next deploy.

### 2.1 Before editing “existing sections” in code

Ask:

| Question | Why it matters |
|----------|----------------|
| Does this text/structure come from **Sanity**? | If yes, editors may already have different content; your code change might only affect **fallbacks** or **new fields**. |
| Are you changing **schema field names** or **types**? | Breaking for existing documents; needs Studio migration or coordinated re-seed. |
| Are you changing **GROQ queries** or **merge** logic? | Can change what renders without editors touching Studio; document for the team. |
| Should editors control this? | Prefer new Sanity fields + Studio UI over hardcoding long copy in components. |

**Rule of thumb:** Treat CMS-backed strings and blocks as **authoritative once published**. Code changes should either respect that or be agreed as a deliberate “move this back to code-only” decision.

---

## 3. New sections / new CMS-backed pages — checklist

When adding a **new user-facing section** or **page** that should be editable in Sanity:

1. **Schema** — Add or extend types in `studio/schemaTypes/` (and related `objects/` if needed).
2. **Deploy schema** — `cd studio && npx sanity schema deploy` (and align datasets: see README).
3. **Next.js data layer** — GROQ query + fetch (e.g. `src/sanity/queries.ts`, `gtp-stage1.ts`, `gtp-stage2.ts`) and merge/fallbacks if applicable.
4. **Rendering** — Wire the page or section in `src/app/...` and components; for generic blocks, patterns live around `src/components/sections/render-section-block.tsx`.
5. **Revalidation (if using webhooks)** — If `POST /api/revalidate/sanity` should invalidate caches for this content, add the document `_type` → paths in `src/app/api/revalidate/sanity/route.ts` (`SANITY_TYPE_TO_PATHS`).
6. **Seed script** — Add `scripts/seed-*.ts` (or extend an existing one) so **initial structure and default copy** can be pushed to the dataset **idempotently** (fixed `_id` where singletons apply). Wire **`npm run ...`** in root `package.json`.
7. **Documentation** — Update `README.md` (seed / import table or bullets) so the team knows how to populate the dataset.
8. **Sitemap** — If the URL should be indexed, add the path in `src/app/sitemap.ts`.
9. **GTP handbook** — If it is a GTP CMS surface, update `src/components/scph/team-handbook/team-handbook-gtp.tsx` so editors have an accurate route ↔ document map.

**Do not ship a new CMS-driven section without a path to get documents into Sanity** (seed and/or clear Studio instructions).

---

## 4. Seed & import scripts (inventory)

Use these to **upload or refresh** default content. Requires `SANITY_API_TOKEN` (and correct `SANITY_DATASET`) in `.env.local` unless noted.

| npm script | Script file | Typical Sanity types / notes |
|------------|-------------|------------------------------|
| `import-gtp-programme` | `scripts/import-gtp-programme-to-sanity.ts` | `gtp2026Programme` (programme data) |
| `seed-gtp-get-involved-page` | `scripts/seed-gtp-get-involved-page.ts` | `gtp2026GetInvolvedPage` singleton |
| `seed-gtp-submissions-page` | `scripts/seed-gtp-submissions-page.ts` | `gtp2026SubmissionsPage` (+ nested form copy) |
| `seed-gtp-highlight-speakers` | `scripts/seed-gtp-highlight-speakers.ts` | `gtp2026HighlightSpeaker` (multiple docs) |
| `seed-gtp-committee-members` | `scripts/seed-gtp-committee-members.ts` | `gtp2026CommitteeMember` |
| `seed-gtp-faq-items` | `scripts/seed-gtp-faq-items.ts` | `gtp2026FaqGroup` (tab docs with embedded `gtp2026FaqAccordionItem` rows in `scripts/data/gtp-faq-seed.json`) |
| `seed-gtp-media-bizforum-pages` | `scripts/seed-gtp-media-bizforum-pages.ts` | `gtp2026MediaPage`, `gtp2026BizForumPage`, `gtp2026AboutPage` |
| `seed-scph-meet-the-team-page` | `scripts/seed-scph-meet-the-team-page.ts` | `scphMeetTheTeamPage` |
| `seed-scph-home-page` | `scripts/seed-scph-home-page.ts` | `scphHomePage` |
| `seed-scph-events-programmes-projects-pages` | `scripts/seed-scph-events-programmes-projects-pages.ts` | `scphEventsPage`, `scphProgrammesPage`, `scphProjectsPage` |
| `seed-scph-section-pages` | `scripts/seed-scph-section-pages.ts` | Section shells (about / research / network style singletons) |
| `seed-scph-media-page` | `scripts/seed-scph-media-page.ts` | `scphMediaPage` |

Many seeds support `DRY_RUN=1` to print JSON only—use before writing to a shared dataset.

---

## 5. Next.js architecture (current standards)

- **App Router** — Routes live under `src/app/`. Use **Server Components** by default; add `"use client"` only when hooks, browser APIs, or client-only libraries require it.
- **Route groups** — `(scph)` groups SCPH marketing pages without affecting the URL segment.
- **Layouts** — Shared chrome per area: root `layout.tsx`, `src/app/(scph)/layout.tsx`, `src/app/events/gtp-2026/layout.tsx`.
- **Sanity client** — `src/sanity/client.ts`; images via `next/image` + `remotePatterns` in `next.config.ts` (e.g. `cdn.sanity.io`).
- **Redirects** — Configured in `next.config.ts` when routes move to external URLs.
- **Env** — See README for `SANITY_*` and revalidation secret.

Prefer **colocating** feature UI under `src/components/` with names that match domains (`gtp/`, `scph/`, `sections/`, `ui/`).

---

## 6. Code quality & change discipline

- **Minimal, purposeful diffs** — Only change what the task requires; avoid drive-by refactors and unrelated formatting.
- **Match the codebase** — Follow existing naming, file layout, import style, and component patterns.
- **Reuse** — Extend existing merge helpers, section renderers, and UI primitives (`src/components/ui/`) before adding parallel systems.
- **Types** — Keep TypeScript strict and honest at Sanity boundaries (null/undefined from GROQ).
- **Comments** — Short and only where behaviour is non-obvious; do not restate the code.

---

## 7. Performance & Core Web Vitals

**Goal:** Keep **Lighthouse performance and Core Web Vitals** in good shape (target **90+** where realistic for real content—not a guarantee on every run, but a design constraint).

Practices aligned with this repo:

- **Server-render** by default; limit client JS and large `"use client"` trees.
- **`next/image`** for Sanity and static assets with sensible sizes and formats; avoid huge unoptimised images in hero sections.
- **Fonts** — Use the established font setup from root layout; avoid redundant webfont loads.
- **Dynamic routes** — Many Sanity-backed pages use `export const dynamic = "force-dynamic"` so content is fresh; if you introduce **static/ISR** caching, pair with **revalidation** (`revalidatePath` / webhook) so editors are not surprised.
- **Lists and carousels** — Avoid unnecessary re-renders; use shared motion patterns conservatively (`prefers-reduced-motion` where already used).
- **Third-party scripts** — Add only when needed; load lazily where possible.

After significant UI or image changes, run **`npm run build`** locally and spot-check **Lighthouse** (or Vercel Speed Insights) on affected routes.

---

## 8. Quick reference files

| Concern | Location |
|---------|----------|
| Revalidation map | `src/app/api/revalidate/sanity/route.ts` |
| Sitemap | `src/app/sitemap.ts` |
| Sanity client | `src/sanity/client.ts` |
| GTP marketing defaults / merge | `src/sanity/gtp-marketing-defaults.ts`, `gtp-stage2.ts`, `gtp-about-page-merge.ts` |
| Section block rendering | `src/components/sections/render-section-block.tsx` |
| Studio schemas | `studio/schemaTypes/` |
| Env & Studio setup | `README.md` |

---

## 9. When in doubt

1. Check whether the behaviour is **CMS-driven** (search for `getGtp*`, `getScph*`, `merge*`, `_type` in queries).  
2. If adding structure editors need, add **schema + seed + README** and mention **publish** in Studio.  
3. Prefer **one clear data path** (query → merge → props) over ad hoc fetches in leaf components.

This file should stay **accurate**—update the **inventory tables** when you add seeds, types, or routes.
