# Cursor Agent Briefing — MPN Portal

## What you're building

You are helping build the **Media Professional Network (MPN)** — a community portal for journalists who attended SCPH Capacity Development Workshops. MPN is a **new route inside the existing SCPH Next.js app**, not a separate project.

- URL: `/community/mpn` on `sunwayplanetaryhealth.com`
- Code location: `src/app/(scph)/community/mpn/` inside this repo
- Components: `src/components/mpn/`
- API routes: `src/app/api/mpn/`
- Database: a separate **Supabase project** (not Sanity — Sanity is only for the main SCPH site)

---

## Read these first (in order)

1. `@AGENTS.md` — master reference for this codebase (conventions, CMS, performance bar)
2. `@spec/HANDOFF.md` — full summary of what's been decided and what to build next
3. `@spec/MPN/MASTER.md` — complete MPN spec end-to-end (routes, DB schema, access model, all features)
4. `@docs/coding-guidelines.md` — Server Components, TypeScript at Supabase boundaries
5. `@docs/design-system.md` — existing SCPH design tokens (MPN extends these)

---

## Key decisions already made (do not re-litigate)

**Access model (3 tiers):**
- `public` — browse everything read-only. No PDF downloads, no contact emails, no Café posting
- `pending` (registered, not yet approved) — download PDFs, see emails. Cannot post in Café or submit publications
- `member` (approved) — full access including Café posting and publication submission
- `admin` — everything + admin dashboard

**Virtual Café:**
- Publicly readable (Reddit-style) — anyone can browse threads and replies
- Members-only for posting/replying
- Pending users see "Your membership is awaiting approval" not a reply form
- Real-time replies via Supabase Realtime channel

**Expert directory:**
- Publicly visible (photo, name, role, org, expertise, LinkedIn)
- Email address gated to logged-in users only (public-safe views omit `email`;
  authenticated server-side contact lookups validate the session)

**Public Google indexing:**
Add these routes to `src/app/sitemap.ts` and `src/lib/public-indexable-paths.ts`:
- `/community/mpn`, `/community/mpn/resources`, `/community/mpn/resources/[id]`
- `/community/mpn/publications`, `/community/mpn/publications/[id]`
- `/community/mpn/experts`, `/community/mpn/experts/[id]`
- `/community/mpn/members`, `/community/mpn/committee`
- `/community/mpn/cafe`, `/community/mpn/cafe/[id]`
- `/community/mpn/events`, `/community/mpn/webinars`

Noindex: `/login`, `/pending`, `/profile`, `/admin/**`, `/publications/submit`

---

## Database

Full SQL is in `@spec/MPN/database/README.md`. 12 application tables total.
Use version-controlled migrations in this repository; do not run untracked SQL
directly against production.

Key tables: `profiles`, `resources`, `resource_downloads`, `publications`, `experts`, `cafe_threads`, `cafe_replies`, `events`, `webinars`, `committee_members`, `announcements`, `workshops`, `workshop_attendees`

RLS is enabled on every table. Role helper function and all policies are in `@spec/MPN/auth/README.md`.

---

## Environment variables needed

Add to `.env.local` and Vercel project settings:

```env
NEXT_PUBLIC_MPN_SUPABASE_URL=
NEXT_PUBLIC_MPN_SUPABASE_ANON_KEY=
MPN_SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
MPN_ADMIN_EMAIL=
```

Also add to `next.config.ts` remotePatterns:
```ts
{ hostname: '*.supabase.co' }
```

---

## Design tokens (from POC)

```css
--blue: #1B4384;    /* primary brand */
--green: #50B58B;   /* accent */
--navy: #0d1f3c;    /* dark backgrounds */
--cream: #faf9f7;   /* light backgrounds */
```

Fonts: **Poppins** (headings) + **Inter** (body)  
Full token reference: `@spec/MPN/frontend/design-system.md`

---

## Codebase conventions (non-negotiable)

- **Server Components by default.** Only add `"use client"` when strictly required (interactivity, browser APIs, real-time subscriptions)
- **`next/image`** for all images with `sizes` prop
- **Reuse `src/components/ui/`** primitives before creating new abstractions
- **Minimal diffs** — match existing naming, import patterns, and file structure
- **TypeScript** — honest types at Supabase query boundaries, no `any`
- **Performance bar** — Lighthouse Performance ≥ 80 on every MPN URL (Unlighthouse scan)
- Prefix all env vars with `MPN_` to avoid clashing with existing SCPH vars
- Prefix all API routes with `/api/mpn/` to avoid collisions

---

## What to implement first (Phase 1)

1. Supabase client setup: `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` using `@supabase/ssr`
2. Middleware extension in `middleware.ts` — protect `/community/mpn/admin/**` and redirect pending users away from Café posting
3. MPN root layout at `src/app/(scph)/community/mpn/layout.tsx`
4. Auth pages: `/community/mpn/login`, `/community/mpn/register`, `/community/mpn/pending`
5. DB trigger for auto-creating `profiles` row when email confirmation changes
   from unverified to verified
6. Basic landing page at `/community/mpn`

Full roadmap with task checklists: `@spec/MPN/deployment/roadmap.md`

---

## Feature specs (one file each)

- Resources: `@spec/MPN/features/resources.md`
- Publications: `@spec/MPN/features/publications.md`
- Experts: `@spec/MPN/features/experts.md`
- Virtual Café: `@spec/MPN/features/cafe.md`
- Members: `@spec/MPN/features/members.md`
- Admin dashboard: `@spec/MPN/features/admin.md`
- Storage (signed URLs, buckets): `@spec/MPN/storage/README.md`
- Emails (Resend): `@spec/MPN/email/README.md`
- API routes: `@spec/MPN/api/README.md`
