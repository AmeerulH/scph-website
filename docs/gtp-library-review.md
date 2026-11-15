# Resources/video library review

Baseline: `b041f77` (origin/master), reviewed as the feature diff including all new source/scripts/schemas. Original reviews preceded commit/push; the user authorized PR publication on 19 October 2026.

## Standards

The independent Standards review found one material issue: the Media preview CTA referenced a colour variable scoped only to the new page wrapper. The preview lives outside that wrapper and could render white text on white. Resolved by referencing the existing global GTP dark-teal token directly. No other material standards findings.

## Spec

The independent Spec review found that the uncontrolled search/day form could retain stale values during Clear filters and Back navigation. Resolved by keying the form from normalized query/day values. An independent Chrome recheck confirmed clear → empty search/All days/200 results; Back → original query/Day 2/50 results; pagination retained query/day/sample variant. The local large-fixture variant is now retained through forms and pagination. No outstanding findings.

## Differential security review

Risk is concentrated in new CLI write scripts and the fixture gate. The revalidation route changed only document-type/path mappings; signature, secret and dataset checks are unchanged. The narrow proxy matches only `/dev/gtp-library-review/:path*` and rejects before streaming. The gate now permits trusted Vercel Preview deployments for the user-requested team review, or opted-in local development; real production stays blocked even with the local flag set. The page repeats the same server-only guard. Request parameters cannot enable it. Fixtures are synthetic, visibly labelled and noindex; public routes never switch to samples.

Reviewed write paths: `scripts/lib/run-gtp-library-seed.ts`, both seed entrypoints, `scripts/lib/gtp-video-migration.ts`, and `scripts/migrate-gtp-media-videos.ts`. Seeds default to dry-run; `DRY_RUN=1` overrides APPLY. Writes require `APPLY=1`; production additionally requires exact `ALLOW_PRODUCTION=1`. Actual guard-denial subprocess checks passed for all three entrypoints with APPLY enabled and production permission disabled; they performed no writes.

Backups/plans are created exclusively with mode 0600 beneath an OS temporary directory. Seeds use create-if-missing and missing-field patches, preserving uploads/editor content. Migration copies every source field except the array wrapper type/key, preserving raw thumbnail references and ordering. It rejects source/target drafts, invalid source entries, duplicate source keys, conflicting target content and reviewed-plan revision changes. Creation and cutover are one atomic transaction; source and pre-existing targets are revision-guarded. The original array remains intact; the enabled library never falls back to it when records are unpublished.

Search input is bounded and handled as text on the server. YouTube URLs become validated video IDs and trusted embed URLs; file URLs are constrained to the project's Sanity CDN and PDF assets. CLI credentials are never imported into client components. The new public pages use published perspective with draft/release-ID filtering at normalization boundaries.

No additional security findings. Review covered these write paths, the proxy/page guard, webhook delta, URL normalization, loaders and client import boundaries. Existing unrelated APIs/authentication were not re-audited.

## Verification limits

Behavioural tests and Chrome checks use local fixtures, including a 200-session archive. The migration dry run read production and produced a backup/plan for the two existing published videos; it did not mutate CMS data. No actual transaction, schema/Studio deployment, document upload/publish, real new PDF delivery, or deployment has been performed. Real YouTube playback still requires an editor/content smoke test; automated checks verify click-to-load iframe creation, single-player operation, close/unmount and focus restoration.

## Visual review

The Impeccable finish reviewer returned **ship**, with no material fixes on settled desktop/mobile captures. The scoped detector returned an empty finding list with exit 0. The approved existing-world structure and whole-artwork policy are retained; no visual system replacement was requested.

## Scoped motion review

The subsequent motion pass was reviewed independently against Emil Kowalski's `review-animations` standards. Verdict: **Approve**, no actionable source findings.

| Before | After | Why |
| --- | --- | --- |
| Immediate player removal | Separate open/selected state; iframe stops immediately while the visual shell exits | Maintains continuity and stable metadata without continued playback; reopen cancels stale cleanup. |
| Instant pointer opening/closing | Interruptible 200ms entrance / 150ms exit, opacity plus centered .95 scale, established strong easing | Brief movement without layout animation or keyframe resets. |
| No input/preference distinction | Immediate keyboard/Escape; reduced-motion 150ms opacity-only fade | Keyboard stays responsive; local specificity preserves the reduced fade despite the global reset. |
| No control acknowledgement | 100ms press / 160ms release; fine-pointer hover; stationary keyboard focus | Available controls acknowledge action while whole artwork and pending entries stay steady. |

Chrome lifecycle, interruption, keyboard, preference and mobile checks passed. Desktop/paused-phase/390px captures were inspected. Native held-touch feel and actual video playback remain outside the automated proof; see [validation evidence](gtp-library-validation.md) for the exact touch method and borderline Media performance result.

## Final pre-PR review

The complete staged feature diff against `b041f77` received fresh independent reviews after the floating selector, terminology and Vercel Preview gate changes.

- **Standards:** no documented-standard violations or material Fowler smell findings.
- **Spec:** no missing/incorrect requirements or scope findings; preview samples satisfy the new team-review request without CMS writes.
- **Find-bugs/security:** all changed text/source/scripts/schemas were read in full; no high-confidence vulnerability or correctness findings. Injection, XSS, authentication, authorization/IDOR, CSRF, races, sessions, cryptography, information disclosure, DoS and business logic were checked. Webhook authentication is unchanged. Deployment gates depend only on server configuration, not request input. Tokens remain in CLI scripts; migration guards, parity and raw-reference preservation remain intact.

The reviewer independently ran all nine behavioural groups and the staged whitespace check. Binary captures were outside that source review. Live Vercel settings, actual CMS transactions, hosted Studio deployment, real PDF contents, audiovisual playback and physical touch feel remain separate verification.
