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
