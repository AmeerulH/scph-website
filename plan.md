# Sanity seed / upsert plan (staged)

Node/ts scripts under `scripts/` to seed or upsert hardcoded repo copy into Sanity so editors can take over. Work in **small PRs per stage**; test on **`development`** before production.

**References:** [`scripts/import-gtp-programme-to-sanity.ts`](scripts/import-gtp-programme-to-sanity.ts), [`scripts/import-team-to-sanity.js`](scripts/import-team-to-sanity.js), [`src/sanity/gtp-stage1.ts`](src/sanity/gtp-stage1.ts), [`src/sanity/gtp-stage2.ts`](src/sanity/gtp-stage2.ts), [`src/sanity/scph-pages.ts`](src/sanity/scph-pages.ts), [`src/sanity/queries.ts`](src/sanity/queries.ts), [`src/sanity/section-block-types.ts`](src/sanity/section-block-types.ts), [`studio/schemaTypes/`](studio/schemaTypes/), [`README.md`](README.md) (Sanity section).

---

## Global conventions (every stage)

**Client and env**

- `@sanity/client`, `dotenv` from **repo root** `.env.local`
- `projectId: "y0tkemxm"`, `dataset: process.env.SANITY_DATASET ?? "production"`, `apiVersion: "2024-01-01"`, `useCdn: false`
- `SANITY_API_TOKEN` required when not in dry run

**Dry run**

- Support `DRY_RUN=1` (print JSON / planned payload only), same pattern as the programme importer.

**Dataset alignment**

- Root `.env.local` `SANITY_DATASET` must match `studio/.env` `SANITY_STUDIO_DATASET` for local site + Studio.

**Safety**

- Prefer **`development`** first; promote to production only after review.
- **Do not** overwrite production [`gtp2026Programme`](scripts/import-gtp-programme-to-sanity.ts) if it is already curated (fixed `_id` `gtp2026Programme`).

**Idempotency**

- **Singletons** (site uses `*[_type == "…"][0]`): fixed `_id` matching the type slug (e.g. `gtp2026RegisterPage`) + `createOrReplace`.
- **Multi-docs** (speakers, committee): deterministic `_id` (e.g. `gtp2026HighlightSpeaker.<slug>`, `gtp2026CommitteeMember.<group>.<slug>`) + `createOrReplace`.

**Docs**

- After each new script, add a bullet under README “Import scripts”.

---

## Already in place

| Item | Script | Notes |
|------|--------|--------|
| GTP programme | [`scripts/import-gtp-programme-to-sanity.ts`](scripts/import-gtp-programme-to-sanity.ts) | `npm run import-gtp-programme`; beware production overwrites. |
| Team | [`scripts/import-team-to-sanity.js`](scripts/import-team-to-sanity.js) | Currently hardcodes `dataset: "production"`; consider aligning with `SANITY_DATASET` in a small follow-up. |

---

## Stage 1 — GTP Get involved + Register singletons

**Scope:** Default strings used by `mergeGtpGetInvolvedCopy` and `mergeGtpRegisterCopy` when CMS is null.

**Source:** [`src/sanity/gtp-stage2.ts`](src/sanity/gtp-stage2.ts) — `DEFAULT_GET_INVOLVED`, `DEFAULT_REGISTER`.

**Sanity `_type`:** `gtp2026GetInvolvedPage`, `gtp2026RegisterPage` — schemas in [`studio/schemaTypes/gtp2026GetInvolvedPageType.ts`](studio/schemaTypes/gtp2026GetInvolvedPageType.ts), [`studio/schemaTypes/gtp2026RegisterPageType.ts`](studio/schemaTypes/gtp2026RegisterPageType.ts).

**Proposed scripts:** `scripts/seed-gtp-get-involved-page.ts`, `scripts/seed-gtp-register-page.ts` (or one combined file).

**Ids:** `gtp2026GetInvolvedPage`, `gtp2026RegisterPage`.

**Verify:** Studio → publish both. Site: `/events/gtp-2026/get-involved`, `/events/gtp-2026/register` — edit copy, publish, refresh.

---

## Stage 2 — GTP Submissions singleton

**Scope:** Full submissions marketing copy (hero, 3 pillars, 8 themes, CTA band, deadlines, form intros).

