# GTP library: finished extension evidence

Recorded on 19 October 2026 for `/events/gtp-2026/resources`, `/events/gtp-2026/media/videos` and the Media page's compact `#videos` preview.

## Overview

This is an ordinary extension of the incumbent GTP world. The approved [implementation brief](gtp-resources-video-library-plan.md) pins the grouped toolkit, ordered reports and three video collections. There was no open visual-world choice, concept roll or approved comp. The finished implementation is compared with the incumbent source and the four local captures below; it does not establish a replacement design system.

Authority checked: [PRODUCT.md](../PRODUCT.md), [global styles](../src/app/globals.css), [font setup](../src/lib/fonts.ts), [root font application](../src/app/layout.tsx), the [GTP navbar](../src/components/gtp/navbar.tsx), [Media hero](../src/components/gtp/media/media-hero.tsx) and [Media section navigation](../src/components/gtp/media/media-section-nav.tsx). Local evidence comes from [library styles](../src/components/gtp/library/library.module.css), [Resources](../src/components/gtp/library/resources-page.tsx), [Videos](../src/components/gtp/library/videos-page.tsx), [video items](../src/components/gtp/library/video-item.tsx), [player](../src/components/gtp/library/video-player.tsx) and [Media preview](../src/components/gtp/media/video-section.tsx).

The approved [scoped motion follow-up](../plans/001-library-motion.md) is documented here from the current player and stylesheet. It adds player continuity and direct control feedback within the same visual world; it does not establish a new direction or global motion system.

Pre-existing documentation drift: `DESIGN.md` and `.impeccable/design.json` are absent in this checkout. Neither was created. PRODUCT.md's time-bound statement that 2026 videos do not yet exist also predates the existing published legacy videos identified in the implementation handoff; this extension does not refresh that global product context. The durable brand commitments remain applicable. Under Impeccable's ordinary-extension finish rule (`reference/new-work.md`, section 7), this record and the two route briefs document the comparison while preserving global files.

### Render evidence

All four supplied captures were opened and checked against the source. They show the document top, the intended route content and the complete page rather than a blank or unfinished entrance state.

| Capture | Size | Evidence visible |
| --- | --- | --- |
| [Resources desktop](../.impeccable/review/gtp-library/resources-desktop.png) | 1440 × 1199 | Established navbar, compact masthead, featured toolkit, independently available/pending files, ordered report rows. |
| [Resources mobile](../.impeccable/review/gtp-library/resources-mobile.png) | 390 × 1524 | Mobile menu control, full wrapping titles, vertically stacked content and downloads, visible pending labels. |
| [Videos desktop](../.impeccable/review/gtp-library/videos-desktop.png) | 1440 × 5103 | Collection anchors, four chronological highlight slots, recording filters and rows, pagination, dark playlist close. |
| [Videos mobile](../.impeccable/review/gtp-library/videos-mobile.png) | 390 × 8634 | Single-column collections and recording rows, wrapping controls and text, page controls and playlist. |

The captures use explicitly labelled development fixtures, including sample report names, one sample download, illustrative session data and a labelled 2025 thumbnail. They evidence layout and partial availability; they do not establish production publication, real report contents or live playback. The development badge and Next.js development indicator are review chrome, not product design.

Before the motion follow-up, the finish-review handoff reported **ship**, with no material fixes. The supplied scoped detector result was `[]` with exit 0 for the library, preview and navbar. Those results and the static captures retain their original scope. The later independent motion source review returned **Approve**; Chrome motion/browser checks, fresh build and desktop/paused-phase/390px inspection passed. [Validation evidence](gtp-library-validation.md) records the exact touch method, blocked test iframes and borderline Media performance result. This document adds no claim about deployment, authenticated flows or a site-wide audit.

## Colors

The new surfaces inherit the existing GTP dark-teal/teal/orange family and cool paper ground. Global values remain authoritative in `globals.css`; the extension adds no global palette tokens.

| Existing token | Canonical value | Repeated local use |
| --- | --- | --- |
| `--color-gtp-dark-teal-dark` | `#093a48` | Mastheads, body ink, collection bar, playlist and player background, primary search button. |
| `--color-gtp-dark-teal` | `#0D4D5E` | Hover state for the search button and available-download border. |
| `--color-gtp-orange-dark` | `#b34c00` | Play controls, page focus outline and input caret. |
| `--color-gtp-green` | `#86BC25` | Selection and the dark player's focus outline. |
| `--color-gtp-paper` | `#f4f7f8` | Established cool paper colour; locally repeated as `--library-paper` for the page ground. |

