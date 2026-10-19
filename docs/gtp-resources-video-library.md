# GTP Resources and video library

## Editors

Resources is a top-level GTP navigation item. In Studio, **GTP 2026 Resources → Resources & PDF downloads** holds each toolkit/report; **Page settings** holds page wording. The first resource by Display order is featured. Put Summary booklet and Full toolkit in the same Faith Based Toolkit entry. Each labelled download accepts a PDF; leaving it empty shows Coming soon. Publishing a file reference makes that download public immediately on the next page request. Descriptions/covers/credits are optional; covers remain whole. Never upload private drafts as published downloads.

**GTP 2026 Videos** groups Daily Highlights, Session Recordings and GTP2026 Playlist. New entries inherit their collection. Add title, YouTube link and optional description, speaker names, duration, thumbnail and contributor credit. Highlights and recordings require Day 1–4. There is one highlight per day; leave its link empty while editing is pending. The other collections require a valid video link. Upload videos to YouTube with embedding allowed; paste the video URL rather than HTML. There is no automatic title/duration/caption import. Maintain captions in YouTube.

Page wording/channel URL stays in **Media → Videos**. A developer-controlled cutover setting determines which library is active. Before migration, the original Media video array still renders as the playlist. Afterwards, edit individual video documents; original entries stay read-only for recovery. Unpublishing a new video removes it without resurrecting the old copy. Session search spans title, description and speaker names; ordering is day then Display order. Playlist order is independent of optional day labels.

## Local tests

Use the native Node runtime on this Mac. The working checkout links the existing node_modules; no new packages are needed.

```sh
npm run test-gtp-library
npm run lint
npm run build
```

Synthetic layouts run only in development:

```sh
GTP_LIBRARY_REVIEW_MODE=1 npm run dev -- --hostname 127.0.0.1 --port 3026
```

With that server running, `npm run test-gtp-library:browser` repeats the browser checks using local Chrome. It checks the two current published legacy videos as well as synthetic fixtures; update those preservation assertions only after an intentional content change.

`npx tsx scripts/test-gtp-library-motion.ts` checks player transitions, interruption, immediate playback stop, focus/scroll cleanup, keyboard/reduced-motion paths and responsive control feedback. It writes labelled test evidence under `.impeccable/review/gtp-library/`; iframe requests are blocked. Coarse-pointer press styling uses forced `:active`, with actual taps checking player/no-hover behaviour. Check physical held-touch feel separately on a phone.

Open `/dev/gtp-library-review` for videos; `?view=resources&case=partial` shows the sample toolkit/report layout. Cases: `partial` (one sample download), `long`, `many` (200 recordings), `empty`, `error`. All content is explicitly sample material; sample file URLs are not real reports. The review page is enabled on trusted Vercel Preview deployments (`NODE_ENV=production`, `VERCEL_ENV=preview`) so the team can review populated samples without CMS writes. Local development still requires `GTP_LIBRARY_REVIEW_MODE=1`. Real production (`VERCEL_ENV=production`) and ordinary local production builds return actual HTTP 404 regardless of that flag. Proxy and page share the server-only guard; request parameters cannot enable it. The sample page has noindex metadata and a visible review badge. Public Resources/Videos routes always read published CMS data; no sample switch is added to those routes.

## Manual acceptance checklist

