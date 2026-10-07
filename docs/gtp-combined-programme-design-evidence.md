# GTP combined programme: design evidence

Recorded 6 October 2026 after the final scoped visual corrections. This is an evidence report for the local approval build, not a replacement design system.

## Overview

The combined Action Workshops and Research Sessions page extends the established GTP world. The finished source retains the shared navigation and image hero, Poppins headings, Inter body text, GTP paper ground, dark teal text, teal accents, existing poster artwork, and proportional host logos. Its new date-first composition belongs to this surface; it does not establish a layout requirement for other GTP pages.

The comparison uses [the direction contract](./gtp-combined-programme-direction.md), [the surface brief](../.impeccable/surfaces/2026-programmes-action-workshops-page-tsx-e9408bf5.md), the incumbent [design implementation guide](./design-system.md), and the actual source listed below. The source is the authority for values and behavior. No new world or durable global system change was approved.

## Colors

| Incumbent source | Finished use | Comparison |
| --- | --- | --- |
| `--color-gtp-dark-teal: #0D4D5E` | Date headings, workshop/research headings, hall titles, body copy, date jumps and dialog text | Existing brand text color retained. |
| `--color-gtp-teal: #009CB4` | Hero accent, keyboard focus, input focus and caret | Existing brand accent retained. |
| `--color-gtp-paper: #f4f7f8` | Continuous reading ground and research table header | Existing light reading ground retained. |
| `--color-gtp-orange-dark: #b34c00` | New registration actions with white text | Existing darker orange reused locally; white text has the reviewed 5.32:1 contrast. |
| `--color-gtp-orange: #DB5D00` | Incumbent shared CTA variant and artwork/focus accents | Global token and shared variant remain intact. |

