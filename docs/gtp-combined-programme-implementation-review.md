# Combined programme: implementation and release review

6 October 2026. Branch: `codex/gtp-combined-programme`. Ameerul authorized committing, pushing to production, deploying Studio/schema and publishing the prepared CMS changes. Studio/schema and the three missing section-copy fields are now deployed/published; the frontend release is in progress. No real registration submission has been made.

## Open the working implementation

- [Published-content preview](http://localhost:3002/events/gtp-2026/programmes/action-workshops): the actual combined route on the current local server, with published workshops and honest pending research/registration states.
- [Interactive review fixture](http://localhost:3002/dev/gtp-programme-review): the same implementation with clearly labelled synthetic research rows, a two-host popup and a local verification stub. Use `eligible@example.invalid` to preview eligibility; other valid emails demonstrate correction. No external form is submitted or participant sheet queried by this fixture.
- [Detailed plan](gtp-team-feedback-plan-2026-10-06.md), [editor/release guide](gtp-combined-programme-editing.md) and [finished design evidence](gtp-combined-programme-design-evidence.md).

These addresses are local to the running computer. The original portable HTML mockup remains in `docs/mockups/gtp-combined-programme/`; it is a design reference, separate from the working application.

## Team comments implemented

| Requirement | Local result | Remaining team dependency |
| --- | --- | --- |
| R-01 Multiple roundtable hosts | Ordered organisation list in Studio and shared popup rendering; legacy single-host behavior preserved; names can appear without logos | Approved organisations/logos/order and whether the change applies on 13 October, 14 October or both |
| R-02 Workshop headline | Separate editable Action Workshops heading above the published description | Approve body copy and intentionally remove its existing “Action Workshops -” prefix in Studio if desired |
| R-03 Research section | Editable research heading/description under the workshops for each date | Final section copy |
| R-04 Research schedule | Published programme → date/time block → hall → ordered presenter/title rows; desktop tables and labelled mobile pairs | Original editable schedule, confirmed rooms/times and source row-count comparison |
| R-05 Registration beside dates | Shared date CTA and workshop-popup verification flow, with open/pending/closed states and server enforcement | Shared HTTPS form, approved eligible in-person participant source/columns and controlled end-to-end test |
| R-06 Combined subpage | Current URL retained; both dates group workshops/research; date jumps, main programme links, metadata and editor map updated | Final team layout approval |

The published-content preview currently contains 23 workshop listings: programme records plus unmatched published activity entries are retained. No research presentations or co-host names were invented for public defaults. A research schedule appears only from published programme records; illustrative static programme fallback rows do not populate the combined schedule.

The participant-email policy now uses explicitly approved columns, defaulting to `EMAIL`, rather than email-shaped text anywhere in a row. Confirm the column policy and in-person eligibility before opening registration. The shared form URL remains server-side until successful eligibility checking. This checks list membership; it does not prove email ownership or book a place.

## Validation evidence

| Check | Result |
| --- | --- |
| App production build | Passed, including TypeScript |
| TypeScript no-emit | Passed |
| Compatibility checks | Eight checks passed: host precedence, venue preservation, research ordering, unmatched workshops, partner-only dates, registration readiness/URL precedence, approved email columns and safe research-import preservation |
| Focused source lint | 31 changed/new source files passed; the subsequent six-file reviewer-fix batch also passed using the installed Studio ESLint 9 runtime |
| Root lint command | Compatible ESLint 9 restores the command. It reports 17 errors and 11 warnings in untouched legacy files; all 35 changed/new root source files pass focused lint. Generated build/audit artifacts and local agent tooling are excluded, without disabling application rules |
| Sanity schema validation | Zero errors and zero warnings |
| Studio build | Passed using the working bundled Node runtime |
| Mobile/desktop UI | Inspected at 390px and 1280px; no page-wide overflow; long research titles remain readable; actual workshop room/calendar/people information preserved |
| Verification dialog | Local ineligible/eligible states, pending form, date context, reset, Escape/focus restoration and nested workshop Escape checked |
| Production fixture guard | Review page renders Not Found, with no fixture content; stub endpoint returns HTTP 404. Next.js streaming can retain HTTP 200 for the Not Found page |
| Production registration API | Pending state returns 503 with no form URL; malformed email returns 400 |
| Combined route mobile Lighthouse | Final release score 80, CLS 0, TBT 39.5ms. The heading now streams independently while programme data loads; earlier release runs were 76–77. Poster requests remain low priority. Local lab result, not field-performance evidence |
| Main programme mobile Lighthouse | Release check score 81, CLS 0, TBT 13.5ms; the earlier 67 is retained as historical evidence. Lab results vary; this is not field evidence |
| New copy seed dry run | Read-only production query succeeded. Proposed only missing `combinedIntro`, `actionWorkshopsTitle`, `researchSessionsTitle`; `agendaChanged: false` |
| Real research import / external form | Not run; approved source and registration details are pending |

The independent finish reviewer requested two scoped visual fixes: darker existing orange for the new registration buttons (white-text contrast 5.32:1), and removal of redundant eyebrow labels from the combined hero and multi-host special-event popup. These were applied without changing global brand tokens or unrelated single-host popup badges. The same reviewer confirmed both fixes resolved, validated all nine replacement captures and returned `ship` for that scored batch. This verdict does not certify the entire surface or authorize production release.

Screenshots are in `.impeccable/review/`: normal first viewports, complete synthetic review page, research tables/pairs, registration dialog and co-host popup. They are review evidence, not new website imagery.

## Workshop people follow-up

Ameerul requested a clearer Facilitators/Speakers layout and explicitly retained profile photos. The workshop popup now gives its roster the full width after the objective, before sharing/registration/hosts. Names lead, smaller roles and muted affiliations follow; entries align at the top. The roster becomes two columns only when its own container reaches the existing 36rem size, otherwise it remains one column. Existing role resolution, order, biographies and supplied photos/alt text are preserved. After Ameerul's clarification, missing photos show the shared empty-user profile icon; ordinary session rosters are unchanged.

The local review page adds clearly labelled photo and unconfirmed-person layout checks. It reuses two existing published conference portraits for display verification only, with no assignment to a real workshop. Both photos loaded on desktop and mobile. Measured roster widths are 720px with two 344px columns at 1280px, 560px in one column at 640px, and 318px in one column at 390px; no overflow. The final production build and three-file focused lint passed. The independent reviewer accepted all five follow-up captures and returned `ship` with no material fixes, scoped to this local roster refinement.

The requested ordered multiple-host list remains available in the local Studio schema for sessions and individual workshops. Existing knowledge-partner logo rows remain below each date's workshop carousel; an individual workshop's host organisations/logos are displayed in its popup. The shared Studio/schema is deployed at https://scph.sanity.studio/; editors can now use the new fields.

## Next approval and release work

1. Team reviews the combined layout, mobile schedule and multiple-host popup.
2. Content owners provide the organisations, original schedule and final section copy. Registration owners confirm the form and eligible attendee source.
3. Prepare exact content diffs and approved schedule row counts. The additive seed/import tools support read-only dry runs, private full backups and revision checks; they refuse unapproved production use.
4. Run a controlled eligibility/form test and resolve the outstanding main programme performance check. Keep registration pending until these pass.
5. Release/content-write authorization was provided on 6 October. Studio/schema and safe section copy are deployed/published and re-queried; complete frontend rollout and live verification. Registration remains pending until its separate operational requirements pass.

Local layout approval does not publish content or activate registration. Work packages W-00/W-03/W-05/W-07/W-08 retain unchecked items where final content, operational testing or release is still outstanding.

## Production CMS verification

The reviewed additive patch published only `combinedIntro`, `actionWorkshopsTitle` and `researchSessionsTitle` on `gtp2026ProgrammeActivityPage-action-workshops`. A full private snapshot with asset references was saved before the guarded write. A fresh published-data query confirmed all other activity fields and drafts unchanged, and the programme revision unchanged. Studio build/deployment and schema deployment both succeeded; `sanity schema list` confirmed the production schema. No research rows, co-host organisations, form URL or registration status were added.

## Frontend release checks

The final production build and changed-file lint pass. The release loading adjustment starts the CMS copy/agenda requests together, paints the unchanged CMS-backed hero as soon as copy is available, and streams the agenda inside a reserved-height Suspense boundary. Published content stays authoritative and both loaded-page composition and workshop logic are unchanged. The latest affected-route mobile Lighthouse checks meet the target: combined page 80 and main programme 81, both CLS 0. Full root lint runs but retains 17 pre-existing errors in untouched files; no application rules were disabled. This is affected-route evidence, not a full-site Unlighthouse certification.