**Source:** [`src/sanity/gtp-stage2.ts`](src/sanity/gtp-stage2.ts) — `DEFAULT_SUBMISSIONS`, `DEFAULT_SUBMISSION_PILLARS`, `DEFAULT_SUBMISSION_THEMES`.

**Sanity `_type`:** `gtp2026SubmissionsPage` — [`studio/schemaTypes/gtp2026SubmissionsPageType.ts`](studio/schemaTypes/gtp2026SubmissionsPageType.ts); slot types in [`studio/schemaTypes/gtp2026SubmissionsSlotTypes.ts`](studio/schemaTypes/gtp2026SubmissionsSlotTypes.ts).

**Proposed script:** `scripts/seed-gtp-submissions-page.ts`.

**Id:** `gtp2026SubmissionsPage`.

**Verify:** Studio → publish. Site: `/events/gtp-2026/submissions`.

---

## Stage 3 — GTP highlight speakers (multi-doc)

**Scope:** Speaker grid + modal fields for `/` and `/events/gtp-2026/about`.

**Source:** [`src/data/gtp-highlight-speakers.ts`](src/data/gtp-highlight-speakers.ts) — `gtpHighlightSpeakers`.

**Sanity `_type`:** `gtp2026HighlightSpeaker` — [`studio/schemaTypes/gtp2026HighlightSpeakerType.ts`](studio/schemaTypes/gtp2026HighlightSpeakerType.ts); embedded `gtp2026HighlightSessionSlot`.

**Proposed script:** `scripts/seed-gtp-highlight-speakers.ts`.

**Ids:** e.g. `gtp2026HighlightSpeaker.<slug-from-name>`; `order` from array index.

**Images:** Schema uses Sanity `image`; data uses `public/` paths. **v1:** text fields only, editors upload photos; **optional v2:** asset upload like team import.

**Verify:** Studio → publish. Site: `/`, `/events/gtp-2026/about`.

---

## Stage 4 — GTP organising committee (multi-doc)

**Scope:** Static fallbacks for co-chairs, planning, programme when Sanity is empty.

**Source:** [`src/app/events/gtp-2026/organising-committee/page.tsx`](src/app/events/gtp-2026/organising-committee/page.tsx) — `staticCochairs`, `staticPlanningCommittee`, `staticProgrammeCommittee`; mapping in [`src/sanity/gtp-stage1.ts`](src/sanity/gtp-stage1.ts).

**Sanity `_type`:** `gtp2026CommitteeMember` — [`studio/schemaTypes/gtp2026CommitteeMemberType.ts`](studio/schemaTypes/gtp2026CommitteeMemberType.ts).

**Proposed script:** `scripts/seed-gtp-committee-members.ts`.

**Ids:** e.g. `gtp2026CommitteeMember.<group>.<slug>`.

**Images:** Same v1 text-only / v2 upload approach as Stage 3.

**Verify:** Studio → publish. Site: `/events/gtp-2026/organising-committee`.

---

## Stage 5 — GTP FAQ (gap)

**Reality:** [`src/app/events/gtp-2026/faq/page.tsx`](src/app/events/gtp-2026/faq/page.tsx) has **no** static FAQ array; empty CMS → placeholder.

**Options:** (a) editors only in Studio; (b) add `scripts/data/gtp-faq-seed.json` + `scripts/seed-gtp-faq-items.ts` → `gtp2026FaqItem` ([`studio/schemaTypes/gtp2026FaqItemType.ts`](studio/schemaTypes/gtp2026FaqItemType.ts)).

**Verify:** `/events/gtp-2026/faq` shows accordions.

---

## Stage 6 — GTP Media + Biz forum (optional skeleton)

**Scope:** Minimal singletons; routes mostly placeholder until `sections` exist — [`src/app/events/gtp-2026/media/page.tsx`](src/app/events/gtp-2026/media/page.tsx), [`src/app/events/gtp-2026/biz-forum/page.tsx`](src/app/events/gtp-2026/biz-forum/page.tsx).

**Sanity `_type`:** `gtp2026MediaPage`, `gtp2026BizForumPage`.

**Proposed script:** `scripts/seed-gtp-media-bizforum-pages.ts` (titles / optional `placeholderDescription`).

