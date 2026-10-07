# Editing Action Workshops and Research Sessions

The combined public page keeps `/events/gtp-2026/programmes/action-workshops`. These instructions describe the new local implementation. Deploy the updated frontend and Studio/schema before using the new fields on the shared dataset. Publishing changes public content; a local preview does not publish anything.

## Where each item is edited

| Visible item | Sanity document / field |
| --- | --- |
| Page title, hero image/lede, simultaneous-session introduction | Action Workshops activity page: Page title, Hero banner image, Hero lede, Combined page introduction |
| Workshop heading/description | Same activity page: Action Workshops heading, Description |
| Workshop title, poster/alt, objective, people, room | GTP 2026 Programme: correct day → Action Workshops → Workshops / parallel slots |
| Workshop date/time | Programme: parent day/session |
| Knowledge-partner logos | Activity page: Knowledge partner logos, matched to the date |
| Research heading/introduction | Activity page: Research Sessions heading/description |
| Research date/time/hall/presenter/title | GTP 2026 Programme: correct day → Research sessions type → parallel hall slot → Research presentations |
| Roundtable co-hosts | Programme: correct roundtable session → Hosted by — organisations |
| Shared registration status/label/URL | Activity page: Registration status/button label/URL; participant access also requires server configuration |

Publish the document that owns the fact. Workshop details and artwork now share one Programme slot. The activity document owns page copy, partners and registration. Published values override fallback headings. The current activity description starts with “Action Workshops -”; remove that prefix through an intentional copy edit once the team approves the separate heading/body, rather than changing defaults and expecting published content to follow.

Edit every Action Workshop in **Programme → day → Action Workshops → Workshops / parallel slots**. Upload **Workshop poster** with alt text on that same slot. Publish Programme to update both its card and popup. Clearing the poster produces a title card; old artwork cannot reappear as a fallback. Renaming a slot keeps its identity and does not create another card. Move it to the correct day/session to change its date/time. Do not duplicate a workshop in Research Sessions or Special events.

Legacy Action Workshop **Activities** rows remain in the dataset for recovery and are hidden in Studio. They no longer generate cards. Artificial Intelligence Sessions still use their own Activities list. See the [7 October source audit](gtp-cms-issues-2026-10-07.md) for confirmed replacements and pending posters.

**Special-event registration buttons:** Keep the session type **Special event**. Populate **Subpage button text** to show the same link on its programme card and popup. Day 2 links to the 13 October date section; Day 3 links to 14 October, where the existing shared registration control handles eligibility and pending/closed status. Other days link to the combined page introduction. An empty label hides the button. This requires the updated frontend and Studio/schema to be deployed; publishing a label alone does not open registration. Do not reclassify a Special event as Research sessions to expose this field.

## Add co-hosts

1. Find the correct roundtable date. It exists on both 13 and 14 October; the team must confirm which entries receive the hosts.
2. Under **Hosted by — organisations**, add one entry per organisation, in the approved display order. Supply its name, optional logo/alt text and optional subtitle.
3. This nonempty list is the complete list for that popup. Include SCPH if it is an approved co-host; it is not automatically appended.
4. A name-only host is valid. Logos keep their proportions. The visibility control governs subtitles, while the physical room comes from venue fields.
5. Leaving the new list empty restores the existing single-host/default behavior. Existing single-organisation fields and images remain stored.
6. Publish Programme and check the popup at phone/desktop widths. Do not change Closed event, session timing or venue merely to add hosts.

## Add a research schedule in Studio

1. Open GTP 2026 Programme and the relevant day: Day 2 = 13 October; Day 3 = 14 October.
2. Add a session with type **Research sessions**, its approved title/time block and venue if applicable. Different time blocks should use separate sessions.
3. Under **Workshops / parallel slots**, add one slot per hall. Set its required Number and Title, then **Room / hall (public)**. A slot's explicit room takes precedence over the older Hosted by location; the parent venue is the fallback.
4. Under each slot's **Research presentations**, add approved presenter names and presentation titles. Drag rows to match the original schedule. Do not use a speaker's designation as their paper title.
5. Publish Programme. Check both the main programme's Research filter/link and the combined page's date/hall tables against the source.
6. Edit/publish the Research Sessions heading/description in the activity-page document separately.

No poster, headshot or row popup is required for research. An empty schedule/hall has a pending state. Only published programme research records feed the detailed schedule; static fallback research examples are not used there.

## Shared registration

Keep the page status **Coming soon** until the form and eligible participant source are ready. When ready, use **Open**, set the button label to **Register here**, and set the shared HTTPS form URL. The CMS URL takes precedence over the legacy `GTP_ACTION_WORKSHOP_FORM_URL` environment fallback. A malformed populated CMS URL leaves registration pending instead of using a different fallback destination.

The server also needs `GTP_PARTICIPANT_SHEET_ID`, optional `GTP_PARTICIPANT_SHEET_TAB` (defaults to Sheet1), `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY`. The participant sheet must be shared with that service account. The primary eligible column defaults to `EMAIL`; optional `GTP_PARTICIPANT_EMAIL_COLUMNS` lists approved header names separated by commas. Header/email comparison ignores case and surrounding whitespace. Emails found in unrelated sheet cells do not grant eligibility.

Both dates and workshop-popup actions use the same eligibility endpoint/form. The website checks that an email belongs to the configured participant list; it does not prove email ownership or enforce access control on the external form. Eligibility does not book a place. Confirm the sheet reflects the in-person restriction, and the form supports both activity types/dates, before opening.

