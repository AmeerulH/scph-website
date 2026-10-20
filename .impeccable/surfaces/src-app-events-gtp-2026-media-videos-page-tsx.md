---
version: 1
slug: src-app-events-gtp-2026-media-videos-page-tsx
primary_target: src/app/events/gtp-2026/media/videos/page.tsx
related_targets: [src/components/gtp/library/videos-page.tsx, src/components/gtp/library/video-player.tsx, src/components/gtp/library/library.module.css]
---
Mode: Experience. Ordinary extension of the existing GTP world. User approved three named collections, four pending day slots, server-side recordings search/day filtering and individual playlist entries on 19 October 2026. No unresolved direction choice remains.

## Direction contract

THESIS
Let visitors find a conference moment by collection, day or speaker, then play it deliberately. The archive remains a readable session index as it grows rather than becoming an unbounded thumbnail wall.

OWN-WORLD
Inherit the GTP navbar, Poppins/Inter, compact deep-teal masthead, cool paper reading ground and restrained orange play controls. Whole thumbnails and contributor credits lead the material; the closing playlist returns to deep teal. No replacement visual world or global token scale is introduced.

STORY
Visitors browse four chronological Daily Highlights slots, search Session Recordings by title/speaker/description or day, then explore GTP2026 Playlist. Pending days, no matches, empty content and fetch failures stay explicit. Query/day/page persist in the URL, with twelve session results per page.

FIRST VIEWPORT
A breadcrumb and bold Videos title precede the shared floating three-collection pill selector, then the Daily Highlights heading and first day slots. The selected collection has a white pill and tracks reading position, including a short final section. Desktop uses two highlight columns; phones use one and keep the selector horizontally scrollable with its active label visible. The session index follows on paper, then the dark playlist and credits close the page. The day filter retains native select behaviour with a consistently inset chevron and reserved text spacing.

FORM
User-pinned three-collection library from the precise implementation brief. Concept seed and ranked concept position: not applicable to this ordinary, specified extension; no concept roll or approved comp. Signature interaction is one click-loaded privacy-enhanced YouTube dialog. The approved scoped motion follow-up gives pointer/touch opening a .95-to-1 scale and fade over 200ms; dismissal reverses it over 150ms on the existing strong ease-out curve. Closing removes the iframe immediately but retains an inert visual shell and stable title/description until its opacity transition ends, with a cancelled-on-reopen 200ms cleanup fallback and an open-state guard. Focus returns to the trigger after removal. Keyboard opening, close-button activation and Escape are immediate; reduced-motion pointer use has a 150ms fade without scale. Play/close/search/channel/browse controls use scale .97 press feedback, 100ms into press and 160ms release; hover colour feedback is fine-pointer only. Keyboard focus stays stationary and reduced motion removes control transforms. Whole thumbnails stay still. Plain anchors and native form navigation carry browsing; no page-entry/scroll choreography or page-load autoplay. The compact Media preview keeps its existing #videos anchor.

FINISH
unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

For this ordinary extension, new-work's finish exception preserves the global system files and records the incumbent comparison in [the local evidence record](../../docs/gtp-library-design-evidence.md). That record names the missing global artifacts as pre-existing drift. The supplied pre-motion finish-review disposition was ship, no material fixes. The subsequent independent motion source review returned Approve; Chrome motion/browser checks, fresh build and desktop/paused-phase/390px inspection passed. [Validation evidence](../../docs/gtp-library-validation.md) records the touch method and borderline Media performance result. Playback and production content remain separate verification from the labelled development fixtures.
