# GTP CMS investigation — 7 October 2026

## Original investigation snapshot

The original investigation read the production API directly with CDN disabled and backed up the complete Programme and Action Workshops activity-page documents, including image references. The Programme snapshot was last updated at 02:39 UTC (10:39 MYT); the activity page at 01:49 UTC (09:49 MYT). A later authenticated raw read found no Programme draft. The activity-page draft has the same content as its published document, excluding system metadata. The screenshot's Published + Draft badges do not explain these missing rows.

Workshop cards merge two sources:

- `gtp2026Programme.days[].sessions[].workshops[]`: title, date inherited from day, time inherited from session, objective, room and people.
- `gtp2026ProgrammeActivityPage-action-workshops.entries[]` (**Activities** in Studio): artwork and fallback description, matched by normalized title.

Programme slots appear even without an artwork row. Unmatched artwork rows also appear, with time pending and without Programme people. Consequently the artwork list is not the complete card list. Published Programme currently contains 21 workshop slots; the activity page has 19 rows. Seventeen match, producing 23 cards before content corrections.

Current title matching ignores case/punctuation, `Workshop Session:` and simple plurals. It cannot match materially rewritten titles. It also does not compare dates while matching; a matched card takes its date from Programme.

## Complete mismatch list

| Workshop | Published source issue | Correction |
| --- | --- | --- |
| Let’s Cool the Climate through Ecosystem Restoration | Programme Day 2 slot `ad7d00478df8` exists with objective and three people; no activity artwork row | Edit details in Programme → Day 2 → Action Workshops → Workshops / parallel slots. Add an artwork row with the same title and 13 October date when the poster is supplied. |
| The emergency brake: tackling super pollutants to avoid tipping points and benefit public health | Programme Day 3 slot `702a89658787` has a rewritten title; artwork row `action-workshops-13` still says “Action on Super Pollutants – the emergency brake on climate change.” | User confirmed the old title was replaced by the new title for the same workshop. Rename the existing artwork row to the Programme title, preserving its poster. This removes the extra unmatched card. |
| Turning the Tide on Pollution Through Positive Tipping Points | Programme Day 3 slot `9406b17a23f1` exists with objective and six people; no artwork row | The team's latest PIC check confirms this session replaced Mobilising Leadership. Keep this Programme record as the active workshop. Add its approved artwork; do not assume the former session's poster remains accurate. |
| REACH - Advancing Research for Climate and Health in Asia | Programme Day 3 contains workshop slot `24519529148b` and standalone session `696b4f0c831f`. The latter is currently Research sessions, with four people, objective, co-host, venue and button label | User confirmed one standalone **Special event** using shared registration. Change the standalone type to `special`, preserve its other fields, and remove only the duplicate workshop slot. |
| Mobilising Leadership for Healthier and Equitable Societies | Artwork row `action-workshops-17` exists dated 14 October, but no Programme slot exists | Latest team response supersedes the earlier still-running assumption: this workshop was replaced by Turning the Tide on Pollution Through Positive Tipping Points. Do not add a Mobilising Leadership Programme slot. Retire its old card from the active artwork list through a reviewed correction, retaining a backup of the row and poster. Replace or reuse its artwork only after the team verifies that it accurately describes the replacement session. |
| Rethinking Leadership: How to Live on Earth | Programme Day 3 slot `nnQWSTO81w83COfmAOS6TT` matches artwork row `action-workshops-10`, but the artwork row says 13 October | Team confirmed the Programme date: **14 October**. Update only the existing artwork row's `dateLabel` to `14 October 2026`, preserving its title, poster and other fields. The audited public card already takes 14 October from Programme. |

All other current Programme workshop titles have an artwork-row match. Day 2 also has two slots numbered `10` (Wellbeing Societies and Ecosystem Restoration). Confirm the intended number before editing it; no automatic renumbering is proposed.

## Special-event button defect and local correction

The existing `programmeSession.subpageButtonLabel` field is hidden unless type is `concurrent` or `research`. Only `ConcurrentBlock` rendered that label; `SessionCard` and `SessionModal`, which render Special events, did not. Merely unhiding the Studio field would therefore leave the public button missing.

