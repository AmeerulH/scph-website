# CMS rollout prepared for approval

Preflight: 19 October 2026, project `y0tkemxm`, dataset `production`. No CMS writes or deployments have been performed for this feature. The published Media document was exported with raw asset references to a restricted OS-temporary backup. It has two existing videos, no Media draft and no active individual-video cutover. No new resource/video documents currently exist.

## Proposed first step

Deploy the additive schema and hosted Studio, then run the two reviewed seeds with production approval. Schema validation reported 0 errors / 0 warnings and Studio's local build passed. Schema deployment and content writes are separate operations.

| Operation | Documents or fields |
| --- | --- |
| Create Resources page settings | `gtp2026ResourcesPage` |
| Create three pending resource entries | Faith Based Toolkit (Summary booklet + Full toolkit), KL Tipping Points Declaration, Outcome Report for Potsdam Handover |
| Create four pending Daily Highlights | Days 1–4, without YouTube links |
| Add missing Media wording | Collection headings/introductions and empty/pending messages; eight currently missing fields |

This creates eight missing documents and patches only missing fields on the existing Media singleton. It uploads no PDFs, images or videos; it invents no report contents. The two existing video entries, raw images, introduction and channel URL remain intact. The seeds never enable `useVideoLibrary`.

The existing production website continues reading its current fields. The PR preview can show the new Resources entries after seeding, while labelled synthetic review layouts are available independently of Sanity. Schema/Studio deployment does not merge or deploy the website PR. Real files still require approved documents from the team and publishing/content verification.

## Separate video cutover

The reviewed migration dry run currently produces two deterministic playlist documents, retaining every original video field/image reference and the original Media array. Applying it enables the new library atomically. It remains a separate approved step; until then, the current video array stays authoritative and newly authored individual video documents are not shown on the website.

Run a fresh migration dry run **after** any Media seed or editor change: those change the source revision and invalidate the earlier reviewed plan. Require parity, absence of conflicting drafts, the exact plan and revision guards before APPLY. Check both preserved videos and a new entry on the PR preview; production uses the new workflow only after the website PR is released.

## Commands after approval

Use the native Node runtime and the documented dataset/token configuration. Do not run these write commands without the corresponding approval.

```sh
cd studio
SANITY_DATASET=production npx sanity schema deploy
SANITY_DATASET=production npm run deploy -- -y --schema-required
cd ..
APPLY=1 ALLOW_PRODUCTION=1 SANITY_DATASET=production npm run seed-gtp-resources-page
APPLY=1 ALLOW_PRODUCTION=1 SANITY_DATASET=production npm run seed-gtp-video-library
```

Re-export immediately before writes, preserve draft/editor content, verify exact readback after each operation and reload Studio/public preview routes. Schema/Studio validation success alone is not content or live-page verification. Video migration is intentionally absent from this first-step command list.
