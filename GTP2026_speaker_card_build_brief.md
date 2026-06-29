# Build Brief: GTP 2026 Speaker Shareable Card System

**Update:** this does NOT need a separate website. The existing `scph-website` Next.js repo already has everything required as a foundation — build this as a new route inside the existing app.

## Context

GTP 2026 (Global Tipping Points Conference, Oct 2026, Kuala Lumpur) needs each speaker to get a unique shareable URL that, when pasted into WhatsApp/LinkedIn/X, unfurls into a branded card: headshot (circular), name, job title, organization, on a dark teal + orange background (matching invt.io/Gleanin-style speaker cards).

## Why a separate site/SaaS is not needed

Confirmed from the existing codebase (`/Users/Ambassador/Desktop/Ameerul/Work/scph/scph-website`):

1. **OG image generation is already solved here.** `src/app/opengraph-image.tsx` and `src/app/events/gtp-2026/opengraph-image.tsx` already use Next.js's built-in `next/og` `ImageResponse` API to render branded gradient cards server-side, at zero marginal cost (no external API, no per-image credits). This is exactly the rendering mechanism needed for speaker cards — same approach, new template.
2. **Speaker data already exists in Sanity.** `studio/schemaTypes/gtp2026SpeakerType.ts` defines `name`, `role`, `organisation`, `bio`, `session`, `sessionDate`, and `image` (photo with hotspot cropping) — i.e. everything a card needs, already editable by organizers in Sanity Studio. Fetched via `getGtp2026Speakers()` in `src/sanity/gtp-stage1.ts` (used today by `src/app/events/gtp-2026/speakers/page.tsx`).
3. **Brand colors are already defined as CSS tokens** in `src/app/globals.css`:
   - `--color-gtp-dark-teal: #0D4D5E` (darker variant `#093a48`, lighter `#116578`)
   - `--color-gtp-teal: #009CB4`
   - `--color-gtp-orange: #DB5D00` (lighter `#f06a00`, darker `#b34c00`)
   - (also `--color-gtp-green: #86BC25` if a third accent is wanted)
   These are the exact "dark teal + orange" GTP palette — no new brand decisions needed.
4. **The GTP 2026 section already has its own layout, metadata pattern, and routing conventions** under `src/app/events/gtp-2026/`, including a working `speakers/page.tsx` listing page to extend from.

## What needs to be added (additive, low-risk)

1. **Add a `slug` field** to `gtp2026SpeakerType` in Sanity (string, unique, e.g. `jane-doe`) — currently missing. Auto-generate from `name` on save, or let organizers set it manually.
2. **New dynamic route**: `src/app/events/gtp-2026/speakers/[slug]/page.tsx` — fetches one speaker by slug (extend `getGtp2026Speakers`/add a `getGtp2026SpeakerBySlug` query in `src/sanity/gtp-stage1.ts`), renders a simple public speaker page (reuse existing speaker card UI components if any exist in `src/components/gtp/`), and sets per-page `Metadata.openGraph`/`twitter` pointing at a per-speaker OG image.
3. **New dynamic OG image route**: `src/app/events/gtp-2026/speakers/[slug]/opengraph-image.tsx` — same `ImageResponse` pattern as the two existing `opengraph-image.tsx` files, parameterized by the speaker's name/role/organisation/photo. Circular-crop the headshot using `<img>` with `borderRadius: '50%'` inside the `ImageResponse` JSX (the Satori renderer Next uses supports this directly — no extra image library needed for v1).
4. **Speaker self-serve flow (optional, for collecting their own info/photo):** there's already a pattern for public-facing forms in this repo (`src/app/events/gtp-2026/submissions/abstract-form.tsx`, `get-involved/contact-form.tsx`, using `nodemailer`/`resend` for notifications). A `speakers/submit/[token]` form following that same pattern can let invited speakers fill in their own role/organisation/photo, writing to Sanity via a small API route under `src/app/api/` (there's already an `src/app/api/` directory with existing patterns to follow, e.g. the revalidate route).
5. **Revalidation:** if speaker docs are edited after publish, add `gtp2026Speaker` to `SANITY_TYPE_TO_PATHS` in `src/app/api/revalidate/sanity/route.ts` so speaker pages/cards update on publish (per this repo's existing CMS conventions documented in `AGENTS.md`).

## Card design spec (for the `ImageResponse` template)

- Size: 1200×630 (already the standard used by the two existing `opengraph-image.tsx` files in this repo — keep consistent).
- Background: gradient or solid using `--color-gtp-dark-teal` (`#0D4D5E`)/`#093a48`, matching the existing `gtp-2026/opengraph-image.tsx` gradient (`linear-gradient(145deg, #093a48 0%, #0D4D5E 40%, #009CB4 100%)`).
- Accent: `--color-gtp-orange` (`#DB5D00`) for name/role text, divider line, or border accent — mirroring how `gtp-2026/opengraph-image.tsx` currently uses the green accent (`#86BC25`) for the date line.
- Layout: circular headshot (left or centered), speaker name (bold, large), role + organisation beneath (smaller, orange or muted white), GTP 2026 wordmark/date line in a corner — consistent with the existing GTP OG image's typographic hierarchy.

## Testing before sending real speaker invites

- LinkedIn Post Inspector and Twitter/X Card Validator to confirm unfurling and to bust any cached preview if a card is regenerated.
- WhatsApp caches previews per-URL too; test with a real device share, not just a debugger.

## Net effect

No new hosting, no new domain, no recurring SaaS/API cost. This ships as a normal feature PR to the existing `scph-website` repo, reusing the OG-image mechanism, Sanity schema, and design tokens that already exist.
