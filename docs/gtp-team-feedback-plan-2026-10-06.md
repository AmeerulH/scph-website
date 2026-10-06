# GTP team feedback: review and implementation plan

Reviewed and expanded 6 October 2026. Ameerul authorized the production release. The combined layout and follow-up roster changes are implemented. Studio/schema and the three prepared section-copy fields are deployed/published; the frontend rollout is in progress. Final research data, co-host organisations and registration activation remain pending.

This is the working handoff for the team feedback. Use the requirement IDs to track coverage and the work-package checklists to implement after approval. The field/file contracts below are implemented and available in the shared Studio. Existing programme content and image/logo references are preserved.

The working routes, implementation coverage, validation results and remaining release checks are recorded in [Implementation and release review](gtp-combined-programme-implementation-review.md). Checked tasks below mean local implementation is complete; they do not mean the team has approved the layout or that shared content has been published.

- [Requirements](#team-comments-mapped-to-work) and [missing team inputs](#decisions-and-purpose)
- [Page structure](#proposed-page-structure) and [CMS contracts](#cms-field-contracts)
- [Registration flow](#shared-registration-behavior)
- [Implementation work packages](#implementation-work-packages)
- [Validation](#verification-matrix) and [release sequence](#release-sequence-and-recovery)

## Decisions and purpose

Visitors should understand the difference between Action Workshops and Research Sessions, scan the available sessions by date, and reach the correct registration form. This is an extension of the existing GTP interface: retain its teal/orange palette, typography, hero, workshop artwork and popup patterns. The schedule is primarily a **Read** surface; registration is an **Operate** flow.

Confirmed by Ameerul during this review:

- Keep the existing Action Workshop poster cards; add the Research Sessions schedule below them.
- Workshops and research use one shared form, with conference-attendee email verification first.
- Merge workshops and research into one subpage because they run simultaneously.

Content still to obtain from the team:

| Input | Owner | What is needed | Work that depends on it |
| --- | --- | --- | --- |
| I-01 Layout approval | Team, coordinated by Ameerul | Approve the desktop/mobile mockup's date-first grouping, workshop cards, hall tables and shared date CTA | Final page composition; cards/shared verification are already confirmed |
| I-02 Roundtable hosts | Programme/content team | Organisation names, logo files, alt text, display order, and whether they apply on 13 October, 14 October or both | Populate and visually verify the requested co-host block |
| I-03 Research schedule | Research/programme team | Original editable schedule with presenter, presentation title, day, time block, hall/room and row order | Import real research rows and check completeness; Photo 6 is a layout reference, not a sufficient publication source |
| I-04 Section copy | Content team | Workshop headline/body, research headline/body and approval of the simultaneous-session introduction | Publish final copy; simple section headings are safe fallbacks |
| I-05 Shared form | Registration team | Working form URL, confirmation that it covers both activity types and both dates, and whether selection is single or multiple | Activate registration and ensure website copy matches the form |
| I-06 Eligible attendees | Registration team | Correct participant sheet/tab, eligible in-person attendance rules, and approved email columns | Verify eligibility before opening the shared flow |

These inputs have no assumed delivery dates. Schema, mapping and pending states can be prepared without real hosts/research rows. Publication of those details and activation of registration depend on the corresponding inputs.

The team subsequently clarified that these activities are being merged into one subpage because they run simultaneously. The mockup therefore proposes grouping by **date**, with that day's Action Workshop cards followed by that day's Research Sessions schedule. This grouping is a design proposal for team approval; keeping the cards and using shared verified registration are already confirmed.

## Team comments mapped to work

| ID | Comment / photo | Intended result | Current finding | Implementation |
| --- | --- | --- | --- | --- |
| R-01 | 1; Photos 1–3 | More than one organisation under “Hosted By” in the special roundtable popup | Programme defaults and per-session/workshop overrides each represent one organisation | Add an ordered host list and render it in the shared popup host block, retaining existing single-host fallback |
| R-02 | 2; Photo 4 | A headline above the Action Workshops introduction | The entire introduction is one paragraph; “Action Workshops -” is embedded in published description text | Add an editable workshop section heading above the existing introduction |
| R-03 | 3; Photos 4–5 | A separate Research Sessions section beneath the workshops, with heading and description | The page title already includes research, but the page renders only workshop cards | Add an editable research heading/intro and a separate schedule section |
| R-04 | Photos 6–7 | Research schedule follows the reference's date/time/hall/presenter/title structure | No published research sessions were found in the programme document | Store structured presentation rows and render readable web tables grouped by date, time block and hall |
| R-05 | Photo 7 and Ameerul's clarification | “Register here” beside dates; one shared form after attendee verification | Date rows currently have no registration action; popup registration is disabled | One common date header/CTA serves workshops and research for that day; continue to the shared form after verification |
| R-06 | Team's later explanation | Workshops and research belong on one subpage because they run simultaneously | Published title includes both; only workshops are rendered | Keep the current URL and compose both activity types together; implement date-first grouping if I-01 is approved |

The crossed-out sketch does **not** authorise removing the workshop cards: keeping them was explicitly confirmed. The external event page in Photo 1 is a reference for multiple hosts, not a request to copy its full layout, organisations or red registration button.

## Pre-implementation evidence checked

- Inspected the live [Action Workshops page](https://www.sunwayplanetaryhealth.com.my/events/gtp-2026/programmes/action-workshops) and the [Day 2 roundtable popup](https://www.sunwayplanetaryhealth.com.my/events/gtp-2026/programmes?tab=day2).
- Read the public published Sanity documents directly, using the project's configured API and production dataset. This was a read-only query, not a full backup.
- `gtp2026ProgrammeActivityPage-action-workshops`, updated `2026-10-06T07:13:45Z`: title is “Action Workshops and Research Sessions”; 19 activity rows; registration is `comingSoon`, with no URL. Published intro begins “Action Workshops -” and includes the in-person-delegate restriction.
- `gtp2026Programme`, updated `2026-10-06T09:15:57Z`: both 13 and 14 October have 10 programme workshops; no sessions of type `research` were found. Existing research placeholders in code are not a confirmed schedule.
- The roundtable appears on both 13 and 14 October, 14:00–16:00. Neither entry has a custom host name or logo. The 13 October entry is marked closed; the 14 October entry is not. Clarify which entries the team intends to update.
- The live 13 October popup displays “3 mins” beside the two-hour time range. Treat this as a separate editorial check; it is not part of the requested co-host change.
- Registration UI has `ACTION_WORKSHOP_REGISTRATION_AVAILABLE = false`. The existing verification endpoint checks an email against a Google participant sheet and returns `GTP_ACTION_WORKSHOP_FORM_URL`. The deployed configuration, eligible sheet contents and working form were not tested in this planning pass.
- A follow-up source check found that the endpoint locates the `EMAIL` column, then also accepts email-shaped values from every other cell in each row. I-06 must settle whether those additional columns are intended to confer eligibility; do not assume this currently verifies only the primary attendee email.
- The main programme's research branch currently renders slot cards through `concurrent-block.tsx`; it does not render presentation rows. Adding research data therefore also requires a clear route from the main programme to the new detailed schedule.

## Proposed page structure

```text
Existing hero: Action Workshops and Research Sessions

Intro: these activities run simultaneously
Jump to 13 October / 14 October

13 October 2026       [Register here]
Confirmed workshop time / parallel-session notice
Action Workshops                     [editable section heading]
Existing approved workshop description
Existing workshop cards and published knowledge-partner row
Research Sessions                    [editable section heading]
Approved research description
Time · Hall 1
Presenter              Presentation title
...ordered rows...
Time · Hall 2
Presenter              Presentation title
...ordered rows...

14 October 2026       [Register here]
Same workshop-then-research structure for that day's programme

Existing footer
```

Desktop: align date and CTA on one row; retain the workshop carousel controls without crowding the CTA. Identify the displayed 14:00–16:00 range as workshop time until the final research timing is confirmed. When available, put each research hall's time/venue above its table rather than repeating those values on every presentation row. Use real column headings and allow long titles to wrap.

Mobile: put the date above or beside a wrapping CTA, then stack halls. Present each research row as a compact presenter/title pair with explicit labels, avoiding a scaled-down photograph or a five-column table requiring page-wide horizontal scrolling. Preserve order and access to the same information.

Hierarchy: one existing page H1, date H2s, activity H3s and hall H4s. Keep existing `#action-workshops` and `?workshop=` behavior; provide stable research anchors for direct access. The standalone mockup uses `#day-13`/`#day-14` and per-day research anchors; integration must preserve older deep links too.

Keep research tables server-rendered. Reuse a small client boundary for workshop selection/carousel and registration. The page should remain readable before interactive code loads. Date jump links use normal anchors. A research presentation row is informational and must not appear clickable unless it has an approved destination.

Retain all real workshop rows, even where an activity poster has no matching programme slot. Retain matching and unmatched knowledge-partner days. Dates/sections with partial data must not disappear merely because the other activity type is empty. The production page must never inherit the mockup's illustrative row count or subset of workshop cards.

## CMS and data design

### Multiple hosts

Add an optional ordered `hostedByHosts[]` list to sessions and workshops through `studio/schemaTypes/programmeHostedByFields.ts`. Each entry contains organisation name, optional logo with alt text, and optional display subtitle/location. Existing programme-wide defaults remain valid.

- A populated list is the complete host list for that popup; do not silently append SCPH or a parent host.
- Resolve data from programme default through session to workshop. At each level, a populated new list or legacy organisation/logo override replaces the inherited host list; a legacy location-only override preserves the hosts and its existing venue behavior.
- Keep all existing `hostedByName`, `hostedByLogo`, `hostedByLocation` and show-location fields. Do not delete or mass-migrate them.
- Normalize to a heading plus host entries in `src/sanity/gtp-programme.ts`; update the existing host resolver and shared host component.
- Display two hosts beside each other when space permits; wrap or stack additional hosts. Give logos equal visual space, preserve their aspect ratios and keep organisation names readable. A name-only host remains valid.
- Co-host organisation metadata must not change a session's physical venue. Existing workshop venues currently derive from legacy `hostedByLocation`; preserve that path.

### Section copy

Extend `gtp2026ProgrammeActivityPage` for the `action-workshops` page with optional `actionWorkshopsTitle`, `researchSessionsTitle` and `researchSessionsIntro`. Keep the existing `intro` field as the workshop body, with existing published content winning.

Use “Action Workshops” and “Research Sessions” as safe heading fallbacks. Add `combinedIntro` for the confirmed simultaneous-session introduction above the date groups. Do not invent a final research description. Move the existing “Action Workshops -” prefix out of the published body only through an intentional, reviewed content patch; do not globally strip strings at render time.

### Research schedule

Keep agenda facts in `gtp2026Programme`, following the current workshop source of truth. Create confirmed `type: research` sessions under the correct programme days. Each parallel slot represents a hall/track and contains an ordered `presentations[]` array with stable keys, `presenterName` and `presentationTitle`.

- Date/day and overall time come from the programme session; hall comes from the parallel slot.
- Add a dedicated slot `venueLine` field for research halls; retain `hostedByLocation` as a fallback for existing workshop venues. Room names should not have to be entered as a co-host subtitle.
- Use separate presentation objects instead of speaker designations or a pasted text table: a presenter can have a specific paper title, and one hall carries several presentations.
- Derive a research listing from `programme.day2` and `programme.day3`, filtering `type: research`. The existing main programme will read the same research sessions; avoid a second, conflicting schedule on the activity page.
- Preserve presentation order from Studio. Do not infer individual talk timings or split the shared time block unless the final source specifies them.
- Do not require posters, headshots or a popup for research table rows; none were requested.

The proposed model is day → research session/time block → parallel hall slot → ordered presentations. If halls have different time blocks, represent them with the appropriate session blocks rather than forcing one shared time. Group by the explicit day/time metadata, not a title prefix. Use stored `_key` values for new sessions, slots and presentation rows; legacy records continue to work without a mass key migration.

## CMS field contracts

All new fields are optional so the existing published documents remain valid. Register any new named object types in `studio/schemaTypes/index.ts`. Studio descriptions must explain where each field appears and that publishing controls the live page.

| Location | Field / structure | Frontend behavior | Population / validation |
| --- | --- | --- | --- |
| Activity page, action-workshops only | `combinedIntro` (new optional text) | Intro above the day groups explaining simultaneous activities | Seed only the team-confirmed simultaneous-session fact; longer draft copy needs I-04 |
| Same document | `actionWorkshopsTitle` (new optional string) | Workshop heading within each day | Fallback “Action Workshops”; do not require a content migration |
| Same document | `intro` (existing text) | Workshop description | Published body remains authoritative; intentional copy edit removes the old heading prefix |
| Same document | `researchSessionsTitle` (new optional string) | Research heading within each day | Fallback “Research Sessions” |
| Same document | `researchSessionsIntro` (new optional text) | Research description within each day | Empty until approved; no sample research claims in seed defaults |
| Programme session/workshop | `hostedByHosts[]` (new ordered array) | Complete popup host list at that override level | Each row needs a nonblank organisation name; logo optional; alt required for an uploaded logo; optional subtitle |
| Parallel slot | `venueLine` (new optional string) | Room label for research; also usable by workshops | Explicit slot venue → legacy `hostedByLocation` → parent venue; co-host metadata does not set the room |
| Research parallel slot | `presentations[]` (new ordered array) | Presenter/title rows in the hall table | Stable `_key`, nonblank `presenterName` and `presentationTitle`; fields remain optional on existing workshop slots |
| Activity page | `registrationStatus` (existing) | Shared comingSoon/open/closed state for both dates/activity types | Open only after I-05/I-06 and working-flow validation; no new per-day state unless the team requests it |
| Activity page | `registrationUrl` (existing) | Recommended primary shared form URL, returned by the server after eligibility | Valid external HTTPS URL; use existing environment URL as a compatibility fallback, with CMS precedence documented |
| Activity page | `registrationLabel` (existing) | Approved label for the open action | Set to “Register here” in the reviewed content patch; pending/closed states retain explicit state text |

The registration URL recommendation resolves the current mismatch between Studio's “Registration URL” description and the workshop component. If accepted during implementation, the page and API must use one server-side resolver: CMS URL first, then the legacy environment fallback. Do not make the date CTA bypass verification by linking directly to the CMS URL.

### Host compatibility rules

| Data at an override level | Result |
| --- | --- |
| No valid new list, no legacy override | Inherit the existing host block |
| Valid nonempty `hostedByHosts[]` | Replace the inherited host list completely, preserving editor order |
| New list plus legacy name/logo | New list takes precedence; keep legacy fields stored for compatibility |
| Missing/empty new list plus legacy name or logo | Keep the current single-host replacement behavior, including its name/logo fallback rules |
| Legacy location-only override | Preserve hosts; apply existing subtitle/visibility behavior and room fallback |
| Host row without a logo | Render the name cleanly; do not require a fabricated mark |
| Legacy visibility flag without a location | Preserve the current resolver behavior rather than silently changing old popups |

For a new host list, each row owns its optional subtitle. A legacy room/location field must not be copied onto every co-host row. The existing visibility flag can suppress the new list's subtitles while the map-pin venue remains governed by venue fields.

## Shared registration behavior

Reuse `ActionWorkshopRegistration` and `/api/gtp/action-workshops/verify` rather than creating a second research-verification API. Make the component's button label, context copy and available/closed state reusable. In the proposed date grouping, one date action covers both workshops and research.

The selected date/section may be shown in the verification dialog, but all entry points use the confirmed shared form. Do not invent external form-prefill query parameters; add them only if the form supports them and the team wants preselection.

Required states:

- **Pending:** clear “Registration opening soon” messaging while the form/configuration is unavailable.
- **Open:** enter conference-registration email → eligibility check → continue to the shared form.
- **Not eligible:** inline message and a way to correct the email.
- **Loading/failure/rate limit:** clear feedback, prevent duplicate submission, allow an appropriate retry.
- **Closed:** explicit closed state; no active date or popup CTA.
- **Verified but form missing:** explain pending availability; do not show a broken link.

Remove the hardcoded availability switch only when readiness is backed by configuration and the approved state. For workshops, current CMS registration status/URL do not control this component; connect status deliberately rather than assuming an editor can already activate it by publishing a URL.

Keep verification as the existing participant-email eligibility check. This does not establish ownership of an email address or impose access control on the external form; those would be separate requirements. Confirm that the eligible participant source matches the approved in-person restriction before activation.

Keep the existing POST `{ email }` API contract and its success/error response structure. Check the effective registration status on the server as well as in the UI. A closed/pending flow must not return the shared form URL. Share the readiness/status resolver with the page so a deployment cannot expose active buttons while the API considers registration closed.

Readiness means an approved status, a usable form URL, and participant-sheet/service-account configuration. Configuration alone does not prove that the sheet is accessible or the external form works; those need a controlled eligibility test before opening. Keep credentials and sheet contents server-side; pass only the effective state/context into client UI.

Review the current all-cells email extraction against I-06. If only the attendee `EMAIL` column qualifies, narrow extraction to it. If secondary attendee-email columns qualify, enumerate those approved columns explicitly. Test the approved policy with a primary email, an approved secondary email if applicable, and an unrelated email in another cell. Retain current email normalization and rate-limit handling; the existing attempt counter is per server process, so do not describe it as a shared deployment-wide limit.

Opening a date CTA follows: select date → enter conference-registration email → loading → eligibility result → Continue to registration form. Preserve the selected date as local context. Do not promise a booked seat after eligibility; booking/selection happens in the external shared form. Closing clears the input/result and returns focus to the trigger; a late verification response after close must not reopen or overwrite a new dialog session.

The existing custom verification overlay needs keyboard focus handling, Escape/close behavior, focus restoration and unique form IDs when reused from several date buttons. It can use the installed Radix Dialog capability or an existing project modal pattern; there is no local `ui/dialog` component to assume.

## Implementation work packages

Owner roles below are responsibilities, not assignments to named people or agents. Ameerul coordinates approval/release; the developer owns code and validation; content owners provide and approve source material. Unchecked items are planned work, not work already completed.

### W-00: Approval and implementation baseline

Owner: Ameerul + team. Covers R-01–R-06. Dependency: I-01 for final composition.

- [x] Review the seven photos and record the clarified requests.
- [x] Investigate current code, published content and the live page.
- [x] Produce desktop/mobile mockups and a portable interactive reference.
- [ ] Record layout approval or the team's specific corrections.
- [ ] Collect I-02–I-06, marking any unavailable material pending rather than inventing it.
- [x] Re-checked Git status, created `codex/gtp-combined-programme`, and saved a fresh published-data snapshot with asset references before coding.
- [ ] Save the approved desktop/mobile references beside the implementation handoff so later changes can be reviewed against one composition.

Completion proof: approved layout reference, content-input status and a current baseline. Ameerul authorized implementing the selected plan locally for approval. Production release and the prepared safe-copy write were authorized on 6 October. Missing programme facts and registration activation remain separate inputs.

### W-01: Additive Studio schema and frontend contracts

Owner: developer. Covers R-01–R-06. Dependency: W-00; can proceed with pending content.

- [x] Extend `studio/schemaTypes/programmeHostedByFields.ts` with the ordered list, reusing it for both sessions and slots.
- [x] Add a presentation object and register it in `studio/schemaTypes/index.ts`; extend `programmeWorkshopType.ts` with `venueLine` and optional presentations.
- [x] Extend `gtp2026ProgrammeActivityPageType.ts` with the combined intro and section-copy fields, shown only for action-workshops.
- [x] Clarify the existing registration field help text for the verified shared flow.
- [x] Extend `src/components/gtp/programmes/types.ts` and `src/data/gtp-programme-activity-defaults.ts` honestly at null/undefined boundaries.
- [x] Update the fallback combined page title and safe headings without replacing published copy or other activity-page defaults.

Completion proof: Studio builds, existing documents still validate, and editors can see the new fields without losing legacy ones.

### W-02: Queries, normalization and day-group mapping

Owner: developer. Covers R-01, R-03, R-04, R-06. Dependency: W-01.

- [x] Extend `src/sanity/gtp-programme.ts` projections and mappers for ordered hosts, slot venue and presentations; carry new stable keys through the normalized data.
- [x] Extend `src/sanity/gtp-stage2.ts` query/merge for section copy. Published nonblank content wins; missing fields use safe fallbacks.
- [x] Add `research-session-listing.ts` beside the existing workshop-list builder, deriving confirmed research sessions only from Day 2/3 programme records.
- [x] Build day groups from programme day IDs and the existing workshop listing; retain unmatched activity entries/partner days and multiple time blocks.
- [x] Keep `action-workshop-listing.ts` title matching, people merging, objective fallback and unmatched-row preservation intact.
- [x] Ensure absent research data produces pending/empty data, never illustrative or static research rows presented as confirmed.

Completion proof: mapping fixtures cover legacy hosts, ordered host lists, both research days, multiple halls/time blocks, incomplete records and existing workshop mismatches.

### W-03: Multiple-host popup rendering

Owner: developer; content team supplies I-02. Covers R-01. Dependency: W-02.

- [x] Update `resolve-hosted-by.ts` using the compatibility table above.
- [x] Update `ProgrammeModalHostedByBlock` in `programme-modal-chrome.tsx` to render an ordered collection under one heading.
- [x] Audit its consumers in `session-modal.tsx`, `workshop-modal.tsx`, `day-agenda.tsx`, the carousel/page props and the `src/sanity/queries.ts` re-export boundary.
- [ ] Check one, two and several hosts, name-only hosts, wide/tall logos and a narrow popup. Keep logo aspect ratio and comparable visual space.
- [x] Verify that the venue next to the map pin remains correct when host lists change.
- [ ] Populate only the confirmed roundtable date(s); retain closed-event status and other session facts.

Completion proof: the targeted roundtable shows all approved hosts in order; a legacy popup and workshop location remain correct.

### W-04: Combined page composition and research tables

Owner: developer. Covers R-02, R-03, R-04, R-06. Dependency: W-02 and approved I-01; copy can remain pending in preview.

- [x] Add `research-sessions-schedule.tsx` with semantic table headings/captions on desktop and labelled presenter/title pairs on mobile.
- [x] Compose approved date groups in `programme-activity-page.tsx`, scoped to action-workshops; retain other programme activity layouts.
- [x] Adapt `action-workshops-carousel.tsx` to render one day's cards within the new group, with one shared selection/deep-link owner so several carousels do not open duplicate modals for one `?workshop=`.
- [x] Preserve full card titles through accessible names and popups when the compact text fallback is clamped. Maintain equal card heights.
- [x] Retain knowledge-partner rows under their workshop day and keep unmatched rows visible.
- [x] Wire the research listing and shared effective registration state in `src/app/events/gtp-2026/programmes/action-workshops/page.tsx`.
- [x] Keep `#action-workshops` working; add stable day/research anchors and avoid duplicate IDs when headings repeat across dates.
- [x] Support no research rows, one populated day, a missing hall, and long titles without creating fake rows or page-wide horizontal overflow.

Completion proof: the actual page matches the approved desktop/mobile composition using full existing workshop data and real or explicitly pending research data.

### W-05: Shared registration flow and readiness

Owner: developer + registration team. Covers R-05. Dependency: W-01/W-02 for state; I-05/I-06 and controlled testing for activation.

- [x] Generalize `action-workshop-registration.tsx` for date context, shared activity copy, “Register here” label and comingSoon/open/closed behavior.
- [x] Reuse one dialog/state owner for the combined page or use unique IDs for independently mounted instances; apply keyboard focus, Escape and restoration behavior.
- [x] Add one server-side state/URL resolver used by the page and `/api/gtp/action-workshops/verify`; honor published status and the agreed CMS/environment precedence.
- [x] Preserve existing workshop redirect/query links and ensure popup/date entry points use the same shared flow.
- [ ] Confirm and implement the approved sheet-email-column policy; preserve normalization and the existing API contract.
- [ ] Handle malformed email, ineligible attendee, rate limit, inaccessible sheet, missing form, network failure and late responses cleanly.
- [ ] Validate the external form includes both dates and both activity types using a controlled test; website eligibility success must not be presented as completed booking.
- [x] Leave production registration pending until its readiness checks and content approval pass.

Completion proof: both date CTAs and workshop popup actions reach the same eligible-attendee flow and form; pending/closed configuration yields no active bypass link.

### W-06: Main programme, metadata and editor documentation

Owner: developer. Covers R-04/R-06 and release consistency. Dependency: W-04/W-05.

- [x] Update the main programme research branch in `concurrent-block.tsx` with a link to the correct day/research anchor. Retain existing legacy research slot behavior; presentation rows need not be duplicated in its popup.
- [ ] Check `day-agenda.tsx`/`session-modal.tsx` so newly published research sessions remain visible under the Research filter and links reach the detailed schedule.
- [x] Update the combined route's metadata/Open Graph text. Audit programme navigation/footer labels and update only labels that still imply the page contains workshops alone.
- [x] Keep the existing URL/canonical; no new indexed route is needed.
- [x] Add the combined path to the `gtp2026Programme` webhook map in `src/app/api/revalidate/sanity/route.ts`; retain force-dynamic behavior.
- [x] Update `team-handbook-gtp.tsx` to map the route to both `gtp2026Programme` and `gtp2026ProgrammeActivityPage`, explaining copy/poster versus agenda ownership.
- [x] Update README's field/seed/revalidation instructions and AGENTS.md's inventory if a script is added.

Completion proof: main programme and combined page agree on research facts; editors know which document to publish for every visible field.

### W-07: Additive content preparation and import

Owner: developer prepares; content owners approve/publish. Covers R-01–R-06. Dependency: W-01 and the corresponding team inputs.

- [x] Add a documented seed/patch path for new fields. The existing `seed-gtp-programme-subpages.ts` creates missing documents only; it will not initialize fields on this existing document.
- [x] Use fixed singleton IDs and `setIfMissing` for safe new headings/intro facts. Keep research and host arrays empty unless approved real source material is supplied.
- [ ] Prepare a separate input file for the approved research schedule, with day/time/hall grouping and stable row keys. Check source row counts per day/hall and preserve ordering, spelling and titles.
- [ ] Patch only the new research sessions/targeted host fields and specifically approved copy edits. Do not rerun the broad programme import to replace the full editor-owned agenda.
- [x] Support a read-only dry run showing target document IDs, field paths, row counts and the proposed diff before writes.
- [x] Refuse production unless the chosen script has an explicit production guard and Ameerul has authorized the exact write; preserve the existing test-only seed's refusal.
- [ ] Apply to the test dataset or preview fixtures first; verify unrelated sessions, workshop arrays, logos, people and draft documents remain intact.

Completion proof: reviewed input/diff plus row-count comparison; no sample presenters or mockup facts enter production defaults.

### W-08: Review, validation and release

Owner: developer produces evidence; Ameerul/team approves final release. Dependency: W-03–W-07.

- [ ] Run the verification matrix below and the required project/Studio checks.
- [x] Capture desktop/mobile together, fix material issues in one batch, then make at most one confirmation pass. Both scored fixes were resolved; the reviewer returned `ship` for that batch.
- [x] Present the concrete preview, safe content diff and pending registration state; Ameerul authorized the production release on 6 October.
- [ ] Follow the separate frontend, schema/Studio and content-publish steps below; verify each outcome independently.
- [x] Deliver the local field/publishing handoff and record intentionally pending content in `gtp-combined-programme-editing.md` and `gtp-combined-programme-implementation-review.md`. Live handover remains part of release verification.

Completion proof: approved preview, passing checks, published-data re-query and live visual/controlled-flow verification. A local preview alone does not complete this package.

### Milestones and dependencies

| Milestone | Includes | Exit condition |
| --- | --- | --- |
| M-0 Ready to implement | W-00 | Mockup approved; unknown content explicitly tracked |
| M-1 Data contracts ready | W-01/W-02 | Legacy content preserved; new fields map correctly |
| M-2 Reviewable frontend | W-03/W-04/W-06 | Real workshops and pending/confirmed research render in the approved layout |
| M-3 Content and registration ready | W-05/W-07 | Approved source material mapped; shared eligibility/form flow tested |
| M-4 Released and handed over | W-08 | Separate deployments/publishing verified on the live site |

Co-host rendering can be reviewed independently of research/form readiness. A pending-content preview is reviewable, but it must not be reported as a complete research-schedule or registration release. Final estimates should be made after source schedule complexity and form readiness are known.

## Acceptance and release checks

- Match every requirement R-01–R-06, including the date CTA and combined-subpage follow-ups.
- Check a legacy default host, a legacy custom host, a location-only override, and multiple hosts on sessions/workshops. Preserve room text and host precedence.
- Confirm workshops remain unchanged apart from heading/date actions; preserve unmatched published activity rows, posters, people and deep links.
- Check both research dates, multiple halls, long titles, Studio reordering and empty/partial schedules. Empty data must never render invented programme rows.
- Confirm all date buttons and workshop-popup buttons reach the same verification flow and shared form; test open/pending/closed and failed verification states using controlled test data.
- Run the project lint/TypeScript checks, Studio schema validation/build and `npm run build`. Inspect desktop and mobile together; address the findings in one batch and make at most one confirmation pass.
- Spot-check affected route performance against the repository's mobile Performance ≥80 target. Broaden to Unlighthouse only if implementation affects many routes.
- Before any production content write, take a full backup including asset references, compare a dry-run patch, and obtain the explicit production-write approval required by the Sanity workflow. Deploying schema/Studio and publishing documents are separate release steps.
- Re-query published data and inspect the live page after release. Local behavior and synthetic UI checks have been performed. Studio/schema and the reviewed additive copy patch are deployed/published and re-queried; the frontend release is in progress. No real registration submission has happened.

## Verification matrix

These are implementation acceptance cases. The mockup's desktop/mobile visual checks are complete, but the cases below are not production verification results.

| Check | Case | Expected proof |
| --- | --- | --- |
| V-01 Hosts | Programme default; legacy custom host; location-only override; new list; list plus legacy values | Exact precedence from the compatibility table; targeted and legacy popup screenshots |
| V-02 Host layout | One/two/several hosts; missing logo; long names; wide and tall logos | Ordered readable names, uncropped logos, stable popup width on phone/desktop |
| V-03 Venue preservation | New host list on a workshop with a legacy room; explicit slot venue | Map-pin room follows explicit slot → legacy location → parent; host subtitle changes do not move the session |
| V-04 Workshop preservation | Full Day 2/3 listing, unmatched poster entry, missing poster, legacy people roles, partner-only day | Existing items/people/partners remain; no artwork or session silently disappears |
| V-05 Research mapping | Both dates; two halls; more than one time block; reordered rows | Table/day/hall counts equal the approved source; Studio order is reflected on the page |
| V-06 Partial research | No research sessions; one empty day; no presentations in a hall; missing venue | Honest pending state, no fabricated presenters/timing, populated sections remain visible |
| V-07 Content precedence | Existing CMS title/intro; new field omitted; new field published; draft-only edit | Published text wins, safe fallback fills missing fields, drafts do not appear publicly |
| V-08 Links and discovery | Old `#action-workshops`; `?workshop=`; new day/research anchor; programme research filter/link | Correct target/date; one workshop popup; matching Research sessions remain discoverable |
| V-09 Registration state | comingSoon/closed with a configured URL; open with missing configuration; CMS URL plus different env URL | Inactive pending/closed UI/API; no form link on failure; one documented URL precedence |
| V-10 Eligibility | Whitespace/case variants; approved column(s); unrelated email in another cell; invalid/ineligible email | Normalized approved emails qualify; unrelated cells do not qualify under a primary/allowlisted-column policy; existing 400/403 feedback is handled |
| V-11 API failures | Malformed request; rate limit; sheet access/header failure; missing form | Clear inline feedback; existing error response shape handled; no false booking/success link |
| V-12 Dialog behavior | Keyboard-only use; Escape; close while checking; reopen from other date; repeated submit | Focus contained/restored, one active flow, input/result reset, no stale response or duplicate submission |
| V-13 Shared form | Both date CTAs and workshop popup; controlled eligible test | Same verified form destination; it offers both activity types/dates; eligibility is distinct from booking |
| V-14 Responsive/readability | 390px mobile and 1280px desktop references; narrower/wider content; long titles; text zoom | No page-wide overflow, complete accessible titles, labelled mobile pairs, equal card heights |
| V-15 Main programme/other pages | Research records added; legacy slot cards; AI Sessions/Film/Sensorial pages | Main programme facts/links agree with the combined page; other activity-page layouts retain current behavior |
| V-16 Release freshness | Schema/Studio deploy; final content publish; public re-query; live route | Independently verified schema availability, published content and live rendering |

Automate the meaningful data/behavior cases: host resolution, research grouping/order, preservation of unmatched workshop entries, registration readiness/URL precedence and approved email-column extraction. Use isolated fixtures or mocked participant-sheet responses for those tests. Visual layout, keyboard behavior and the external shared form need browser/manual checks. Choose the existing test tooling if present; do not add a large test stack for this feature.

Required project checks after implementation:

- Root `npm run lint`, TypeScript no-emit validation using the installed TypeScript compiler, and `npm run build`. There is currently no root `typecheck` npm script; do not claim `npm run typecheck` was run.
- Studio schema validation using its installed CLI, followed by `npm run build` from `studio/`. Resolve the local CLI command before running it rather than assuming a custom npm validation script exists.
- One batched desktop/mobile visual pass against the approved mockup, one batch of fixes, and at most one confirmation pass.
- Focused mobile Lighthouse checks for the combined page and the main programme; the repository target is Performance ≥80. Run the broader Unlighthouse scan if the shared changes affect many routes.

Record the command/result, tested URL/dataset and any remaining failure. Baseline failures must be identified separately from regressions; a successful build does not prove the external eligibility/form flow.

## Release sequence and recovery

1. **Complete the reviewable preview.** Finish frontend/data changes using a test dataset or local fixtures. Show the actual implementation with the full workshop list, empty/confirmed research states, a multi-host popup and registration states. Obtain the layout/content corrections before preparing the final release.
2. **Prepare content and configuration.** Confirm I-02–I-06. Back up the full relevant production documents and asset references, including published/draft variants where present. Prepare field-level patches and the approved research source/diff. Check the current `_rev` against the backup before a write; if another editor changes the document, regenerate/review the patch instead of overwriting their work.
3. **Approve concrete release actions.** Present frontend preview, exact production document/field changes, row counts, schema/Studio changes and registration readiness. The production CMS-write confirmation required by the project's Sanity workflow applies at this stage. Code deployment, schema/Studio deployment and document publication are distinct actions.
4. **Deploy the compatible frontend.** New fields are optional and old content still renders. Keep the effective registration status pending while configuration/content are incomplete. Verify the deployed route before publishing new facts.
5. **Deploy schema and Studio.** Deploy against the intended dataset and verify editors can access the new fields. Schema deployment alone does not create research rows, upload approved logos or publish documents.
6. **Apply/publish approved content.** Apply only the reviewed field-level changes. Use draft review and explicit Studio publishing where appropriate; writing a published document directly is an immediate public-content change and requires the same explicit authorization. Verify research source counts and host order again. No placeholder mockup rows are included.
7. **Activate registration after its controlled check.** Confirm sheet access, approved email policy and the form. Set the reviewed open state/button label only when ready. If research content is approved but registration is not ready, publish the content with explicit pending registration.
8. **Verify and hand over.** Re-query the published documents, inspect the live page/popups, check main-programme links and perform one approved controlled registration-flow check. Hand editors the route/document map and the exact publishing instructions. State separately what is deployed, published, pending or unverified.

Recovery should remain narrow:

- A frontend regression can be addressed by returning to the previous known-good deployment while preserving additive CMS fields.
- A wrong content import should be corrected from the saved field-level before-values, using a fresh revision check so unrelated later editor changes survive. Do not restore the entire programme blindly.
- Registration can be returned to comingSoon/closed and the server must stop returning the form URL. Content display need not be rolled back to pause registration.
- Keep the new optional schema fields during recovery unless a specific incompatibility requires removal; older frontend versions should ignore them.

## Completion definition

The requested work is complete when R-01–R-06 are implemented, the approved real content is published, existing workshop/host behavior is preserved, the shared eligibility/form flow is verified, the required checks pass, and the team has accurate editing/publishing instructions. If content or registration is intentionally pending, record the outstanding input and call that a partial release rather than marking the entire plan complete.

## Local follow-up: workshop people display

After reviewing the working preview on 6 October 2026, Ameerul requested a clearer Facilitators/Speakers layout and explicitly retained profile photos. Implemented locally: full-width roster after the objective, one or two columns according to the roster's own width, top-aligned supplied portraits, names first, smaller roles and readable muted affiliations. Existing names, roles, ordering, deduplication and image alt text remain intact. No CMS facts were changed. Desktop, 640px intermediate and 390px mobile checks, real-photo and unconfirmed-person fixtures, focused lint and production build passed. The scoped finish reviewer returned `ship` with no material fixes; Ameerul authorized its production release; Studio/schema and the safe copy patch are complete, with the frontend rollout in progress.

Ameerul subsequently clarified that a named person without a photo must retain an empty-user profile icon. Restored the shared avatar fallback while preserving real portraits and the wider roster. The six-person narrative workshop shows six placeholders on desktop and mobile, with no overflow; focused lint passed. Earlier text-only roster screenshots are historical.

The host/logo follow-up was verified: editors can add/reorder multiple hosts on sessions and workshops after the new schema is deployed. Knowledge-partner logo rows are preserved beneath each date's workshop cards, while individual workshop host logos render in the popup.

## Concise clarification to send to the team

> We’ll keep the Action Workshop cards and add a separate Research Sessions schedule underneath, with a Register here button beside each date. Both will use the same form after checking the attendee’s registration email. Please confirm the roundtable co-host names and send the logos in display order, the original research schedule with final names, titles, dates, times and halls, the section headline and description, and the shared registration link. The roundtable is listed on both 13 and 14 October, so please also confirm which date or dates need the co-hosts.

This is a draft for Ameerul to use; it has not been sent.

## Mockup for approval

- [Portable interactive HTML](mockups/gtp-combined-programme/index.html): self-contained, opens offline, uses current GTP imagery/fonts. Date links and carousels work; Register here opens a local explanatory preview, without collecting or submitting data.
- [Desktop image](mockups/gtp-combined-programme/desktop.jpg) and [mobile image](mockups/gtp-combined-programme/mobile.jpg): suitable for sharing with the team.
- Workshop cards show a subset of existing published artwork/titles as layout references. Research tables are explicitly illustrative. Final research names, titles, hall labels, row counts and section copy must come from the team.
- Review the proposed day grouping and hierarchy, not placeholder schedule details. Once approved, carry this composition into the real Next.js/Sanity page with the data and release work above.

## Production release checkpoint

Ameerul explicitly authorized code commit/push, production rollout, Studio/schema deployment and the prepared CMS changes on 6 October. Studio/schema deployed successfully to https://scph.sanity.studio/. The guarded safe-copy seed published only the three missing combined-page introduction/headings, with a private full backup and post-write preservation check. Final app build, changed-file lint and all eight compatibility checks pass; affected-route mobile Lighthouse scores are 80 (combined) and 81 (main programme), with CLS 0. Full root lint retains 17 existing errors outside the changed source. Frontend push/live verification follows. Missing real research rows, additional hosts, final research copy and form/eligibility operational approval remain open; registration is pending.
