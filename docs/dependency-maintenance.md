# Dependency maintenance

Website and Studio are separate npm projects. Validate both lockfiles before
closing a PR as covered by another update.

## Merge checks

The `Validate website and Studio` workflow runs on pull requests and master:

- Website: clean install with install scripts disabled, lint, library/About
  behavior checks, and production build.
- Studio: separate clean install with install scripts disabled, TypeScript, and
  a production build with auto-updates disabled so the locked Studio is tested.

Configure both `website` and `studio` checks as required in repository branch
protection before relying on automatic merges. A Vercel preview alone does not
validate Studio or lint. Major updates require individual compatibility review.

On 15 November 2026, #183 added the checks and both passed on GitHub. Master
protection now requires `website` and `studio` from GitHub Actions, requires the
branch to be up to date, and applies to administrators too.

Dependabot schedules both `/` and `/studio`. Routine development groups include
only patch/minor changes; major updates remain separate.

## Backlog review, 15 November 2026

- Closed #165: archival record of an already-completed Studio deployment; its
  description explicitly says the workflow does not need merging.
- Closed #150, #154, #155, #156, #157 as exact duplicates of retained #159. All
  six produced the same package-lock Git blob
  `15845f7f913b89d9784db099bca354299fb0626a`.
- Keep #162 separate: unfinished unlimited-sponsor frontend change, not a
  dependency update.
- Candidate overlaps: Nodemailer #67/#175; Next #112/#151; next-sanity
  #68/#80/#134; Studio #65/#133. Do not close based on version ordering alone:
  verify the final tree covers every advisory and dependency in the older PR.
- #70 mixes several major development upgrades. Replace it with reviewed,
  smaller updates before closing it.

The initial master baseline (`165e455`) built successfully for website and Studio
and passed Studio TypeScript. Website lint initially reported 17 errors and 11
warnings; the validation prerequisite repairs the errors without changing the
page design or CMS content. Warnings remain visible.

The initial npm lockfile audit reported 83 affected packages for the website
(1 critical, 34 high) and 32 for Studio (1 critical, 10 high), including development
dependencies. These are package-level advisory counts, not proof that each issue
is exploitable in production. Re-run audits after every update batch; old PR
targets may no longer cover current advisories.

Never run `npm audit fix --force` as a bulk replacement for reviewing major
version changes. Close a superseded PR with a link to the tested replacement.
Local builds, GitHub checks, preview checks, and production verification are
separate evidence; record which have actually run.

## Website security batch

Next.js is pinned at 16.4.6 and the bundle analyzer stays on the same release
line. The existing ESLint configuration and locked React Hooks lint plugin are
retained: upgrading the lint plugin introduced 13 additional rule errors and
belongs in a separate tooling change.

Targeted transitive refreshes stay within existing dependency ranges:

| Existing PR | Covered versions in the replacement |
| --- | --- |
| #151, #112 | Next 16.4.6; sharp 0.35.5; PostCSS 8.5.23 / 8.5.33 |
| #159 (and its five exact duplicates) | Lighthouse 13.6.0; the six obsolete instrumentation packages are removed |
| #172 | Vite 7.3.8 |
| #170 | launch-editor 2.14.2 |
| #160 | Vue / server renderer 3.5.45 |
| #136 | ip-address 10.7.6; express-rate-limit 8.7.4 |
| #116 | nanoid 3.3.20 / 5.1.16 |
| #108 | brace-expansion 1.1.22 / 2.1.8 / 5.0.13 |
| #106 | Undici 6.29.1 / 7.30.2 |
| #72 | ws 7.5.14 / 8.23.0 |

Local clean install, lint (0 errors, 11 existing warnings), production build,
library, About, programme and news behavior checks passed. The npm audit changed
from 83 affected packages to 54 (0 critical, 25 high, 26 moderate, 3 low).
This batch is not a complete remediation of the dependency tree. Remaining
framework/CLI, email and tooling upgrades need separate review. Close covered
PRs only once this replacement has passed GitHub checks and merged.

## Completed batches and remaining queue

- #183 merged: website/Studio validation and baseline lint repairs.
- #201 merged: website security batch, with passing GitHub checks, Vercel preview
  and local desktop/mobile smoke checks. Its production deployment reached READY.
- #202 merged: Studio lockfile refresh and peer correction. The hosted Studio
  still needs its normal deployment procedure; no CMS content was published.
- The workflow maintenance batch updates checkout/setup-node to v7 and pins
  metadata v3.1.0, adds full Studio peer validation, and keeps Studio Node types
  on the Node 24 major line. Close #22/#184/#185/#195 once that batch merges.
- Repository auto-merge is enabled behind the required checks. Historical job
  logs explicitly reported that it had been disabled in repository settings.

Keep the following work tracked rather than discarding unresolved fixes:

| Priority | Work | PRs / next step |
| --- | --- | --- |
| 1 | Email security | #200 targets Nodemailer 10.5.0; #175 targets older 10.1.4. Review breaking changes and confirmation-email behavior, then retire the older proposal. |
| 2 | CMS/CLI security | Coordinate next-sanity #198 with the fixes tracked by #134/#80; coordinate Studio major upgrades #191/#196 with #133/#65. Prove every older advisory is covered before closing those proposals. |
| 3 | Build tools | #190 includes a newer linter and Unlighthouse. The linter update reproduced 13 new rule failures and needs its own code changes. #176's Hono server upgrade also needs parent-tool compatibility review. |
| 4 | Optional major maintenance | Google APIs #197, icons #199 and Studio #187/#188/#189/#192/#193/#194 need individual release/compatibility review. Do not upgrade solely because a higher version exists. |
| Separate feature | Unlimited sponsors | #162 remains a draft with conflicts; preserve it for a frontend feature review. |

The full website dependency listing still reports optional tooling peer issues:
existing TypeScript 6 against TypeScript 5-only optional consumers, and a
Puppeteer browser downloader's optional proxy-agent peer against the older
installed proxy agent. These are not a clean full-tree peer result. Review them
with the tooling batch; website lint/build and tested page flows passed. Studio's
full dependency listing passes and is now checked in CI.