**Verify:** `/events/gtp-2026/media`, `/events/gtp-2026/biz-forum` after adding real sections in Studio.

---

## Stage 7 — GTP About `sections` (optional, hard)

**Scope:** Extra bands only; main about content is JSX — [`src/app/events/gtp-2026/about/page.tsx`](src/app/events/gtp-2026/about/page.tsx), `gtp2026AboutPage` in [`studio/schemaTypes/gtp2026AboutPageType.ts`](studio/schemaTypes/gtp2026AboutPageType.ts).

**Approach:** Editor-authored in Studio, or extract copy into a data module matching `section*` shapes then seed.

---

## Stage 8 — SCPH Meet the team + Programmes / Projects / Events singletons

**Scope:**

- Meet the Team chrome defaults: [`src/app/(scph)/about-us/page.tsx`](src/app/(scph)/about-us/page.tsx) (`sectionTitle`, `sectionSubtitle`, `showGetInvolvedCta`, `introBlurb`).
- Programmes placeholder: [`src/app/(scph)/programmes/page.tsx`](src/app/(scph)/programmes/page.tsx) — `DEFAULT_PLACEHOLDER_DESCRIPTION`, title.
- Events defaults: [`src/app/(scph)/events/page.tsx`](src/app/(scph)/events/page.tsx) — `"Events"` / `"What's On"`.
- Projects: default title `"Projects"` only ([`src/app/(scph)/projects/page.tsx`](src/app/(scph)/projects/page.tsx)); no default description in code.

**Sanity `_type`:** `scphMeetTheTeamPage`, `scphProgrammesPage`, `scphProjectsPage`, `scphEventsPage` — [`studio/schemaTypes/scphMeetTheTeamPageType.ts`](studio/schemaTypes/scphMeetTheTeamPageType.ts), [`studio/schemaTypes/scphSectionsPageTypes.ts`](studio/schemaTypes/scphSectionsPageTypes.ts).

**Proposed scripts:** `scripts/seed-scph-meet-the-team-page.ts`; `scripts/seed-scph-programmes-projects-events-pages.ts` (or split).

**Ids:** e.g. `scphMeetTheTeamPage`, `scphProgrammesPage`, `scphProjectsPage`, `scphEventsPage`.

**Verify:** `/about-us`, `/programmes`, `/projects`, `/events`.

---

## Stage 9 — SCPH Home singleton

**Scope:** Optional CMS for stats row, intro sections, roadmap, NPHAP — [`src/app/(scph)/page.tsx`](src/app/(scph)/page.tsx), [`src/sanity/queries.ts`](src/sanity/queries.ts) `getScphHomePage`.

**Sanity `_type`:** `scphHomePage` — [`studio/schemaTypes/scphHomePageType.ts`](studio/schemaTypes/scphHomePageType.ts).

**Proposed script:** `scripts/seed-scph-home-page.ts`.

**Id:** `scphHomePage`.

**Verify:** `/` — stats, roadmap, NPHAP vs code fallbacks.

---

## Stage 10 — SCPH section-only pages (About / Research / Media / Network)

**Scope:** `sections` arrays below heroes; large TSX per route.

**Sanity `_type`:** `scphAboutPage`, `scphResearchPage`, `scphMediaPage`, `scphNetworkPage`.

**Approach:** Per-page batches + small data modules (e.g. `src/data/scph-research-sections.ts`) building only valid `sectionStatsRow` / `sectionRichText` / `sectionProseCta` per [`src/sanity/section-block-types.ts`](src/sanity/section-block-types.ts).

**Verify:** `/about-us` (CMS bands), `/research`, `/media`, `/network`.

---

## Per-stage checklist

1. Align `SANITY_DATASET` (root) with `SANITY_STUDIO_DATASET` (studio).
2. Set `SANITY_API_TOKEN` for writes.
3. `DRY_RUN=1 npx tsx scripts/<script>.ts` — review output.
4. `npx tsx scripts/<script>.ts` — apply.
5. Studio: open documents for that stage → **Publish**.
6. `npm run dev` — hit URLs listed for the stage; change one field, publish, confirm on site.

Optional: add `package.json` npm scripts per importer (e.g. `seed:gtp-register`) for convenience.
