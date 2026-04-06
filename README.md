# scph-website

Next.js site for Sunway Centre for Planetary Health and GTP 2026 event pages, with content in [Sanity](https://www.sanity.io/).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build: `npm run build`.

## Sanity Studio

Schemas live in [`studio/`](studio/). Local Studio:

```bash
cd studio
npm install
npm run dev
```

After schema changes, deploy the schema to your content lake:

```bash
cd studio && npx sanity schema deploy
```

Hosted Studio: from `studio/`, use `npm run build` / `npm run deploy`. Point Studio at the same **project** and **dataset** as the Next app (see below).

### Environment variables

| Variable | Where | Purpose |
| -------- | ----- | ------- |
| `SANITY_DATASET` | Root `.env.local` | Dataset the **website** reads (`production` if unset). |
| `SANITY_API_TOKEN` | Root `.env.local` | Write token for import scripts (e.g. `npm run import-gtp-programme`). |
| `SANITY_REVALIDATE_SECRET` | Root `.env.local` | Shared secret for `POST /api/revalidate/sanity` (GROQ webhook). |
| `SANITY_STUDIO_DATASET` | `studio/.env` | Dataset for **Studio + CLI** (`production` if unset). See `studio/.env.example`. |

The Next client is configured in [`src/sanity/client.ts`](src/sanity/client.ts).

### Publish vs draft

The public site uses the **published** API. Edits in Studio must be **published** to appear on the site.

### Static fallbacks

Many pages **merge** Sanity fields with **defaults in code** (see `src/sanity/gtp-stage1.ts`, `gtp-stage2.ts`, and similar). That keeps the site usable before every document exists. When a route should rely only on CMS, populate Studio, publish, then narrow fallbacks in code as a deliberate change.

### Editors (sections and singletons)

- **Page singletons** (e.g. `scphHomePage`, `gtp2026AboutPage`) often have a **`sections`** array of blocks (`sectionStatsRow`, `sectionRichText`, `sectionProseCta`).
- Toggle **`enabled`** on a block to hide it without deleting.
- Reorder rows in **`sections`** to change on-page order.
- **New layouts** need a developer: new object type in Studio, renderer in Next (see [`src/components/sections/render-section-block.tsx`](src/components/sections/render-section-block.tsx)), then schema deploy.

### GROQ webhook (optional revalidation)

Sanity-driven routes listed below already use **`export const dynamic = "force-dynamic"`**, so each request refetches content without a webhook. A webhook is still useful if you later switch routes to static/ISR, or to warm edge caches.

Configure a webhook to **`POST /api/revalidate/sanity`** with:

- **Secret** = `SANITY_REVALIDATE_SECRET` (same value in Vercel and Sanity webhook config).
- **Dataset** must match the app’s `SANITY_DATASET` (header `sanity-dataset` is checked).

[`src/app/api/revalidate/sanity/route.ts`](src/app/api/revalidate/sanity/route.ts) maps document **`_type`** to paths to `revalidatePath`. Covered types include:

| Sanity `_type` | Revalidated paths |
| -------------- | ----------------- |
| `gtp2026Programme` | `/events/gtp-2026/programmes`, `/events/gtp-2026/about` |
| `gtp2026HighlightSpeaker` | `/`, `/events/gtp-2026/about` |
| `gtp2026AboutPage` | `/events/gtp-2026/about` |
| `gtp2026CommitteeMember` | `/events/gtp-2026/organising-committee` |
| `gtp2026FaqItem` | `/events/gtp-2026/faq` |
| `gtp2026GetInvolvedPage` | `/events/gtp-2026/get-involved` |
| `gtp2026RegisterPage` | `/events/gtp-2026/register` |
| `gtp2026SubmissionsPage` | `/events/gtp-2026/submissions` |
| `gtp2026MediaPage` | `/events/gtp-2026/media` |
| `gtp2026BizForumPage` | `/events/gtp-2026/biz-forum` |
| `scphHomePage` | `/` |
| `scphAboutPage`, `scphMeetTheTeamPage`, `teamMember` | `/about-us` |
| `scphResearchPage` | `/research` |
| `scphMediaPage` | `/media` |
| `scphNetworkPage` | `/network` |
| `scphEventsPage` | `/events` |
| `scphProgrammesPage` | `/programmes` |
| `scphProjectsPage` | `/projects` |

`cmsSandboxPage` and embedded **`section*`** object types are not listed: updates usually arrive as saves on the **parent document**, which should carry that document’s `_type`.

### Import scripts

- **GTP programme** (agenda): `npm run import-gtp-programme` — source [`src/components/gtp/programmes/data.tsx`](src/components/gtp/programmes/data.tsx), script [`scripts/import-gtp-programme-to-sanity.ts`](scripts/import-gtp-programme-to-sanity.ts). Uses `SANITY_DATASET` from `.env.local`. `DRY_RUN=1` prints JSON only. With `SANITY_DATASET=development` or `GTP_APPEND_TEST_SESSION=1`, Day 1 gets an extra test session.
- **GTP Register / Get involved** (marketing copy): `npm run seed-gtp-register-page` and `npm run seed-gtp-get-involved-page` — source [`src/sanity/gtp-marketing-defaults.ts`](src/sanity/gtp-marketing-defaults.ts) (same defaults as `mergeGtpRegisterCopy` / `mergeGtpGetInvolvedCopy`). Upserts singletons `_id` = `gtp2026RegisterPage` / `gtp2026GetInvolvedPage`. `DRY_RUN=1` prints JSON only. Prefer `SANITY_DATASET=development` first; align with `SANITY_STUDIO_DATASET` in `studio/.env`.
- **GTP Submissions** (page + in-form copy): `npm run seed-gtp-submissions-page` — [`src/sanity/gtp-marketing-defaults.ts`](src/sanity/gtp-marketing-defaults.ts) + [`src/sanity/gtp-submissions-form-defaults.ts`](src/sanity/gtp-submissions-form-defaults.ts); upserts `_id` = `gtp2026SubmissionsPage` including `abstractForm` and `workshopForm` (see [`studio/schemaTypes/gtp2026SubmissionsFormCopyTypes.ts`](studio/schemaTypes/gtp2026SubmissionsFormCopyTypes.ts)). After schema changes, run `cd studio && npx sanity schema deploy`. `DRY_RUN=1` prints JSON only.
- **GTP highlight speakers**: `npm run seed-gtp-highlight-speakers` — source [`src/data/gtp-highlight-speakers.ts`](src/data/gtp-highlight-speakers.ts); upserts one `gtp2026HighlightSpeaker` per row with `_id` = `gtpHighlightSpeaker-<slug>`, `order` from array index, optional image upload from `public/`. `DRY_RUN=1` prints JSON only (image shown as placeholder note).
- **GTP organising committee**: `npm run seed-gtp-committee-members` — source [`src/data/gtp-committee-static.ts`](src/data/gtp-committee-static.ts); upserts `gtp2026CommitteeMember` docs with `_id` = `gtpCommittee-<cochair|planning|programme>-<slug(name-role)>`, global `order` for sort, optional images. `DRY_RUN=1` prints JSON only.
- **Team roster**: [`scripts/import-team-to-sanity.js`](scripts/import-team-to-sanity.js) (see script header for usage).

### CMS sandbox

[`cmsSandboxPage`](studio/schemaTypes/cmsSandboxPageType.ts) is for composing **`section*`** blocks in Studio without wiring a route. It is not read by the Next app.
