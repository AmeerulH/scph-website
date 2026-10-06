---
version: 1
slug: "2026-programmes-action-workshops-page-tsx-e9408bf5"
primary_target: "src/app/events/gtp-2026/programmes/action-workshops/page.tsx"
related_targets: ["src/components/gtp/programmes/combined-programme-page.tsx","src/components/gtp/programmes/action-workshops-carousel.tsx","src/components/gtp/programmes/research-sessions-schedule.tsx","src/components/gtp/programmes/programme-modal-chrome.tsx"]
---

# Combined programme surface brief

Primary target: `src/app/events/gtp-2026/programmes/action-workshops/page.tsx`.
Mode: Read, with an Operate registration flow. Local implementation for team approval; published research/hosts/form remain pending. Preserve the existing GTP world and approved high-level desktop/mobile mockups in `docs/mockups/gtp-combined-programme/`.

## Direction contract

THESIS: One date brings together simultaneous workshop and research choices, with one shared verified registration action.

OWN-WORLD: Existing GTP dark teal, teal, orange CTA, paper ground, Poppins headings and Inter body. Use existing poster artwork, uncropped logos, restrained borders and readable hall tables.

STORY: Visitors choose a date, browse workshop artwork and research presentation titles, then verify their conference email before entering the shared form. Pending facts remain explicit.

FIRST VIEWPORT: Existing site navigation and hero, the combined title, a short simultaneous-session introduction/date jumps, then the first date and its CTA. Workshop cards lead; research follows under the same date. Mobile stacks the CTA and halls.

FORM: User-pinned date-first extension, code-led integration of the high-level HTML mockup; no concept roll or image-generation comp was required for this scoped extension. Reference key: team-feedback-2026-10-06.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

No new raster assets or global design-system changes are planned. The documenter should compare this extension with the incumbent system and preserve existing design files, reporting their pre-existing absence/drift rather than repairing it as a side effect.
