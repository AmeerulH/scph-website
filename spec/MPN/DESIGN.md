# MPN Design Contract

**Status:** Canonical implementation reference  
**Source of truth:** Approved [`prototype/index.html`](prototype/index.html).
This document captures its implementation rules; it does not introduce new
visual decisions.

All MPN UI changes must conform to this contract. If the prototype and this
document appear to differ, preserve the prototype and update this document
before implementing the change.

## Visual language

MPN is a calm, editorial member portal within the SCPH site. It uses a cream
canvas, white work surfaces, navy headings, SCPH blue actions, and green only
for positive states and workshop context.

| Role | Token / value | Use |
|---|---|---|
| Primary blue | `scph-blue` / `#1B4384` | CTAs, active navigation, selected filters |
| Green | `scph-green` / `#50B58B` | Success, workshop badges, confirmation states |
| Navy | `#0d1f3c` | Headings, dark emphasis |
| Cream | `#faf9f7` | Page background |
| Body text | `#1e293b` | Main copy |
| Muted text | `#64748b` | Labels and metadata |
| Border | `#e2e8f0` | Rows, panels, dividers |

Use existing SCPH Tailwind tokens (`scph-blue`, `scph-green`) and the existing
Poppins and Inter font setup. Do not add an alternate MPN palette or font.

## Type and spacing

- Poppins: page titles (700, 2rem), section headings (600, 1.5rem), and row
  titles (600, 1.125rem).
- Inter: body text (400, 0.9375rem), labels (500, 0.8125rem), buttons (600,
  0.875rem), and badges (600, 0.75rem).
- Desktop content padding: 24px. Mobile content padding: 16px.
- Major section gap: 32px. List/card gap: 12px.
- Standard panel/row radius: 10px. Navigation and filter selections use a full
  pill radius.

## Navigation

- The member navigation is a fixed white pill, 64px high, positioned 10px from
  its containing top chrome, with a soft `0 4px 24px rgba(0,0,0,0.10)` shadow.
- Active links use a blue pill with white text and 6px × 16px padding.
- Desktop shows horizontal navigation; below 640px it becomes a hamburger menu.
- Account controls live at the right edge of the navigation and retain the same
  compact button vocabulary as the prototype.

## Resources

- Desktop resources use a 188px sticky filter rail on the left and content on
  the right, separated by 32px.
- The rail is white, rounded 10px, padded 20px 14px 24px, and becomes a
  filter-toggle surface below 900px.
- Resource cards are horizontal white rows: 16px × 20px padding, 10px radius,
  a 1px border, 16px internal gap, metadata first, and one clear action.
- Tabs, type/theme chips, and filter choices are compact pills. Selected
  filters and active tabs use SCPH blue; workshop labels use green.
- Download states must be explicit: loading, signed-in download, and
  signed-out sign-in prompt. Never expose a private file path in the UI.

## Responsive and interaction rules

| Width | Required behaviour |
|---|---|
| Above 900px | Full navigation and persistent filter rail |
| 640px–900px | Horizontal navigation; filters collapse behind a toggle |
| Below 640px | Hamburger navigation, filter toggle, single-column resource rows |

- Use familiar controls, visible keyboard focus, semantic links/buttons, and
  WCAG AA colour contrast.
- Motion is limited to state transitions (150–250ms), respects reduced-motion
  preferences, and never blocks reading or navigation.
- Empty states explain what will appear and what, if anything, the user can do
  next. Use skeletons for data-loading surfaces rather than isolated spinners.

## Implementation guardrails

- Reuse `src/components/ui/` primitives and MPN components before introducing
  a new visual primitive.
- Use Server Components for data display; isolate filters, menus, downloads,
  and other browser interaction to client components.
- Use `next/image` for images and provide `sizes`.
- Do not add gradients, glass effects, decorative animation, coloured side
  borders, generic icon-card grids, or unrelated visual motifs.
- Any departure from the approved prototype requires explicit approval and an
  update to this contract.