White headings and pale teal supporting text sit on the dark regions. Paper-ground text uses deep teal. Repeated local tones support dividers, borders, pending text and poster wells; these implementation colours are not promoted into new global primitives. The local paper alias matches the incumbent token but remains a local literal, not a separate brand decision.

**The Availability Rule.** In these library surfaces, an available file is a real PDF anchor; a missing file is an inert, dashed-border row with explicit pending copy. Colour alone does not carry availability.

## Typography

The library retains Poppins headings and the root Inter body face. `src/lib/fonts.ts` supplies both through `next/font`; `globals.css` maps the existing heading/body roles. No additional font load or display face is introduced.

| Observed local role | Implemented ramp | Purpose |
| --- | --- | --- |
| Masthead title | Poppins 700; `clamp(3rem, 7vw, 5.75rem)`; line height 1.08 | Shared Resources/Videos route identity. |
| Section heading | Poppins 600; `clamp(2rem, 4vw, 3.25rem)`; line height 1.18 | Video collections. |
| Featured document | Poppins 600; `clamp(2rem, 4vw, 3.5rem)`; line height 1.15 | First resource, given stronger emphasis than later reports. |
| Report title | Poppins 600; `clamp(1.5rem, 3vw, 2.25rem)`; line height 1.3 | Ordered resource rows. |
| Video title | Poppins 600; 1.125rem; line height 1.45 | Repeated film and recording labels. |
| Reading copy | Inter; 1rem; line height 1.75; maximum 65ch | Descriptions and collection introductions. |
| Labels and credits | Inter; generally .875rem, with .8125rem video metadata | Actions, filters, credits and duration/day/topic metadata. |

The incumbent Media hero uses a larger display treatment. The library's compact masthead is a route-specific density choice, not a reduction of the global display scale. Long heading text can wrap anywhere; full titles stay visible.

## Layout

The library's shared content width is capped at 1200px, with 1.5rem side gutters. This sits within the established GTP pattern of wide centred content and generous space; it does not replace the navbar's existing container.

Resources begins with a prominent toolkit and its independent files, followed by ruled report rows. When a cover exists, it shares the row with the content; otherwise downloads occupy the second column. At 900px the feature uses a 1.4:1 split and reports use equal columns. Below that breakpoint content stacks in source order. The body uses 4rem top and 6rem bottom space; report rows use 3rem vertical padding.

Videos moves through four Daily Highlights slots, Session Recordings and GTP2026 Playlist. Highlights become two columns at 640px. Recording rows become a 220px thumbnail beside flexible text at that breakpoint. Playlist items become two columns at 640px and three at 900px. Phone layouts stay in one column. Search controls wrap and the search input has a flexible 260px basis; inputs use 1rem text and at least 48px height.

Following the user's refinement, collection navigation reuses the incumbent `MediaSectionNav` floating pill. It sticks below the navbar at 5.25rem, highlights the active collection in white and scrolls horizontally when needed. Active labels are revealed within the pill without moving the document. Sections reserve 10rem of anchor offset. The scrollspy also handles a short final section at the page bottom. The original full-page captures predate this refinement; `pills-1440-recordings.png`, `pills-1440-playlist.png`, `pills-390-recordings.png` and `pills-390-playlist.png` in the same evidence folder supersede their selector/filter areas.

**The Bounded Index Rule.** Sessions use the URL for query/day/page state and display twelve recordings per page. The content remains a readable index as the archive grows; the layout is not tied to the fixture's total.

## Elevation & Depth

The library content uses flat colour regions, hairline dividers and borders rather than card shadows. Dark mastheads and the closing playlist establish the large page layers. The retained navbar and incumbent Media navigation already use translucency and soft shadows; their existing depth treatments are not prohibited or recast by this extension.

The player alone moves into an overlay: a translucent dark scrim separates a centred dark dialog from the page. Pointer/touch activation fades the overlay and brings the centred dialog from opacity 0 and scale .95 to full opacity and scale 1 over 200ms. Pointer dismissal reverses that path over 150ms. Both use the incumbent `--ease-out-strong` curve, `cubic-bezier(0.23, 1, 0.32, 1)`, through interruptible CSS transitions and `@starting-style`. Page entry, scrolling and routine reading remain steady.

