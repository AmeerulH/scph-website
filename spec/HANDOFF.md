# MPN Project Handoff

**Project:** Media Professional Network (MPN) — community portal for journalists who attended SCPH Capacity Development Workshops  
**Repo:** `scph-website` (Next.js 14, TypeScript, Tailwind, Sanity CMS)  
**Status:** Spec complete. Implementation not yet started.

---

## What Has Been Done

### 1. Spec folder created
All spec files live at `spec/MPN/` in the repo root. The master file is:

```
spec/
├── README.md                    ← top-level index (MPN done, SCPH/GTP planned)
├── HANDOFF.md                   ← this file
├── whatsapp-upgrade-message.md  ← team message about infrastructure costs
└── MPN/
    ├── MASTER.md                ← single comprehensive spec (read this first)
    ├── auth/README.md           ← roles, registration flow, RLS policies
    ├── database/README.md       ← full SQL for all 13 tables
    ├── api/README.md            ← Supabase query patterns + 13 API routes
    ├── storage/README.md        ← 6 storage buckets, signed URL flow
    ├── email/README.md          ← Resend setup, 7 email triggers
    ├── frontend/
    │   ├── README.md            ← component/route directory structure
    │   └── design-system.md     ← CSS tokens, fonts, breakpoints from POC
    ├── deployment/
    │   ├── README.md            ← Vercel/Supabase setup, env vars, Google indexing
    │   └── roadmap.md           ← 5-phase roadmap with checkbox task lists
    └── features/
        ├── resources.md
        ├── publications.md
        ├── experts.md
        ├── cafe.md
        ├── members.md
        └── admin.md
```

**Start with `spec/MPN/MASTER.md`** — it contains the full spec end-to-end.

---

## Key Decisions Made

### Architecture
- MPN is a **route within the existing SCPH Next.js app** — NOT a separate application or deployment
- URL: `/community/mpn` on `sunwayplanetaryhealth.com`
- Code lives at: `src/app/(scph)/community/mpn/`
- Components at: `src/components/mpn/`
- API routes at: `src/app/api/mpn/`
- Same Vercel project as SCPH — MPN ships with every SCPH deploy

### Database
- Separate **Supabase project** (not shared with any existing SCPH Sanity store)
- **13 PostgreSQL tables** with RLS enabled on all
- Full-text search via `tsvector` GENERATED columns + GIN indexes on resources, publications, experts
- Triggers for `reply_count` and `download_count`
- See `spec/MPN/database/README.md` for complete SQL

### Access Model (3 tiers)
| Who | What they can do |
|-----|-----------------|
| Public (not logged in) | Browse everything read-only. No PDF downloads, no contact emails, no Café posting |
| Authenticated (logged in, any status) | Download PDFs, see contact emails |
| Pending (registered, not yet approved) | Same as authenticated. Cannot post in Café or submit publications |
| Member (approved) | Full access — post in Café, submit publications |
| Admin | Everything + admin dashboard |

### Virtual Café
- **Publicly readable** (like Reddit) — anyone can read threads and replies
- **Members only** for posting/replying
- Pending users see "Your membership is awaiting approval" instead of reply form
- Real-time via Supabase Realtime channel (read-only stream for non-members)

### Expert Directory
- Publicly visible (name, photo, role, org, expertise, LinkedIn)
- Email gated to logged-in users only (RLS gates the `email` column)

### Google Indexing
Public MPN pages should be added to `src/app/sitemap.ts` and `src/lib/public-indexable-paths.ts`:
- `/community/mpn` (landing)
- `/community/mpn/resources` + `/community/mpn/resources/[id]`
- `/community/mpn/publications` + `/community/mpn/publications/[id]`
- `/community/mpn/experts` + `/community/mpn/experts/[id]`
- `/community/mpn/members`
- `/community/mpn/committee`
- `/community/mpn/cafe` + `/community/mpn/cafe/[id]`
- `/community/mpn/events`
- `/community/mpn/webinars`