Values are defined in [globals.css](../src/app/globals.css#L24). The registration component applies the darker existing orange and dark-teal hover through its [local CTA class](../src/components/gtp/programmes/action-workshop-registration.tsx#L16). The shared [button variant](../src/components/ui/button.tsx#L35) still uses the original orange. The local contrast fix is evidence of a scoped component correction, not permission to change every CTA or to canonize the older white-on-orange treatment as an accessibility rule.

Low-opacity dark-teal borders and washes carry grouping: date sections use dividers, halls use white containers with a tinted header, and pending states remain subdued but explicit. The schedule and date sections introduce no new brand color.

## Typography

[Poppins and Inter](../src/lib/fonts.ts) remain the existing font pair; [global mappings](../src/app/globals.css#L10) and the [root body](../src/app/layout.tsx#L58) connect them to heading and body roles. No font dependency or additional font loading was introduced.

The hierarchy is a descending scale, not a new type system: the shared hero keeps its bold responsive display ramp, date headings use bold heading type, workshop/research headings sit one step below dates, and hall headings use smaller semibold heading type. Reading copy uses the body face at small-to-base sizes with relaxed leading; metadata and field labels use smaller body type. Introductory paragraphs retain the observed 70-character measure.

Source evidence: [shared hero](../src/components/sections/heroes/gtp-forest-hero.tsx#L10), [date and section hierarchy](../src/components/gtp/programmes/combined-programme-page.tsx#L21), [hall and presentation hierarchy](../src/components/gtp/programmes/research-sessions-schedule.tsx#L14), and [verification dialog](../src/components/gtp/programmes/action-workshop-registration.tsx#L95).

The [combined page opts out](../src/components/gtp/programmes/programme-activity-page.tsx#L170) of the redundant hero eyebrow; the shared hero default remains available to existing callers. The [multi-host special-event popup](../src/components/gtp/programmes/session-modal.tsx#L69) similarly omits its redundant format badge while ordinary format and closed states remain available. These corrections are local content hierarchy decisions. Existing eyebrow treatments elsewhere are not newly canonized by this report.

## Layout

The reading surface uses the existing centered maximum-width container, 4/6 spacing steps for responsive horizontal padding, and generous vertical date separation. Date jumps follow the introduction. Each date contains its own heading, metadata, registration action, workshop row, and then research schedule. The registration action moves below date metadata on narrow screens; it sits beside the heading on wider screens. This fulfills the pinned date-first direction without changing shared site chrome.

Workshop artwork remains in a bounded horizontal row with previous/next controls, rather than stretching into a new grid. Research halls use one column at narrower widths and two columns at the large breakpoint. The presenter/title table changes to labeled definition-list rows below the small breakpoint; long names and titles wrap within the hall. The verification dialog retains viewport gutters, a bounded height, internal scrolling, and a compact maximum width. Multi-host details stack on mobile and use two columns when space permits.

Source evidence: [combined sections](../src/components/gtp/programmes/combined-programme-page.tsx#L20), [workshop row](../src/components/gtp/programmes/action-workshops-carousel.tsx#L23), [responsive hall layout](../src/components/gtp/programmes/research-sessions-schedule.tsx#L14), [dialog bounds](../src/components/gtp/programmes/action-workshop-registration.tsx#L89), and [host grid](../src/components/gtp/programmes/programme-modal-chrome.tsx#L130).

## Elevation & Depth

The added reading content relies on tonal surfaces and restrained borders. It does not introduce a shadow on every date or hall. The verification dialog reuses a white elevated surface over a dark-teal overlay; registration buttons inherit the shared button shadow and interaction treatment. The build carries no new hard offset shadow or decorative glass panel on the new reading surface. Existing navigation and modal treatments remain incumbent material, not new global rules.

## Shapes

Pill-shaped date jumps and buttons remain consistent with the existing control silhouette. Halls and workshop cards reuse the rounded container vocabulary; the verification dialog uses the established larger rounding. The root radius scale remains defined in [globals.css](../src/app/globals.css#L73), with no radius token change.

Workshop posters use contained images so the full composition stays visible. Host logos use their source dimensions, proportional scaling and contained rendering. These preserve identity assets instead of treating them as decorative crops. Evidence: [poster rendering](../src/components/gtp/programmes/action-workshops-carousel.tsx#L62) and [logo dimensions/rendering](../src/components/gtp/programmes/programme-modal-chrome.tsx#L29).

## Components

| Finished component | Existing vocabulary retained | Surface-specific addition |
| --- | --- | --- |
| Combined programme page | Shared hero, GTP tokens, centered content and pill links | Date-first workshop/research grouping and date jumps. |
| Workshop row | Existing artwork, contained images, rounded cards, details popup and partner row | The same row appears within each date. |
| Research hall schedule | Poppins hierarchy, Inter copy, white/paper surfaces and teal borders | Semantic table on wider screens; labeled rows on mobile; explicit pending states. |
| Registration verification | Shared button primitive, Radix dialog, rounded white surface, teal focus and existing icon library | One shared registration path, local darker-orange action, pending/closed/loading/error/verified states. |
| Hosted-by block | Existing section label, logo treatment and organization typography | Multiple host records, responsive grid, and legacy single-host fallback. |

Pending data is part of the component behavior: missing research blocks, halls or presentations show confirmation notices; registration remains disabled when unavailable. Illustrative fixture presenters and organizations demonstrate wrapping and layout only. They are not approved event facts or production defaults.

## Do's and Don'ts

These are comparison conclusions for this implementation, not additions to the global rulebook.

- **Do** continue using the existing brand tokens, font loading and UI primitives when maintaining this extension.
- **Do** keep full poster artwork and proportional logos visible; the actual assets supply the imagery.
- **Do** retain explicit pending states until approved research, hosts, registration form and eligible attendee source are supplied.
- **Don't** promote this page's date-first composition, local CTA override or eyebrow omission into a requirement for every GTP surface.
- **Don't** treat fixture text, existing eyebrow patterns elsewhere, legacy contrast defects or a performance shortfall as system rules.

## Evidence and drift conclusion

The final handoff supplies desktop/mobile captures for the local page's pending state, a full illustrative fixture, research halls, registration verification and multiple hosts under `.impeccable/review/`. All nine captures were inspected against their current source:

| Captures | Evidence checked |
| --- | --- |
| `desktop.png`, `mobile.png` | Shared navigation and hero, corrected hero hierarchy, paper ground, date jumps, date heading and unavailable registration. |
| `fixture-desktop-full.png` | Both dates, full workshop artwork, registration placement and workshop-before-research reading order. |
| `research-desktop.png`, `research-mobile.png` | Two-hall table layout, labeled mobile rows and long presentation-title wrapping. |
| `registration-desktop.png`, `registration-mobile.png` | Darker-orange action, bounded white dialog, field labels and visible mobile error state. |
| `hosts-desktop.png`, `hosts-mobile.png` | Proportional logo, responsive host grouping, long organization-name wrapping and omitted redundant special-event badge. |

The fixtures are local review evidence, not shipping raster assets. No new raster was added to the product.

The independent finish reviewer initially requested registration contrast and redundant-eyebrow corrections. The final handoff reports both fixes scored resolved with disposition **ship** at that fix-list scope. It does not establish whole-site approval. Build, TypeScript, focused lint, Studio build/schema validation and audit results are implementation verification reported by the parent task, not checks rerun by this documentation pass. The combined page's mobile audit reached 80; the main programme page's 67 remains a release limitation against the repository's ≥80 contract.

`DESIGN.md` and `.impeccable/design.json` are absent, as they were before this extension. `PRODUCT.md` exists and retains its legacy `Register` section containing only `brand`, ahead of the populated user, purpose and brand sections. This report records that observed content without inferring a loader error or validation code. Those files are preserved in their incumbent state: this ordinary extension has no authority to generate a replacement visual system or repair product-context drift. The existing implementation guide, tokens and components are sufficient evidence of an established world despite the missing Impeccable system files.

Comparison outcome: **the finished extension preserves the incumbent GTP system, with a local legibility correction and surface-specific composition.** It remains a local team-approval build; approved event content and operational registration inputs remain pending.

Deliberately not canonized: redundant eyebrow devices outside the corrected scope, older contrast defects, illustrative fixture content, one-off composition values and the main programme performance shortfall; none supplies a durable, approved system rule.

### Research session table correction — 7 October 2026

The team's supplied desktop/mobile designs remain the visual reference. The research listing now groups existing one-paper-per-slot records by their published room within each date/time block. Papers become ordered rows under **Session 1** and **Session 2**, with the actual hall retained as venue metadata. Explicit Research presentations lists remain separate ordered groups. A missing assignment stays visible under **Session to be confirmed** until supplied; no assignment is inferred from paper order.

The schedule removes the single-paper card branch. Desktop uses two presenter/title tables; mobile stacks the session containers and uses labelled presenter/title rows. Existing presenter names, multiple presenters, profile photos and the shared missing-photo avatar remain supported. The correction retains the incumbent GTP paper surface, teal text, restrained borders, fonts, workshop carousel and registration flow.

Final local production-build captures: `.impeccable/review/research-session-tables-desktop.jpg` and `.impeccable/review/research-session-tables-mobile.jpg`. Both published dates render two sessions with four papers each. Checks at 320, 390, 768 and 1280px found no horizontal page overflow; tables stack at tablet widths and use two columns on desktop. The production build, focused lint and 18 behaviour checks passed. The affected route's local mobile Lighthouse Performance score was **86**, with CLS **0**.

The independent scoped finish review returned **ship**, with no material layout fixes. Its screenshot/source check confirmed the approved two-session composition, readable wrapping and preserved presenter-photo support. This verdict covers the research-table correction, not the wider site or a frontend deployment.

The user confirmed that the previously unassigned 14 October paper, “Revealing Risks from Shifting Seas: A Data-Driven Coastal Vulnerability Analysis in Indonesia,” belongs to Session 2. After explicit production-write approval, its missing `venueLine` was set to **Hall 2** using a keyed, revision-guarded one-field patch. A complete backup is saved under `tmp/gtp-cms-backups/`; a subsequent full-document comparison verified all other content and asset references were preserved. There was no draft Programme document to patch. This CMS assignment was saved in production before the frontend release; the captures above show the local production-build preview used for approval.

### Workshop people readability refinement

Follow-up evidence recorded 6 October 2026 for the user's requested workshop roster refinement, including explicit retention of profile photos. The [workshop modal](../src/components/gtp/programmes/workshop-modal.tsx#L184) now presents the roster at full content width after the objective and before sharing, registration and host utilities. It retains the existing GTP palette and body face: names lead in semibold dark teal, smaller roles follow, and designations use muted text. Long names and designations wrap. This is a local workshop display refinement; the ordinary-session roster is outside its scope.

The [roster](../src/components/gtp/programmes/workshop-modal.tsx#L220) remains one column until its own container reaches the existing extra-large container breakpoint (36rem), then uses two columns. It still calls the existing [people resolver and role-label helper](../src/components/gtp/programmes/programme-person-roles.ts#L13), retaining names, roles, deduplication and ordering. Where a real image URL exists, it keeps the [shared profile image](../src/components/gtp/programmes/programme-speaker-avatar.tsx#L15), including name-derived alt text and a 36px circular display, aligned with the top of the person's text. Following Ameerul's explicit clarification, entries without photos now keep the shared empty-user profile icon. The earlier text-only captures record the preceding iteration. The empty roster retains its explicit confirmation state.

All five follow-up captures were inspected: `workshop-people-desktop.png` and `workshop-people-mobile.png` show the published roster's hierarchy and wrapping; `workshop-people-photos-desktop.png` and `workshop-people-photos-mobile.png` show retained portraits and top alignment; `workshop-people-empty.png` shows the confirmation state. The parent task's measured checks report a 720px roster with two 344px columns at a 1280px viewport, a 560px single-column roster at 640px, and a 318px single-column roster at 390px, with no overflow. Both sample portraits completed loading with positive natural widths; their alt text and 36px display were preserved. These measurements are supplied verification, not a new browser run by this documentation pass.

The [development review page](../src/app/dev/gtp-programme-review/page.tsx#L14) requires both development mode and the explicit review flag. Its [PeopleReview fixture](../src/app/dev/gtp-programme-review/people-review.tsx#L9) uses two existing published programme portraits only as labeled layout samples and provides a separate empty-state preview. It does not assign those people to a real workshop or add shipping raster assets.

The subsequent user-requested placeholder correction is captured in `workshop-people-fallback-desktop.png` and `workshop-people-fallback-mobile.png`: all six named people in the narrative workshop retain the existing 36px empty-user icon when their photo is absent. Desktop remains two 344px columns; mobile remains one 318px column, with no overflow. The real-photo branch and role resolution remain unchanged. Focused lint passed for the correction.

Fresh scoped finish review returned **ship** with no material fixes for the local roster refinement, accepting the responsive layout and missing-photo text rows and confirming five valid captures, preserved real photos and source content after the settled opaque empty-state recapture; the broader surface ceiling remained unscored without a QUALITY BAR card, and this is not a production-release verdict. The earlier nine captures and the earlier contrast/eyebrow **ship** verdict above remain historical evidence for that correction scope; they do not certify this later roster refinement. No new global rule, token, identity decision or documentation repair is introduced. `DESIGN.md`, `.impeccable/design.json` and `PRODUCT.md` remain in their incumbent state.