Coming soon/Closed are enforced by the API as well as the UI; they return no form URL. Open with missing configuration becomes pending. A server configuration check does not prove the sheet/form works, so perform a controlled verification before activating production. The existing rate-limit counter is per server process.

## One-time workshop artwork migration

Deploy the additive schema, then migrate content before activating the frontend that reads Programme-only posters. `DRY_RUN=1 npm run migrate-gtp-workshop-records` reads both published and draft variants with the raw perspective. Its reviewed key/asset mapping lives in `scripts/data/gtp-workshop-artwork-migration.json`; changed titles, asset references, missing keys or extra artwork rows stop the migration for review. Existing Programme posters and populated objectives win. Image asset references, crop, hotspot and alt text transfer without uploading replacements.

Set `MIGRATION_PLAN_PATH` to a new private file during the dry run. A real run requires that exact file as `APPROVED_PLAN_PATH`, explicit production approval and `ALLOW_PRODUCTION=1`. All document revisions must still match, and every patch commits atomically. The script backs up complete raw published/draft documents with original asset references before writing, then re-queries and compares the exact expected documents. It never replaces days, sessions or artwork arrays, and never publishes unrelated draft edits. The hidden migration marker makes re-runs a no-op, so later poster removals stay removed.

The confirmed correction moves REACH to one standalone Special event with the existing shared-registration label and removes only its duplicate workshop slot. Seventeen verified posters transfer. Rethinking Leadership is on 14 October; its existing poster prints 13 October and stays archived. Ecosystem Restoration and Turning the Tide have no approved poster yet. All three remain title cards. Mobilising Leadership was replaced by Turning the Tide and its artwork stays archived. Both legacy artwork variants receive the confirmed Rethinking date metadata correction while retaining the original image.

Rollback: retain the private full backup in durable storage. Restore only the changed poster/objective paths, migration marker, REACH category/removed keyed slot and legacy date metadata after a fresh revision check; compare any later editor changes first. Do not restore whole singleton documents. Revert the canonical-list frontend only together with the reviewed data rollback; legacy artwork is still available.

## Safe seed and research import

`DRY_RUN=1 npm run seed-gtp-combined-programme` reads the existing activity-page document and prints missing safe introduction/heading fields. It leaves existing copy, posters and arrays intact, and does not add research rows or hosts. The document must already exist. A real run snapshots published/draft variants and asset references, then applies `setIfMissing` with a revision check. Production requires separately approved exact changes and `ALLOW_PRODUCTION=1`.

The optional schedule importer takes an approved JSON file:

```bash
SANITY_DATASET=development DRY_RUN=1 npm run import-gtp-research-schedule -- /path/to/approved-research.json
```

The source shape is below. The bracketed text is a format description, not event content; replace every placeholder with approved facts before validating/importing it.

```json
{
  "sessions": [{
    "key": "research-13-block-1",
    "day": "day2",
    "title": "[Approved research session title]",
    "time": "[Approved time block]",
    "halls": [{
      "key": "hall-1",
      "number": "1",
      "title": "[Approved hall title]",
      "venueLine": "[Approved room]",
      "presentations": [{
        "key": "presentation-1",
        "presenterName": "[Approved presenter name]",
        "presentationTitle": "[Approved presentation title]"
      }]
    }]
  }]
}
```

Keys use letters/numbers/underscores/hyphens and remain stable across re-runs. Sessions must have distinct keys in the source. The importer supports Day 2/3, appends new research sessions, and updates only matching research sessions. It refuses to overwrite a concurrent/special session with the same key. For an updated research session, its supplied hall/presentation lists are complete replacements in source order; metadata/assets on retained keyed slots/rows are preserved. Omitted halls/rows are removed, so review that diff explicitly. Other programme sessions/days and draft documents are untouched. Existing duration/other session metadata remains unless deliberately edited in Studio.

A real run saves a full published/draft backup with asset references before committing against the read revision. `SANITY_BACKUP_PATH` can choose a new backup file; otherwise it writes a private file under `/tmp`. An existing backup path is never overwritten. Keep the snapshot in secure durable storage before a production import. Production requires the same exact-change approval and `ALLOW_PRODUCTION=1`; the dry run never writes. Re-query published content after any real run.

## Local review and checks

- Normal preview: `/events/gtp-2026/programmes/action-workshops` uses current published data and pending states.
- Run development with `GTP_PROGRAMME_REVIEW_MODE=1` to enable `/dev/gtp-programme-review`. Its isolated `.next-gtp-review` build directory lets it run beside the normal dev server. It labels synthetic research/host fixtures and uses a local eligibility stub, with no sheet/API calls or registration submissions. `eligible@example.invalid` previews eligibility with the real form still pending; other emails demonstrate correction. In production or when the flag is absent, the page renders Not Found and the endpoint returns HTTP 404. A streamed Next.js Not Found page can retain HTTP 200 after headers are sent; no fixture content is rendered. Do not use this fixture as event content.
- `npm run test-gtp-combined-programme` checks data/registration/import compatibility. Run root lint, TypeScript no-emit, app build and Studio schema validation/build after changes.
- Check keyboard/close/focus behavior, date/workshop links, full workshop/partner coverage and real research row counts on desktop/mobile. Use a focused Lighthouse scan for the affected public routes.

## Release boundary

Frontend deploy, schema/Studio deploy, content import and document publication are separate actions. A schema deploy does not populate hosts or research sessions. Final names/logos, schedule, copy, eligible sheet and form remain dependent on the team. The current work prepares these capabilities locally for approval; it does not activate or publish them automatically.