- [ ] Resources: inspect the grouped toolkit, independent Summary booklet / Full toolkit availability, report order and pending labels using `/dev/gtp-library-review?view=resources&case=partial`.
- [ ] Videos: inspect all three collections and four highlight slots at `/dev/gtp-library-review`; check the floating pills and the **Session Recordings** label.
- [ ] Recordings: use `?case=many` to search by speaker/title, select a day, clear filters, change pages and use browser Back. Confirm the day dropdown text has room beside its chevron.
- [ ] Player: open, close, reopen and press Escape. Check keyboard focus restoration, press feedback and reduced-motion behaviour.
- [ ] Responsive: inspect phone width, swipe the collection pill strip and confirm its active label stays visible without page overflow.
- [ ] Empty/error states: inspect `?case=empty` and `?case=error`. Preview content is synthetic; the sample PDF does not represent a real downloadable report.
- [ ] After approved Studio/schema setup and content population: publish a real toolkit PDF and YouTube video, then verify actual download contents and audiovisual playback. Studio groups are **GTP 2026 Resources → Resources & PDF downloads** and **GTP 2026 Videos → Daily Highlights / Session Recordings / GTP2026 Playlist**.

## Seeds and migration

Do not run writes against production without explicit approval. All new scripts default to dry-run; `DRY_RUN=1` also overrides `APPLY=1`. Existing environment secrets stay server-side.

```sh
DRY_RUN=1 npm run seed-gtp-resources-page
DRY_RUN=1 npm run seed-gtp-video-library
```

The first seed supplies Resources settings and three pending resource shells. The second adds missing collection copy and four highlight shells. It neither changes current video introduction/channel copy nor enables cutover. Applying a seed uses `APPLY=1 SANITY_DATASET=development`; production additionally requires approved `ALLOW_PRODUCTION=1`. Existing resource/video documents are never replaced; settings use `setIfMissing`. Backups are saved with restricted permissions under the OS temporary directory.

Migration preserves every original video field including raw image references, using deterministic import IDs plus a `legacyKey`. It refuses ambiguous/invalid source entries, existing target drafts, conflicting target content, or an unpublished Media draft. Resolve drafts with the editor before cutover; do not discard them as a shortcut. Arrange a brief editing pause while applying the reviewed migration.

```sh
DRY_RUN=1 SANITY_DATASET=development npm run migrate-gtp-media-videos
# Review the emitted backup and unique plan file, then use that exact path:
APPLY=1 SANITY_DATASET=development MIGRATION_PLAN_PATH=/absolute/reviewed-plan.json npm run migrate-gtp-media-videos
```

Source or target changes invalidate the reviewed plan. Creation and revision-guarded cutover happen atomically; no source array is deleted. Once cutover is active, rerunning is a no-op and never overwrites subsequent editor changes. Record the backup/plan paths outside Git. Recovering a prior layout requires a reviewed, revision-guarded change to `useVideoLibrary`, not reimporting the whole Media document.

## Release sequence

1. Review source, scripts and local checks; test writes in development only after review.
2. Separately approve and deploy the schema and Studio. No deployment is part of the local implementation.
3. Export fresh published/draft documents; review/apply production shell seeds and video migration under separate explicit approval.
4. Upload approved PDFs, covers and new YouTube links; publish through Studio. The declaration and outcome report shells deliberately contain no invented facts or attachments.
5. Commit/push/open the PR as authorized on 19 October 2026. Share the Vercel Preview links to the public routes and labelled sample review pages. Merge/production website release remains separate; verify both live routes, real downloads and real YouTube playback after release.

The revalidation map covers both pages and the Media preview; dynamic rendering makes published edits visible on the next request. Resource fetch failures show a retry message rather than pretending content is merely pending. Search/filter/pagination are server-side; only displayed video thumbnails are hydrated. No new API endpoint or dependency was added.

## Continuation prompt

Continue the Resources/video library PR on `codex/gtp-resources-video-library` in its attached worktree. Read this guide, `docs/gtp-resources-video-library-plan.md`, `docs/gtp-library-review.md`, and the validation record before changing anything. Preserve the original checkout's unrelated work. Repeat only checks justified by new changes. The user authorized commit/push/PR on 19 October 2026; production schema/Studio deployment, CMS writes, publishing, merge and website production release still need their corresponding authorization. The PR description is `docs/gtp-resources-video-library-pr.md`. Use the actual PR/deployment status for its current preview URL; don't infer deployment success from a local build.
