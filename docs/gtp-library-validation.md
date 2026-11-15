# Local validation — 19 October 2026

Branch: `codex/gtp-resources-video-library`; baseline commit `b041f77`. Implementation and validation use the attached `gtp-resources-videos` worktree, preserving the original checkout's existing staged/unstaged work. The user authorized commit/push/PR on 19 October 2026 after the local review; production CMS and website release remain separate.

## Passing checks

- `npm run test-gtp-library`: eight behavioural groups, including a 200-session archive, URL/file validation, pending/partial states, migration field/reference preservation, draft suppression and cutover without legacy resurrection.
- `npm run test-gtp-library:browser`: public routes, current legacy videos, four day slots, click-to-load single iframe, close/Escape/focus restoration, partial download rendering, responsive menus, search/day filters, pagination/Back, retained fixtures and long/empty/error layouts. Browser page-error collection was empty.
- Root TypeScript and Studio TypeScript checks passed. Final `npm run build` passed and includes the narrow review proxy.
- Production runtime with `GTP_LIBRARY_REVIEW_MODE=1`: the review URL and descendants returned actual HTTP 404; public Resources/Videos/Media returned 200 without fixture content. Development review with the flag still returned labelled sample content.
- Seeds and migration ran only in dry-run mode. The migration read production's two legacy videos and produced a raw backup and exact review plan beneath the OS temporary directory. All three write entrypoints refused a guarded production APPLY attempt before performing any mutation. Proxy environment combinations passed: production+flag → 404; development without flag → 404; development+flag → next.
- Independent Standards, Spec/security and Impeccable finish reviews completed. All identified issues were resolved and the filter correction was independently reproduced. Scoped detector output was `[]`. `git diff --check` passed.

## Lint baseline

Full lint remains **17 errors and 11 warnings**. Current output matched the pre-feature baseline byte-for-byte. No feature lint errors or warnings were introduced; the repository-wide lint gate is not clean.

## Mobile performance

Unlighthouse 0.17.7 completed all **30 sitemap routes**, with no Lighthouse runtime errors. The local sitemap lists the production origin, so default discovery skipped it. The successful CI scan derived the same 30 paths from the local sitemap and explicitly rebased them onto the local production server, with the bundled native Node runtime available to child processes.

| Affected route | Performance |
| --- | ---: |
| Resources | 84 |
| Videos | 82 |
| Media | 80 |

Four other routes were below the repository's 80 contract:

| Route | Performance |
| --- | ---: |
| `/events/gtp-2026/about` | 74 |
| `/events/gtp-2026/programmes` | 78 |
| `/events/gtp-2026/programmes/film-screening` | 73 |
| `/events/gtp-2026/sustainability` | 77 |

A pre-feature performance comparison was not run, so these are reported as separate route findings, not proven pre-existing regressions. No unrelated content/image optimisation was included. Machine-readable route results are in `.impeccable/review/gtp-library/performance-results.json`; full local reports are under the ignored `unlighthouse/` directory.

These lab scores cover the current published content: empty Resources and the legacy video playlist. Recheck populated content and real devices when new documents/videos are published.

## Motion finishing pass

Impeccable retained the existing visual direction; the scoped [Emil Kowalski motion plan](../plans/001-library-motion.md) adds player continuity and control feedback. Independent motion source review returned **Approve**. No page-entry or scroll choreography, new dependency or global motion change was added.

- `npx tsx scripts/test-gtp-library-motion.ts` passed in local Chrome: actual 200ms entrance/150ms exit interpolation, immediate iframe removal, stable closing geometry, focus/scroll/aria cleanup, rapid reopen, missing-transition fallback, immediate keyboard actions, live reduced-motion preferences, fine-pointer hover, coarse-pointer controls and 390px geometry. Browser page-error collection was empty.
- `npm run test-gtp-library` (eight groups), `npm run test-gtp-library:browser`, root TypeScript and focused source/test lint passed. A fresh production build passed. Full lint still matches the pre-feature baseline byte-for-byte: 17 errors and 11 warnings.
- Desktop, paused 40ms entrance and normal-motion 390px player captures were inspected. The recorded phase was opacity .681869 / scale .984093, between the .95 start and full-size endpoint. Test iframe requests were deliberately blocked; the grey iframe in those captures does not establish real playback.
- Headless held-touch injection did not reliably set native `:active`. Coarse-pointer press CSS was checked with forced `:active`; actual emulated taps verified player activation and absence of sticky hover. Physical held-touch feel remains unverified. Reduced motion removes the press transform and retains a 150ms player fade; keyboard mode stays immediate.