The local correction exposes the existing field for Special events and renders an opt-in button on their card and popup. A populated label links Day 2 to `#day-13`, Day 3 to `#day-14`, and other days to the combined-page introduction. Those sections contain the existing shared registration control, preserving eligibility checking and pending/closed handling. Empty labels show no Special-event button. Existing workshop/research button behavior is unchanged.

The current REACH label is already “Register to Join this Session”. Once both deployments are ready and its CMS type is corrected, that label can be retained. Do not mark a Special event as Research sessions just to expose a button: it changes filtering, hides its people controls and inserts it into the research schedule.

Studio descriptions and the editing guide now explain the split workshop sources. No artwork, title, session, date or classification was changed in production during the investigation.

## Proposed production content patch

For Programme document `gtp2026Programme`, use a fresh read, full backup and revision-guarded patch:

1. Set `days[_key=="nnQWSTO81w83COfmAOS6GV"].sessions[_key=="696b4f0c831f"].type` to `special`.
2. Unset only `days[_key=="nnQWSTO81w83COfmAOS6GV"].sessions[_key=="nnQWSTO81w83COfmAOS6Mz"].workshops[_key=="24519529148b"]`.
3. Retain the standalone session's time, objective, four people, co-host/logo, room, theme, closed-event flag and existing button label.
4. Re-query after the separately approved production write and check REACH once under Special events, its people, and the 14 October shared registration link.

The concrete dry-run payload is `/tmp/gtp-reach-cms-correction-dry-run.json`; it has not been sent to Sanity. Its revision guard deliberately rejects later editor changes, so regenerate it from a fresh backup immediately before any approved write.

The super-pollutants identity/rename and Rethinking Leadership's 14 October date are confirmed. The reviewed artwork-date correction is `entries[_key=="action-workshops-10"].dateLabel` → `14 October 2026` on the Action Workshops activity-page document. Review its published and draft variants together so an older draft cannot restore 13 October later; do not publish unrelated draft changes. The latest PIC check also confirms Mobilising Leadership was replaced by Turning the Tide on Pollution; no missing Mobilising Leadership agenda facts are now required. The remaining artwork check is whether an approved replacement poster exists or the old artwork needs to be retired and replaced. Re-read both published and draft variants; never replace either full array. Do not rerun the Programme import.

## Recommended source consolidation

The public layout already groups by date and separates Action Workshops from Research Sessions. The main Programme uses overview cards that link to the combined detailed page. Category `special` renders separately on the main Programme. The duplication defect comes from independent CMS lists and title-based matching, rather than the shared page URL.

Use the existing Programme workshop slot as the complete editable workshop record. Add its poster/alt fields there, alongside its title, objective, room and people. The parent session/day continues to own time/date. The activity-page document continues to own page copy, hero, partner logos and shared registration, without an independently rendered workshop list.

Migration sequence for a separately authorized implementation:

1. Add optional poster fields to Programme workshop slots and project them in the existing Programme query. Retain old artwork rows during the transition.
2. Produce a reviewed mapping from each existing artwork row to a Programme slot using the slot's stable `_key`. Use title comparison only to propose the initial mapping, never to determine the final identity. The confirmed emergency-brake artwork maps to slot `702a89658787` despite its changed title.
3. Copy original Sanity image references, crop/hotspot/alt data and any required fallback description without replacing editor-populated Programme fields. Back up both published/draft variants and revision-guard every write. Mobilising Leadership is now confirmed replaced: keep the existing Turning the Tide Programme slot and review/retire the former artwork-only row, rather than creating another workshop. Verify any reused poster reflects the replacement's title and people. Account for every unmatched image/row.
4. Make the public workshop list read only Programme concurrent slots, with one card per stable slot id. A missing poster keeps that workshop visible with its existing title/details. Existing research slots and Special-event records remain separate; the approved duplicate REACH slot is removed through its reviewed content correction.
5. Retire/hide the old Action Workshops artwork list from editors after mapping and public coverage are verified. Retain its stored data for recovery instead of deleting the array. Update handbook/schema descriptions to direct all workshop editing to Programme. AI Sessions keep their existing independent Activities list.

