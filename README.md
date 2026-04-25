# scph-website

Next.js site for Sunway Centre for Planetary Health and GTP 2026 event pages, with content in [Sanity](https://www.sanity.io/).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build: `npm run build`.

### Full-site Lighthouse (Unlighthouse)

Lab audits for routes in [`/sitemap.xml`](src/app/sitemap.ts) (see [`ALL_PUBLIC_INDEXABLE_PATHS`](src/lib/public-indexable-paths.ts)). Requires **Chrome/Chromium** on the machine.

1. Point at **production/preview** or run **`npm run build && npm run start`** locally.
2. Set **`UNLIGHTHOUSE_SITE`** or **`SCAN_SITE_URL`** to the origin (no path), e.g. `https://your-domain` or `http://localhost:3000`.
3. Run **`npm run unlighthouse:scan`** (mobile) or **`npm run unlighthouse:scan:desktop`** (desktop, closer to Vercel Speed Insights desktop).
4. Open the generated UI under **`unlighthouse/`** in the repo root (gitignored).

Scores are **synthetic** (Lighthouse); [Vercel Speed Insights](https://vercel.com/docs/speed-insights) reflects **real users** and updates over days.

## Sanity Studio

Schemas live in [`studio/`](studio/). Local Studio:

```bash
cd studio
npm install
npm run dev
```

Use **Node 20 or 22 LTS** if `npm install` fails with `Invalid Version` (seen on some Node 25 / npm 11 setups). The repo includes [`studio/.npmrc`](studio/.npmrc) with `legacy-peer-deps=true` so installs match what `sanity dev` expects. If install still breaks, delete `studio/node_modules` and `studio/package-lock.json`, then run `npm install` again.

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
| `JOURNALIST_WORKSHOP_SESSION_SECRET` | Root `.env.local` + Vercel | **≥16 chars.** Signs the HttpOnly session cookie for `POST /api/scph/journalist-workshops/unlock` (journalist workshop access codes). Generate with e.g. `openssl rand -hex 32`. |
| `SANITY_STUDIO_DATASET` | `studio/.env` | Dataset for **Studio + CLI** (`production` if unset). See `studio/.env.example`. |
| `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` | Root `.env.local` + Vercel | Optional. Enables [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) beacon in [`src/app/layout.tsx`](src/app/layout.tsx) (public token from Cloudflare dashboard). |

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
| `gtp2026FaqGroup` | `/events/gtp-2026/faq` |
| `gtp2026GetInvolvedPage` | `/events/gtp-2026/get-involved` |
| `gtp2026SubmissionsPage` | `/events/gtp-2026/submissions` |
| `gtp2026MediaPage` | `/events/gtp-2026/media` |
| `gtp2026BizForumPage` | `/events/gtp-2026/biz-forum` |
| `scphHomePage` | `/` |
| `scphAboutPage`, `scphMeetTheTeamPage`, `teamMember` | `/about-us` |
| `scphResearchPage` | `/research` |
| `scphMediaPage` | `/media` |
| `scphNetworkPage` | `/network` |
| `scphJournalistWorkshopsPage` | `/network/journalist-workshops` |
| `scphEventsPage` | `/events` |
| `scphProgrammesPage` | `/programmes` |
| `scphProjectsPage` | `/projects` |

`cmsSandboxPage` and embedded **`section*`** object types are not listed: updates usually arrive as saves on the **parent document**, which should carry that document’s `_type`.

### Import scripts

- **GTP programme** (agenda): `npm run import-gtp-programme` — source [`src/components/gtp/programmes/data.tsx`](src/components/gtp/programmes/data.tsx), script [`scripts/import-gtp-programme-to-sanity.ts`](scripts/import-gtp-programme-to-sanity.ts). Uses `SANITY_DATASET` from `.env.local`. `DRY_RUN=1` prints JSON only. With `SANITY_DATASET=development` or `GTP_APPEND_TEST_SESSION=1`, Day 1 gets an extra test session.
- **GTP Get involved** (marketing copy + Get in Touch sidebar): `npm run seed-gtp-get-involved-page` — source [`src/sanity/gtp-marketing-defaults.ts`](src/sanity/gtp-marketing-defaults.ts) (same defaults as `mergeGtpGetInvolvedCopy`). Upserts singleton `_id` = `gtp2026GetInvolvedPage`, including FAQ link, structured contact lines, socials, and optional **Google Map embed URL** (paste iframe `src` from Google Maps). `DRY_RUN=1` prints JSON only. Prefer `SANITY_DATASET=development` first; align with `SANITY_STUDIO_DATASET` in `studio/.env`. After schema changes, `cd studio && npx sanity schema deploy`. Conference registration is on Sunway Events (see `GTP_2026_REGISTRATION_URL` in [`src/lib/gtp-registration-url.ts`](src/lib/gtp-registration-url.ts)); `/events/gtp-2026/register` redirects there.
- **GTP Submissions** (page + in-form copy): `npm run seed-gtp-submissions-page` — [`src/sanity/gtp-marketing-defaults.ts`](src/sanity/gtp-marketing-defaults.ts) + [`src/sanity/gtp-submissions-form-defaults.ts`](src/sanity/gtp-submissions-form-defaults.ts); upserts `_id` = `gtp2026SubmissionsPage` including `abstractForm` and `workshopForm` (see [`studio/schemaTypes/gtp2026SubmissionsFormCopyTypes.ts`](studio/schemaTypes/gtp2026SubmissionsFormCopyTypes.ts)). After schema changes, run `cd studio && npx sanity schema deploy`. `DRY_RUN=1` prints JSON only.
- **GTP highlight speakers**: `npm run seed-gtp-highlight-speakers` — source [`src/data/gtp-highlight-speakers.ts`](src/data/gtp-highlight-speakers.ts); upserts one `gtp2026HighlightSpeaker` per row with `_id` = `gtpHighlightSpeaker-<slug>`, `order` from array index, optional image upload from `public/`. `DRY_RUN=1` prints JSON only (image shown as placeholder note).
- **GTP organising committee**: `npm run seed-gtp-committee-members` — source [`src/data/gtp-committee-static.ts`](src/data/gtp-committee-static.ts); upserts `gtp2026CommitteeMember` docs with `_id` = `gtpCommittee-<cochair|planning|programme>-<slug(name-role)>`, global `order` for sort, optional images. `DRY_RUN=1` prints JSON only.
- **GTP FAQ**: `npm run seed-gtp-faq-items` — source [`scripts/data/gtp-faq-seed.json`](scripts/data/gtp-faq-seed.json); nested `groups` upsert `gtp2026FaqGroup` tab documents (fixed `_id` per tab) with embedded `items[]` (`gtp2026FaqAccordionItem` objects, stable `_key` per row). `DRY_RUN=1` prints JSON only.
- **GTP About only**: `npm run seed-gtp-about-page` — upserts **`gtp2026AboutPage` only** with the same full-band payload as the combined seed (builder: [`scripts/lib/gtp-about-page-seed-doc.ts`](scripts/lib/gtp-about-page-seed-doc.ts)). Each band has **Visible on site** in Studio (like SCPH section blocks). **Sponsors:** uploads **PIK** into `sponsorsBand.sponsors` when the file exists; the public band renders only when that band is visible and at least one sponsor has logo + name. Re-running replaces the whole About document. After schema changes, `cd studio && npx sanity schema deploy`, then re-seed and **Publish**. `DRY_RUN=1` prints JSON only.
- **GTP Media + Business forum + About**: `npm run seed-gtp-media-bizforum-pages` — upserts `gtp2026MediaPage` / `gtp2026BizForumPage` (placeholder shell) and `gtp2026AboutPage` (same About payload as `seed-gtp-about-page`). **Sponsors:** seed uploads **PIK** when the file exists. The hero **programme carousel** still uses `gtp2026Programme`. After schema changes, run `cd studio && npx sanity schema deploy`, re-seed, and **Publish**. `DRY_RUN=1` prints JSON only.
- **SCPH Meet the Team (section chrome)**: `npm run seed-scph-meet-the-team-page` — upserts `scphMeetTheTeamPage` with `_id` = `scphMeetTheTeamPage` (section title, subtitle, optional intro blurb in Studio, “Get Involved” toggle). Same defaults as schema `initialValue`s and the Meet the Team fallbacks in [`src/app/(scph)/about-us/page.tsx`](src/app/(scph)/about-us/page.tsx). `DRY_RUN=1` prints JSON only.
- **SCPH Journalist workshops** (gated resources shell): `npm run seed-scph-journalist-workshops-page` — upserts `scphJournalistWorkshopsPage` with `_id` = `scphJournalistWorkshopsPage`, empty `workshops` array. After schema changes, `cd studio && npx sanity schema deploy`. `DRY_RUN=1` prints JSON only.
- **SCPH Journalist workshops — Drive rows**: `npm run seed-scph-journalist-workshop-rows` — patches `workshops[]` from [`scripts/data/journalist-workshops-seed.json`](scripts/data/journalist-workshops-seed.json) (seven workshop/reading folders under Workshop Resources). Default `accessCode` values are `REPLACE-ME-*` placeholders; set real codes via **`JOURNALIST_WORKSHOP_ACCESS_CODES='a,b,c,d,e,f,g'`** (comma-separated, **same order** as the JSON) or edit the JSON before running. `DRY_RUN=1` prints the payload only. **Unlock API:** `POST /api/scph/journalist-workshops/unlock` with JSON body `{ "code": "<access code>" }` — on success returns `{ "ok": true }` and sets HttpOnly cookie `scph_jw_session` (requires **`JOURNALIST_WORKSHOP_SESSION_SECRET`**). Wrong or missing code returns `401`; repeated failures from one IP can return `429`. **File proxy:** `GET /api/scph/journalist-workshops/file?fileId=<Drive file id>` with a valid `scph_jw_session` cookie — streams the file if it is **under the session’s workshop folder** (parent walk + shortcut target must also be under that folder). Docs/Sheets/Slides export as **PDF**; Google Drawings as **PNG**; other native files use **Drive `alt=media`**. Needs **`GOOGLE_CLIENT_EMAIL`** + **`GOOGLE_PRIVATE_KEY`** (same service account as submissions). Missing/invalid session → `401`; wrong `fileId` shape → `400`; not allowed or Drive errors → **`404`** (uniform). **Logout:** `POST /api/scph/journalist-workshops/logout` clears `scph_jw_session`. **Page:** `/network/journalist-workshops` (dynamic) — hero from CMS, unlock card, signed-in Drive tree with optional inline preview (`<details>`).
- **SCPH Home** (hero, highlighted events, stats, roadmap, NPHAP, partners): `npm run seed-scph-home-page` — upserts `scphHomePage` with `_id` = `scphHomePage`. Seeds **`hero`**, **`highlightedEvents`**, `statsRow`, empty `introSections`, `roadmapSection` / `nphapSection`, and **`partnersBand`** (`showBand` on; title, eyebrow, notice + link; **`partners`** empty until you add **Sponsor / partner logo** rows in Studio). The home partners band renders only when **Show partners band** is on and at least one partner has logo + name. Defaults: [`src/data/scph-home-hero-defaults.ts`](src/data/scph-home-hero-defaults.ts), [`src/data/scph-home-partners-defaults.ts`](src/data/scph-home-partners-defaults.ts). After schema changes, `cd studio && npx sanity schema deploy`. Re-running replaces the whole document. `DRY_RUN=1` prints JSON only.
- **SCPH Events + Programmes + Projects**: `npm run seed-scph-events-programmes-projects-pages` — upserts `scphEventsPage`, `scphProgrammesPage`, `scphProjectsPage` with `_id` matching `_type`. Events: `pageTitle` / `pageSubtitle` + empty `sections`. Programmes & projects: `pageTitle`, `placeholderDescription` from [`src/data/scph-placeholder-pages-defaults.ts`](src/data/scph-placeholder-pages-defaults.ts), empty `sections`. Event cards on `/events` stay in code until migrated. `DRY_RUN=1` prints JSON only.
- **SCPH About / Research / Network (section shells)**: `npm run seed-scph-section-pages` — upserts the three singletons with **empty `sections`**. Designed layouts stay in code: [`about-us/page.tsx`](src/app/(scph)/about-us/page.tsx), [`research/page.tsx`](src/app/(scph)/research/page.tsx), [`network/page.tsx`](src/app/(scph)/network/page.tsx). Optional **`section*`** blocks in Studio render **after** those bands when visible. Reference prose (not auto-seeded): [`scph-about-sections-seed.ts`](src/data/scph-about-sections-seed.ts), [`scph-research-sections-seed.ts`](src/data/scph-research-sections-seed.ts), [`scph-network-sections-seed.ts`](src/data/scph-network-sections-seed.ts). `DRY_RUN=1` prints JSON only.
- **SCPH + GTP footers** (global chrome): `npm run seed-footers` — upserts `scphFooter` and `gtp2026Footer` with fixed `_id`s. Copy matches [`src/data/scph-footer-defaults.ts`](src/data/scph-footer-defaults.ts) and [`src/data/gtp-footer-defaults.ts`](src/data/gtp-footer-defaults.ts); optional images are omitted so the site uses built-in logo/SVG fallbacks until editors upload in Studio. `DRY_RUN=1` prints JSON only.
- **Team roster**: [`scripts/import-team-to-sanity.js`](scripts/import-team-to-sanity.js) (see script header for usage).

### Google Drive (utilities)

- **Folder inventory** (recursive file list + MIME summary): `npm run inventory-drive-folder` — [`scripts/inventory-drive-folder.ts`](scripts/inventory-drive-folder.ts) uses shared helpers in [`src/lib/google-drive-client.ts`](src/lib/google-drive-client.ts). Uses **`GOOGLE_CLIENT_EMAIL`** and **`GOOGLE_PRIVATE_KEY`** from `.env.local` (same as GTP submissions Sheets) with the **Drive API** scope `drive.readonly`. Set **`DRIVE_FOLDER_ID`** to the folder id from the Drive URL, or pass the id after `--`. Share the folder with the service account (Viewer). Optional: **`DRIVE_MAX_DEPTH`** (default 30), **`DRIVE_JSON=1`** prints a flat JSON array to stdout. **`DRIVE_SAVE=1`** writes `scripts/data/drive-inventory-<folderId>.json` (nested **`tree`** + **`filesFlat`**, gitignored); **`DRIVE_OUTPUT=relative/or/absolute/path.json`** overrides that path.

### CMS sandbox

[`cmsSandboxPage`](studio/schemaTypes/cmsSandboxPageType.ts) is for composing **`section*`** blocks in Studio without wiring a route. It is not read by the Next app.