Fresh affected-route mobile Unlighthouse results after the motion build:

| Route | Performance |
| --- | ---: |
| Resources | 86 |
| Videos | 82 |
| Media, initial single sample | 78 |
| Media, follow-up three-sample median | 80 |

The Media follow-up tested repeatability without source changes. The initial report identified the unchanged hero lede as LCP (5.3s), with 0ms blocking time and zero layout shift; the earlier scan had 5.0s LCP. The follow-up median meets the 80 bar with little margin; the initial 78 is retained, not discarded. No unrelated hero/font optimisation was included. This is lab evidence, not a claim of stable field performance.

Artifacts: `.impeccable/review/gtp-library/motion-results.json`, `motion-performance-results.json`, `motion-desktop-open.png`, `motion-desktop-phase-40ms.png` and `motion-mobile-open.png`. Raw performance reports are under `/tmp/gtp-library-motion-unlighthouse` and `/tmp/gtp-library-motion-media-confirm`.

## Selector, dropdown and terminology refinements

The video collections now reuse Media's floating pill selector. The shared component accepts collection labels, tracks scroll position and reveals the active pill within its horizontal strip. A reproduced edge case at the bottom of a short playlist was fixed. Keyboard-triggered selection remains immediate after native anchor navigation moves focus away from the pill. The native day select now has 48px reserved right padding and a decorative chevron inset 16px. The collection name is consistently **Session Recordings** in defaults, Studio options, tests and documentation. A read-only published Sanity query confirmed `sessionRecordingsTitle` is empty, so no existing editor copy or CMS document needed changing.

The expanded Chrome browser suite passed at 1440px and 390px, including active pills, final-section selection, keyboard handling, selected-label visibility, dropdown spacing and the existing Media selector. Existing motion checks, root/Studio TypeScript and the final production build passed. Full lint remains the exact 17-error/11-warning baseline. Settled selector/filter captures were saved at both widths. The scoped detector returned `[]` with exit 0. Fresh three-sample mobile medians after the selector change were **Media 81 / Videos 81**; evidence is `pill-performance-results.json`. The final terminology correction was followed by another passing browser suite and build.

## PR and CMS preflight

The user authorized commit/push/PR and requested team previews. The review gate now supports trusted Vercel Preview without enabling samples on real production. Nine behavioural groups passed, full lint matched its original baseline exactly, the fresh Next.js build and expanded Chrome suite passed. Schema validation reported 0 errors / 0 warnings and the Studio local build passed. Independent final Standards and Spec/security reviews found no actionable issues.

Production runtime (`VERCEL_ENV=production`, local flag enabled) returned actual 404 for the review URL and a descendant with spoofed query values. Preview runtime (`VERCEL_ENV=preview`, local flag disabled) returned 200 with labelled/noindex samples. Public paths stayed free of sample content. The entire expanded browser suite also passed against the production-mode Preview server. Evidence: `preview-access-results.json`.

Read-only production preflight found only the published Media singleton among the relevant document types: two legacy videos, no Media draft, `useVideoLibrary` false. A raw restricted backup and fresh seed/migration dry-run plans were prepared under the OS temporary directory. [The proposed CMS rollout](gtp-library-cms-rollout.md) identifies eight new pending documents and eight missing Media wording fields; it preserves current content and keeps cutover separate. No content transaction or schema/Studio deployment was run.

## Remaining release/content work

No CMS writes, schema/Studio deployment, file upload/publish, production website deployment or merge occurred during implementation. Commit/push/PR are now authorized. Actual new PDF delivery and real YouTube playback require approved content and a content smoke test; browser automation verifies URLs/player lifecycle rather than asserting audiovisual playback. Review and authorize the production release actions separately using the implementation guide.