This removes the need to rename the same workshop twice and prevents an obsolete artwork title from becoming an extra public workshop. It also keeps poster editing next to the details editors currently cannot find in the artwork list. A stable cross-link between the two existing lists is a smaller transitional alternative, but leaves two places to maintain.

This consolidation is a proposal; the current local repair still preserves unmatched artwork entries, and no source migration has been implemented or deployed.

## Release and validation

Frontend deploy, hosted Studio/schema deploy and published content patches are separate actions requiring their own verification. Current changes are local, uncommitted and undeployed. They do not repair the production records by themselves. Hosted Studio inspection reached sign-in, so field visibility there has not been visually verified.

Validation passed: app and Studio production builds, app and Studio TypeScript checks, changed-file lint and all nine combined-programme behavior checks. Full-repository lint still reports 17 pre-existing errors outside this change. Studio schema files were linted separately using Studio's own configuration.

A temporary local-only preview cloned the published standalone REACH session with type `special`; no CMS data was altered. Browser checks verified its card and popup button, four people, 14 October destination and the destination's current Registration opening soon state. At 390 px the card fit without horizontal overflow and the button label remained visible. Preview screenshots are `/tmp/gtp-reach-special-event-preview.jpg` and `/tmp/gtp-reach-special-event-mobile.jpg`. The temporary preview route was removed afterward; screenshots do not prove production deployment or hosted Studio field visibility.

## Consolidation implementation and latest backup

The implementation now makes Programme slots the complete workshop records, including poster/alt text. The activity page retains copy, hero, partner logos and shared registration. Its legacy artwork array remains stored for recovery but is hidden and no longer rendered. Existing AI Activities remain editable and unchanged.

A fresh authenticated raw backup on 7 October includes both Programme variants and both activity-page variants. Programme was published at 05:03:12 UTC and its draft updated at 05:03:37 UTC, so the migration preserves the newer draft rather than relying on the earlier no-draft observation. No production write has occurred during preparation.

Visual checks confirm `action-workshops-13` already contains the correct Emergency Brake poster, printed 14 October; it transfers to `702a89658787`. Rethinking's image still prints 13 October, despite its confirmed 14 October Programme slot, so it stays archived and that slot uses a title card until corrected art is uploaded. Mobilising's artwork names the replaced workshop and is not reused for Turning the Tide. Ecosystem Restoration and Turning the Tide also use title cards pending approved art.

The offline dry run produces 20 active workshops (10 per day), with 17 posters and 3 title cards. REACH appears once as a standalone Special event with its shared-registration button. All 19 old artwork rows remain stored. The migration uses explicit keyed/asset mapping, preserves image crop/hotspot and existing Programme fields, patches published and draft variants atomically with revisions, and refuses reviewed plans with changed target documents or field values. Its internal marker prevents later reruns from restoring an editor-cleared poster. See the editing guide for release order and rollback.

## Production content migration

Studio/schema deployed successfully to `https://scph.sanity.studio/` with 0 schema validation errors/warnings. The production migration completed on 7 October and re-query matched the exact expected documents. A full original raw backup is retained privately under the gitignored `tmp/gtp-cms-backups/` directory. All 19 artwork rows remain stored. Published Programme now has 20 workshop slots, 17 posters and one standalone REACH Special event. The team published/edited Programme during preparation; stale plans stopped before writing, and the successful run used fresh revision guards while preserving unrelated editor changes. The migration never published an unrelated draft.

Thirteen behaviour checks cover canonical listing identity, Special-event links, preserved research/registration behaviour, migration asset/draft preservation, idempotency and reviewed-field protection. Root/Studio TypeScript, changed-file lint, app/Studio builds, schema validation and desktop/390px popup checks pass. Repository-wide lint retains 17 existing errors outside this changeset. Frontend activation is the remaining release step at the time of this content-migration record.