Keyboard-originated activation (`click.detail === 0`), keyboard close-button activation and Escape are immediate. Under reduced motion, pointer activation/dismissal uses a 150ms fade with a fixed centred transform and no scale change. A player-only duration override preserves that fade despite the global reduced-motion reset; the keyboard instant mode takes precedence. Local Chrome checks confirmed those behaviours; the linked validation record states the device/playback limits.

## Shapes

Repeated local shapes are softly rounded rectangular downloads, poster wells and the dialog (12px), input fields (8px), and pill buttons/anchor targets. Video wells preserve a 16:9 proportion; circular play controls are 48px and the dialog close control is 44px. These values describe the library implementation and do not replace the existing global radius scale.

**The Whole Artwork Rule.** Resource covers and video thumbnails use `object-fit: contain`. Optional credit copy remains beside the work; missing covers do not create placeholder artwork. The screenshot's sample thumbnail is review material, not a new asset prescription.

## Components

- **Masthead:** breadcrumb, one large title and restrained introductory copy on deep teal. The Resources breadcrumb returns to GTP; Videos also names its Media parent.
- **Download row:** a semantic file list with title-specific accessible PDF names. Available files expose format and optional size; unavailable files render as text containers. Each file's state is independent. Available anchors receive the control feedback described below; pending rows remain inert.
- **Resource row:** an article containing the title, optional description, credit, downloads and optional whole cover. No decorative icon-card grid is introduced.
- **Collection navigation:** three native anchors in the shared floating pill, with active scroll tracking, 44px targets and horizontal scrolling on phones. The collection is consistently named **Session Recordings**. Pointer press/colour feedback reuses 100/160ms strong easing; keyboard activation is immediate and reduced motion removes scaling. The incumbent top-level navbar adds Resources and routes its Videos item to the dedicated library; the Media hero still reaches the compact `#videos` preview.
- **Recording search:** visible labels, a search field, native day selection, submit button, optional clear link, result status and separate page navigation. The day selector reserves 48px for its decorative chevron, inset 16px from the edge; the icon does not intercept input. No match, pending content and fetch error have distinct messages.
- **Video item:** a genuine button only when a valid playable ID is present; otherwise a visibly pending day slot. Day, duration, topic, speakers and contributor credit sit outside the image.
- **Player:** one Radix dialog and one active video. Source code separates selected content, open state and visual presence. Activation mounts the privacy-enhanced YouTube iframe; closing removes that iframe immediately while retaining the title, description and visual shell for the exit. The closing dialog is inert, its close control is disabled and the overlay stops accepting pointer events. The dialog's own opacity transition end removes the shell and selected data; a bounded 200ms fallback covers a missing completion event. Reopening cancels that fallback, and an open-state guard prevents stale completion from removing a reopened player. The close-autofocus handler restores the trigger after removal. Keyboard close removes the shell immediately. An explicit YouTube link remains available while open. These lifecycle statements describe code, not a completed browser check.
- **Media preview:** retains `id="videos"`, displays a bounded selection and links to the complete library. It uses the same item/player implementation rather than a second visual family.
- **Control feedback:** available downloads, search/channel/browse buttons, close controls and the play control use scale .97 for pointer/touch press, with 100ms into press and 160ms release on the established strong ease-out curve. Play feedback transforms the circular control, not the thumbnail. Fine-pointer hover is gated by `(hover: hover) and (pointer: fine)` and uses 160ms colour feedback plus a 2px downward download-icon nudge. Keyboard focus keeps transforms off and feedback immediate. Reduced motion removes press/icon transforms while preserving visible focus and colour acknowledgement. Images are never zoomed, cropped or filtered by this feedback; pending entries gain no interaction.

## Do's and Don'ts

- **Do** inherit the existing fonts and GTP tokens; keep collection and document composition in the route briefs.
- **Do** retain readable full titles, whole supplied artwork and visible credits.
- **Do** keep pending files inert and distinguish loading failure from an empty collection.
- **Do** preserve the navbar, Media anchor and published editor-owned content when extending these surfaces.
- **Do** keep motion local to intentional player and control interactions, with immediate keyboard handling and a fade-only reduced-motion player path.
- **Don't** treat development fixture names, durations, file sizes, thumbnails, badges or development indicators as production content or design primitives.
- **Don't** turn this library's flat content regions into a global prohibition on the incumbent navbar's native depth treatments.
- **Don't** canonize the incumbent Media hero's uppercase eyebrow as a reusable library rule: the craft floor excludes kickers/eyebrows, and the new library masthead does not repeat it.
- **Don't** silently repair the missing root design artifacts or stale time-bound PRODUCT.md evidence as part of this extension.