Pages to **noindex**: `/community/mpn/login`, `/community/mpn/pending`, `/community/mpn/profile`, `/community/mpn/admin/**`, `/community/mpn/publications/submit`

---

## Infrastructure Costs (Decided)

| Service | Plan | Cost | Why |
|---------|------|------|-----|
| Supabase | Pro | $25/month | Free tier pauses after 1 week inactivity, no backups — not safe for production |
| Vercel | Pro | $20/month | Free (Hobby) plan prohibits commercial/org use; SCPH is an organisation |
| **Total** | | **$45/month** | |

The team WhatsApp message explaining this is at `spec/whatsapp-upgrade-message.md`.

---

## Environment Variables Needed
Add these to the existing SCPH `.env.local` and Vercel project settings:

```env
NEXT_PUBLIC_MPN_SUPABASE_URL=        # MPN Supabase project URL
NEXT_PUBLIC_MPN_SUPABASE_ANON_KEY=   # MPN public anon key
MPN_SUPABASE_SERVICE_ROLE_KEY=       # MPN admin key — server only, never in browser
RESEND_API_KEY=                       # May already exist in SCPH project
MPN_ADMIN_EMAIL=                      # Email(s) for new pending member alerts
```

Also add MPN Supabase CDN to `next.config.ts` `remotePatterns`:
```ts
{ hostname: '*.supabase.co' }
```

---

## Design System (from POC)

CSS tokens to use in MPN components:
```css
--blue: #1B4384;    /* primary brand */
--green: #50B58B;   /* accent */
--navy: #0d1f3c;    /* dark backgrounds */
--cream: #faf9f7;   /* light backgrounds */
```

Fonts: **Poppins** (headings) + **Inter** (body)  
Breakpoints: 900px (tablet) / 640px (mobile)

Full token reference: `spec/MPN/frontend/design-system.md`

---

## Implementation Roadmap (5 Phases)

**Phase 1 — Foundation**
- Supabase project setup (schema, RLS, storage buckets)
- Auth flow (register → email verify → pending → admin approve → member)
- Basic layout + nav for MPN section

**Phase 2 — Core Features**
- Resources library (list + detail + PDF download)
- Expert directory (public grid + gated email)
- Member directory

**Phase 3 — Community**
- Virtual Café (thread list + detail + real-time replies)
- Publications (submit + moderation + public listing)
- Events + Webinars pages

**Phase 4 — Admin**
- Admin dashboard (member approval, resource management, publication moderation, announcements, analytics)

**Phase 5 — Polish**
- Google indexing (sitemap, noindex pages)
- Lighthouse Performance ≥ 80 (per AGENTS.md contract)
- Emails (Resend — welcome, rejection, approval notification, etc.)
- Full Unlighthouse scan

Detailed task checklists: `spec/MPN/deployment/roadmap.md`

---

## SCPH Codebase Conventions (Important)

Before writing any code, read:
- `AGENTS.md` — master reference for the whole project
- `docs/coding-guidelines.md` — Server Components by default, `"use client"` only when needed
- `docs/design-system.md` — existing SCPH tokens (MPN extends these)

Key patterns:
- App Router under `src/app/`. SCPH routes: `src/app/(scph)/`
- Server Components by default; Client Components only for interactivity (real-time, tabs, forms)
- Images: `next/image` with `sizes` prop
- Reuse `src/components/ui/` primitives before creating new ones
- TypeScript: honest types at Supabase/GROQ boundaries

---

## What's Next

1. **Upgrade Supabase** to Pro plan and create the MPN Supabase project
2. **Upgrade Vercel** to Pro plan
3. **Run schema SQL** from `spec/MPN/database/README.md` in Supabase SQL editor
4. **Configure RLS** per `spec/MPN/auth/README.md`
5. **Create storage buckets** per `spec/MPN/storage/README.md`
6. **Start Phase 1 implementation** in the SCPH repo under `src/app/(scph)/community/mpn/`
