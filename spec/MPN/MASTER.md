# Media Professional Network — Master Technical Specification

**Sunway Centre for Planetary Health · Community Portal**  
Version 1.1 · August 2026  
Stack: Next.js 14 · Supabase · Vercel · TypeScript · Tailwind CSS

> **Detailed specs** live in the subfolders alongside this file. This document is the single-file reference for sharing and onboarding.

### Changelog
- **v1.1** — MPN moved to a route within the SCPH app (not a separate application). Revised access model: most content is publicly viewable; only interactions and sensitive data require login. Virtual Café is public read-only (Reddit-style). Members and expert directory are public-facing.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Site Structure & Routes](#3-site-structure--routes)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Database Schema](#5-database-schema)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [API Design](#7-api-design)
8. [File Storage](#8-file-storage)
9. [Real-time Features](#9-real-time-features)
10. [Feature Specs](#10-feature-specs)
11. [Frontend Architecture](#11-frontend-architecture)
12. [UI Design System](#12-ui-design-system)
13. [Email Notifications](#13-email-notifications)
14. [SCPH Integration & Deployment](#14-scph-integration--deployment)
15. [Development Roadmap](#15-development-roadmap)
16. [Open Questions](#16-open-questions)

---

## 1. Project Overview

The Media Professional Network (MPN) is a community portal for journalists connected to SCPH's Capacity Development Journalist Workshops. It serves two audiences: the general public (browse and discover) and verified journalist members (interact, collaborate, and access gated content).

MPN is a **route within the existing SCPH Next.js application** — not a separate app. It lives at `/community/mpn` under the SCPH site, uses the same Vercel deployment, and follows all existing SCPH conventions (`AGENTS.md`). It has its own Supabase project for MPN-specific member data.

### Goals

- Give the public a window into SCPH's journalist network — resources, publications, experts, events
- Provide verified workshop alumni with a trusted space to collaborate, download gated materials, and interact
- Surface a searchable expert directory open to everyone
- Foster peer collaboration through the Virtual Café (public read, members interact)
- Give SCPH admins full content management and member governance tools

### Scope (v1.0)

- **Public browsing:** resources catalogue, publications, expert directory, members list, events, webinars, Virtual Café (read-only)
- Member registration, email verification, and admin approval workflow
- **Gated interactions:** PDF downloads, café posting/replying, publication submission, member contact details
- Expert directory with public profiles; contact details visible to logged-in users
- Virtual Café — read-only for public, full interaction for members (Reddit-style)
- Admin dashboard: members, content, announcements, analytics
- Full mobile-responsive UI following the approved HTML prototype (`media-portal-demo.html`)

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | React framework; SSR + RSC for gated pages |
| Language | TypeScript | Type safety across frontend and API layer |
| Styling | Tailwind CSS | Matches existing SCPH codebase conventions |
| Database | Supabase (PostgreSQL) | Relational data; complex filtered queries |
| Auth | Supabase Auth | Email/password, magic link, admin approval gate |
| Storage | Supabase Storage | PDFs, profile photos, workshop materials |
| Real-time | Supabase Realtime | Virtual Café live reply feed |
| Search | PostgreSQL tsvector | Full-text search; no additional service needed |
| Email | Resend | Transactional emails (approval, announcements, notifications) |
| Deployment | Vercel | Consistent with existing SCPH deployment |

> MPN reuses SCPH's Tailwind config, font tokens (Poppins + Inter), and brand colours. It does **not** share the Sanity project — MPN member data lives entirely in Supabase.

---

## 3. Site Structure & Routes

MPN is a route group within the SCPH Next.js app at `/community/mpn`. All routes below are relative to that base.

### Access Tiers

| Tier | Who | What they can do |
|------|-----|-----------------|
| **Public** | Anyone, no login | Browse and read all content (resources list, publications, experts, members, café threads, events, webinars) |
| **Logged in** | Authenticated users (any role) | Download PDFs, see member contact emails |
| **Member** | Approved workshop alumni | Post/reply in Café, submit publications, full profile |
| **Admin** | SCPH staff | Full portal + Admin dashboard |

### Route Table

| Route | Public | Logged in | Member | Admin | Notes |
|-------|--------|-----------|--------|-------|-------|
| `/community/mpn` | ✅ | ✅ | ✅ | ✅ | Landing / About |
| `/community/mpn/resources` | ✅ | ✅ | ✅ | ✅ | Browse catalogue |
| `/community/mpn/resources/[id]` | ✅ browse | ✅ download PDF | ✅ | ✅ | PDF download gated |
| `/community/mpn/resources/workshop/[id]` | ✅ browse | ✅ download | ✅ | ✅ | Workshop materials |
| `/community/mpn/publications` | ✅ | ✅ | ✅ | ✅ | Browse approved pubs |
| `/community/mpn/publications/[id]` | ✅ | ✅ | ✅ | ✅ | Read full publication |
| `/community/mpn/publications/submit` | ❌ | ❌ | ✅ | ✅ | Members only |
| `/community/mpn/experts` | ✅ | ✅ | ✅ | ✅ | Browse directory |
| `/community/mpn/experts/[id]` | ✅ profile | ✅ + contact email | ✅ | ✅ | Email gated |
| `/community/mpn/cafe` | ✅ read | ❌ | ✅ post thread | ✅ | Members post, public reads |
| `/community/mpn/cafe/[id]` | ✅ read | ❌ | ✅ reply | ✅ | Members reply, public reads |
| `/community/mpn/events` | ✅ | ✅ | ✅ | ✅ | Fully public |
| `/community/mpn/webinars` | ✅ | ✅ | ✅ | ✅ | Watch videos |
| `/community/mpn/members` | ✅ | ✅ | ✅ | ✅ | Contact email gated |
| `/community/mpn/committee` | ✅ | ✅ | ✅ | ✅ | Fully public |
| `/community/mpn/profile` | ❌ | ✅ | ✅ | ✅ | Own profile |
| `/community/mpn/admin` | ❌ | ❌ | ❌ | ✅ | Admin only |
| `/community/mpn/admin/members` | ❌ | ❌ | ❌ | ✅ | |
| `/community/mpn/admin/resources` | ❌ | ❌ | ❌ | ✅ | |
| `/community/mpn/admin/publications` | ❌ | ❌ | ❌ | ✅ | |
| `/community/mpn/admin/announcements` | ❌ | ❌ | ❌ | ✅ | |
| `/community/mpn/admin/analytics` | ❌ | ❌ | ❌ | ✅ | |

---

## 4. User Roles & Permissions

| Role | Who | Access |
|------|-----|--------|
| `public` | Unauthenticated visitors | Browse all public content (read-only) |
| `authenticated` | Logged in, any status | Download PDFs, see contact emails, post/reply in Café |
| `pending` | Registered, awaiting approval | Same as authenticated; cannot submit publications yet |
| `member` | Approved workshop alumni | Full access — submit publications, full profile |
| `admin` | SCPH staff | Full portal + Admin dashboard |

### What Requires Login vs What Is Public

**Always public (no login):**
- Browse resources, publications, expert directory, members list, committee, events, webinars
- Read Virtual Café threads and replies
- View expert profiles, member cards (minus contact details)

**Requires login (any authenticated user):**
- Download PDFs from resources / publications
- View member email addresses (where `email_visible = true`)
- View expert contact email

**Requires member role (approved journalist):**
- Post new threads or reply in Virtual Café
- Submit publications
- Access own profile page
- View workshop-specific materials (workshop alumni only)

**Requires admin role:**
- Admin dashboard and all sub-panels

### Registration & Approval Flow

1. User fills registration form (name, email, password, organisation, country, workshop attended)
2. Supabase Auth sends email verification link
3. On email confirmation → DB trigger creates `profiles` row with `role = 'pending'`
4. Admin receives notification email
5. Admin reviews in dashboard → Approve or Reject (+ optional reason)
6. On approval → `role = 'member'` → welcome email sent
7. On rejection → `role = 'rejected'` → rejection email with reason

> Pending users can browse and interact with the Café like any logged-in user. They just cannot submit publications until approved.

---

## 5. Database Schema

All tables in the `public` schema. UUIDs as primary keys. `auth.users` managed by Supabase Auth.

### profiles
```sql
CREATE TABLE profiles (
  id                uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         text NOT NULL,
  email             text NOT NULL,
  organisation      text,
  country           text,
  role              text NOT NULL DEFAULT 'pending'
                    CHECK (role IN ('pending', 'member', 'admin', 'rejected')),
  workshop_id       uuid REFERENCES workshops(id),
  bio               text,
  profile_photo_url text,
  linkedin_url      text,
  email_visible     boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
```

### workshops
```sql
CREATE TABLE workshops (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number            integer NOT NULL,
  title             text NOT NULL,
  date              date NOT NULL,
  location          text NOT NULL,
  participant_count integer,
  description       text,
  cover_image_url   text,
  created_at        timestamptz NOT NULL DEFAULT now()
);
```

### resources
```sql
CREATE TABLE resources (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  description    text,
  type           text NOT NULL,   -- Research | Report | Toolkit | Guide | Dataset | Book | Video
  theme          text NOT NULL,   -- Climate | Air Pollution | Planetary Health | …
  source         text,
  published_date date,
  article_url    text,
  file_url       text,            -- Supabase Storage path
  visibility     text NOT NULL DEFAULT 'members'
                 CHECK (visibility IN ('members', 'workshop_alumni', 'admins')),
  workshop_id    uuid REFERENCES workshops(id),
  uploaded_by    uuid NOT NULL REFERENCES profiles(id),
  download_count integer NOT NULL DEFAULT 0,
  tags           text[],
  search_vector  tsvector GENERATED ALWAYS AS (
                   to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(theme,''))
                 ) STORED,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX resources_search_idx ON resources USING GIN(search_vector);
```

### publications
```sql
CREATE TABLE publications (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  author_id      uuid NOT NULL REFERENCES profiles(id),
  outlet         text,
  published_date date,
  country        text,
  language       text,
  type           text NOT NULL,   -- Article | Feature | Research Paper | Op-Ed | Investigative
  theme          text NOT NULL,
  description    text,
  tags           text[],
  article_url    text,
  pdf_url        text,
  status         text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by    uuid REFERENCES profiles(id),
  reviewed_at    timestamptz,
  view_count     integer NOT NULL DEFAULT 0,
  search_vector  tsvector GENERATED ALWAYS AS (
                   to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(theme,''))
                 ) STORED,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX publications_search_idx ON publications USING GIN(search_vector);
```

### experts
```sql
CREATE TABLE experts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         text NOT NULL,
  role              text NOT NULL,
  organisation      text NOT NULL,
  country           text NOT NULL,
  expertise         text[],
  bio               text,
  email             text,
  linkedin_url      text,
  photo_url         text,
  publication_count integer NOT NULL DEFAULT 0,
  is_active         boolean NOT NULL DEFAULT true,
  search_vector     tsvector GENERATED ALWAYS AS (
                      to_tsvector('english',
                        coalesce(full_name,'') || ' ' || coalesce(role,'') || ' ' ||
                        coalesce(organisation,'') || ' ' || array_to_string(coalesce(expertise,'{}'), ' ')
                      )
                    ) STORED,
  created_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX experts_search_idx ON experts USING GIN(search_vector);
```

### cafe_threads
```sql
CREATE TABLE cafe_threads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  body         text NOT NULL,
  author_id    uuid NOT NULL REFERENCES profiles(id),
  category     text NOT NULL
               CHECK (category IN ('Story Ideas','Data & Sources','Expert Contacts','Collaboration','Announcements')),
  reply_count  integer NOT NULL DEFAULT 0,
  is_pinned    boolean NOT NULL DEFAULT false,
  is_locked    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
```

### cafe_replies
```sql
CREATE TABLE cafe_replies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid NOT NULL REFERENCES cafe_threads(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES profiles(id),
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Trigger increments cafe_threads.reply_count on insert
```

### events
```sql
CREATE TABLE events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  type             text NOT NULL CHECK (type IN ('Workshop','Webinar','Conference','Networking')),
  status           text NOT NULL CHECK (status IN ('upcoming','past')),
  date             date NOT NULL,
  location         text,
  description      text,
  cover_image_url  text,
  registration_url text,
  is_members_only  boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);
```

### webinars
```sql
CREATE TABLE webinars (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  speaker          text,
  date             date,
  duration_minutes integer,
  theme            text,
  video_url        text,    -- YouTube/Vimeo embed URL
  thumbnail_url    text,
  description      text,
  created_at       timestamptz NOT NULL DEFAULT now()
);
```

### announcements
```sql
CREATE TABLE announcements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  body       text NOT NULL,
  author_id  uuid NOT NULL REFERENCES profiles(id),
  audience   text NOT NULL DEFAULT 'all',   -- 'all' | 'workshop:1' | 'country:MY'
  priority   text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal','important','urgent')),
  status     text NOT NULL DEFAULT 'draft'  CHECK (status IN ('draft','sent')),
  sent_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### committee_members
```sql
CREATE TABLE committee_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    text NOT NULL,
  role         text NOT NULL,
  organisation text,
  country      text,
  photo_url    text,
  bio          text,
  sort_order   integer NOT NULL DEFAULT 0,
  is_active    boolean NOT NULL DEFAULT true
);
```

### resource_downloads (audit log)
```sql
CREATE TABLE resource_downloads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id   uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles(id),
  downloaded_at timestamptz NOT NULL DEFAULT now()
);
-- Trigger increments resources.download_count on insert
```

---

## 6. Authentication & Authorization

### Supabase Auth Config
- Provider: Email/Password (primary); Magic Link (optional)
- Email confirmation required before profile is created
- Session: JWT in httpOnly cookie via `@supabase/ssr`

### Next.js Middleware
```ts
export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()
  const role = session?.user?.user_metadata?.role ?? 'public'
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin') && role !== 'admin')
    return NextResponse.redirect(new URL('/login', request.url))

  if (isMemberRoute(path) && !['member', 'admin'].includes(role))
    return NextResponse.redirect(new URL(role === 'pending' ? '/pending' : '/login', request.url))
}
```

### Row Level Security (RLS)

RLS enabled on every table. Access enforced at the DB level.

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Public (basic fields); full row for own + admins | Trigger only | Own row; admins update role | Admins only |
| `resources` | Public (list/detail); file_url gated to authenticated | Admins only | Admins only | Admins only |
| `publications` | Public (approved only) | Members (own) | Own pending; admins all | Admins only |
| `experts` | Public (profile); email field gated to authenticated | Admins only | Admins only | Admins only |
| `cafe_threads` | Public | Members only | Own + admins | Own + admins |
| `cafe_replies` | Public | Members only | Own only | Own + admins |
| `events` | Public (all) | Admins | Admins | Admins |
| `webinars` | Public | Admins | Admins | Admins |
| `committee_members` | Public | Admins | Admins | Admins |
| `announcements` | Members (sent only) | Admins | Admins | Admins |

---

## 7. API Design

Supabase PostgREST handles standard CRUD. Custom Next.js API routes are only written for complex multi-step operations.

### Custom API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Create auth user + set metadata |
| POST | `/api/auth/approve` | Admin | Set role to member; send welcome email |
| POST | `/api/auth/reject` | Admin | Set role to rejected; send email with reason |
| POST | `/api/resources/upload` | Admin | Upload to Storage; create resource row |
| GET | `/api/resources/[id]/download` | Member | Validate access; log download; return 60s signed URL |
| POST | `/api/publications/submit` | Member | Create publication (status=pending); notify admins |
| POST | `/api/publications/[id]/review` | Admin | Approve or reject; email author |
| POST | `/api/announcements/send` | Admin | Email target audience via Resend; mark sent |
| GET | `/api/search` | Member | Full-text search across resources, publications, experts |
| POST | `/api/cafe/threads` | Member | Create thread (validates body, category) |
| POST | `/api/cafe/[id]/replies` | Member | Add reply; check thread not locked |
| GET | `/api/admin/stats` | Admin | KPI stats for dashboard |
| POST | `/api/profile/photo` | Member | Upload photo to Storage; update profile row |

All routes return `{ data: {...} | null, error: { code, message } | null }`.

---

## 8. File Storage

| Bucket | Access | Contents | Max size |
|--------|--------|----------|----------|
| `resources` | Gated (signed URLs) | Resource PDFs, DOCX | 25 MB |
| `publications` | Gated (signed URLs) | Publication PDFs | 25 MB |
| `workshop-materials` | Gated (signed URLs) | Slides, handouts, photos | 50 MB |
| `avatars` | Public | Profile photos | 5 MB |
| `expert-photos` | Public | Expert directory headshots | 5 MB |
| `event-covers` | Public | Event banners | 10 MB |

Gated files are served via 60-second signed URLs generated server-side. The URL is never stored — generated fresh per download request after session + RLS validation.

---

## 9. Real-time Features

Virtual Café thread detail page subscribes to new replies via Supabase Realtime. Initial reply list is server-rendered; new replies stream in without refresh.

```ts
const channel = supabase
  .channel(`thread-${threadId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'cafe_replies',
    filter: `thread_id=eq.${threadId}`
  }, (payload) => {
    setReplies(prev => [...prev, payload.new])
  })
  .subscribe()
```

---

## 10. Feature Specs

### Resources Library
- **Routes:** `/resources`, `/resources/[id]`, `/resources/workshop/[id]`
- **UI:** Filter sidebar (sticky, collapsible mobile), Shared/Workshop tabs, resource cards (title, type badge, theme, source, download count)
- **Detail:** description, tags, download button (→ signed URL), external article link
- **Workshop detail:** cover image, Materials tab + Gallery tab with lightbox
- **Filters:** Type (Research, Report, Toolkit, Guide, Dataset, Book, Video) · Theme (Climate, Air Pollution, Planetary Health, Water, Biodiversity, Food Systems)
- **Download flow:** click → `/api/resources/[id]/download` → signed URL → opens in new tab

### Publications
- **Routes:** `/publications`, `/publications/[id]`, `/publications/submit`
- **UI:** Filter sidebar, publication cards with author info, author hover card on detail page
- **Submit form:** Title, Outlet, Date, Country, Language, Type, Theme, Description, Tags, Article URL or PDF (at least one required)
- **Moderation:** pending → admin reviews → approved (appears in catalogue + email) or rejected (email with reason)
- **Filters:** Type, Theme, Country, Language (last two populated dynamically from DB)

### Expert Directory
- **Routes:** `/experts`, `/experts/[id]`
- **UI:** Filter sidebar (expertise tag, country), expert grid cards, detail with contact buttons
- **Author hover card:** fetches expert on `mouseenter`, `position: fixed` near cursor
- **Contact:** Email copies to clipboard → toast; LinkedIn opens new tab
- **Filters:** Expertise tags and countries populated dynamically

### Virtual Café
- **Routes:** `/community/mpn/cafe`, `/community/mpn/cafe/[id]`
- **Public (Reddit-style):** Thread list and full thread detail (body + all replies) are visible to everyone without login. A "Join to participate" banner appears for logged-out visitors.
- **To post or reply:** must be logged in (any role, including pending). Prompts sign-up/login with context ("Join the network to join the conversation").
- **UI:** Category tabs (All · Story Ideas · Data & Sources · Expert Contacts · Collaboration · Announcements), thread rows with pinned/locked indicators
- **Thread detail:** body, reply feed (real-time for logged-in users), reply form shown only when authenticated (replaced by login prompt when logged out)
- **New thread form:** title, body (min 20 chars), category — accessible to authenticated users
- **Admin controls:** pin/unpin, lock/unlock, delete thread

### Events & Webinars
- **Events** (`/events`): Public page, Upcoming/Past tabs, members-only badge for logged-out visitors, manual status management by admin
- **Webinars** (`/webinars`): Members only, theme filter, video modal with YouTube/Vimeo iframe embed

### Members & Committee
- **Members list** (`/community/mpn/members`): **Publicly visible.** Client-side search by name/org, country filter, profile modal on click. Email shown only to logged-in users where `email_visible = true`.
- **Committee** (`/community/mpn/committee`): **Fully public.** Simple grid sorted by `sort_order`.
- **Expert directory** (`/community/mpn/experts`): **Fully public.** Expert contact email visible only to logged-in users.
- **Profile** (`/community/mpn/profile`): Requires login. View + inline edit (name, org, country, bio, LinkedIn, email visibility toggle), photo upload, own publications list with status badges.

### Admin Dashboard
- **Layout:** Left sidebar (6 items) on desktop; horizontal tab strip on mobile
- **Overview:** 7 KPI stat cards (total members, pending approvals, resources, publications, pending publications, downloads 30d, active threads)
- **Members panel:** Pending/Active/Rejected tabs; approve/reject with reason modal; suspend action
- **Resources panel:** Table with upload form, edit metadata, delete, filter
- **Publications panel:** Pending moderation queue with review modal; approve/reject triggers email
- **Announcements panel:** Draft composer (title, body, audience, priority); send triggers Resend batch email to target audience
- **Analytics panel:** Downloads over time, top resources/publications, member growth, active threads — SQL aggregates + Recharts charts

---

## 11. Frontend Architecture

### Directory Structure

MPN lives inside the existing SCPH app. All MPN code is colocated under `community/mpn/` and `components/mpn/`.

```
src/
├── app/
│   └── (scph)/                          # Existing SCPH route group
│       └── community/
│           └── mpn/                     # MPN root
│               ├── layout.tsx           # MPN nav + footer wrapper
│               ├── page.tsx             # Landing / About
│               ├── resources/
│               │   ├── page.tsx
│               │   ├── [id]/page.tsx
│               │   └── workshop/[id]/page.tsx
│               ├── publications/
│               │   ├── page.tsx
│               │   ├── [id]/page.tsx
│               │   └── submit/page.tsx  # Member only (middleware check)
│               ├── experts/
│               │   ├── page.tsx
│               │   └── [id]/page.tsx
│               ├── cafe/
│               │   ├── page.tsx
│               │   └── [id]/page.tsx
│               ├── events/page.tsx
│               ├── webinars/page.tsx
│               ├── members/page.tsx
│               ├── committee/page.tsx
│               ├── profile/page.tsx     # Requires login
│               ├── login/page.tsx
│               ├── pending/page.tsx
│               └── admin/               # Requires admin role
│                   ├── page.tsx
│                   ├── members/page.tsx
│                   ├── resources/page.tsx
│                   ├── publications/page.tsx
│                   ├── announcements/page.tsx
│                   └── analytics/page.tsx
├── app/api/mpn/                         # MPN-specific API routes (prefixed to avoid clash)
│   ├── auth/register/route.ts
│   ├── auth/approve/route.ts
│   ├── auth/reject/route.ts
│   ├── resources/upload/route.ts
│   ├── resources/[id]/download/route.ts
│   ├── publications/submit/route.ts
│   ├── publications/[id]/review/route.ts
│   ├── announcements/send/route.ts
│   ├── search/route.ts
│   ├── cafe/threads/route.ts
│   ├── cafe/[id]/replies/route.ts
│   ├── admin/stats/route.ts
│   └── profile/photo/route.ts
└── components/mpn/                      # All MPN components colocated here
    ├── nav/                             # MPN FloatingNav, MobileMenu
    ├── ui/                             # MPN-specific UI primitives
    ├── filter/                         # FilterSidebar, FilterBtn
    ├── resources/
    ├── publications/
    ├── experts/
    ├── cafe/
    ├── events/
    ├── members/
    └── admin/
```

### Server vs Client Components

| Component | Type | Reason |
|-----------|------|--------|
| All page components | Server | Data fetching at request time |
| FilterSidebar | Client | Active filter state |
| ReplyFeed (Café) | Client | Supabase Realtime subscription |
| FloatingNav / MobileMenu | Client | Toggle state |
| Upload forms | Client | File API + FormData |
| Admin tables | Client | Optimistic UI after actions |
| ExpertHoverCard | Client | mouseenter/mousemove positioning |
| VideoModal (Webinars) | Client | Open/close state |

---

## 12. UI Design System

Source of truth: `media-portal-demo.html` (approved prototype). No new design decisions in implementation.

### Brand Colours

```css
:root {
  --blue:  #1B4384;   /* primary CTAs, active nav, table headers */
  --green: #50B58B;   /* success states, stat highlights */
  --navy:  #0d1f3c;   /* hero backgrounds, dark sections */
  --cream: #faf9f7;   /* page background */
  --text:  #1e293b;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --r: 10px;          /* card border radius */
  --bar-h: 64px;      /* floating nav height */
}
```

### Typography

| Use | Font | Weight | Size |
|-----|------|--------|------|
| H1 | Poppins | 700 | 2rem |
| H2 | Poppins | 600 | 1.5rem |
| Card title | Poppins | 600 | 1.125rem |
| Body | Inter | 400 | 0.9375rem |
| Label | Inter | 500 | 0.8125rem |
| Button | Inter | 600 | 0.875rem |
| Badge | Inter | 600 | 0.75rem |

### Key UI Patterns

**Floating Nav:** `position: fixed; top: 10px; border-radius: 100px` pill — matches GTP programmes page  
**Filter Sidebar:** `position: sticky; height: calc(100vh - ...); overflow-y: auto` — collapsible on mobile  
**Author Hover Card:** `position: fixed; pointer-events: none; z-index: 9999` — follows cursor  
**Toast:** Bottom-right, `background: var(--navy)`, auto-dismisses after 3s

### Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| > 900px | Full layout: sidebar + content, horizontal nav |
| 640–900px | Sidebar collapses, nav stays horizontal |
| < 640px | Hamburger nav, filter sidebar hidden behind toggle, single-column |

---

## 13. Email Notifications

Sent via Resend. Supabase Auth handles verification and password reset natively.

| Trigger | To | Description |
|---------|-----|-------------|
| User verifies email | Admins | New pending member alert |
| Admin approves | New member | Welcome email + portal link |
| Admin rejects | Applicant | Rejection with reason |
| Admin sends announcement | Target audience | Announcement body |
| Publication approved | Author | Confirmation + link |
| New Café reply on own thread | Thread author | Digest (v2) |

Announcement audience targeting: `all` → all members, `workshop:1` → members from workshop 1, `country:MY` → Malaysian members. Resend batch sends in chunks of 100.

---

## 14. SCPH Integration & Deployment

### Architecture

MPN is a **route group within the existing SCPH Next.js app** — not a separate application.

- **URL:** `sunwayplanetaryhealth.com/community/mpn` (same domain, same deployment)
- **Code location:** `src/app/(scph)/community/mpn/` following existing SCPH App Router conventions
- **Deployment:** Same Vercel project as SCPH — no separate deploy needed
- **Design system:** Inherits SCPH's Tailwind config, fonts, and brand tokens automatically
- **Sanity:** Not used for MPN member data. The existing SCPH Sanity project may optionally power the MPN landing/about page copy.
- **Supabase:** MPN uses its **own Supabase project** (separate from any SCPH Sanity/data store) for member profiles, resources, publications, café, etc.

### SCPH Conventions to Follow

Per `AGENTS.md`:
- App Router under `src/app/` — Server Components by default, `"use client"` only when needed
- Route group `(scph)` already exists — MPN routes nest inside it
- `next/image` for all images with `remotePatterns` added for Supabase CDN in `next.config.ts`
- Colocate MPN components under `src/components/mpn/`
- MPN API routes under `src/app/api/mpn/` to avoid clashing with existing SCPH API routes

### Environment Variables (add to existing SCPH .env.local)

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_MPN_SUPABASE_URL` | Client + Server | MPN Supabase project URL |
| `NEXT_PUBLIC_MPN_SUPABASE_ANON_KEY` | Client + Server | MPN public anon key |
| `MPN_SUPABASE_SERVICE_ROLE_KEY` | Server only | MPN admin key — never in browser |
| `RESEND_API_KEY` | Server only | Email API key (may already exist in SCPH) |
| `MPN_ADMIN_EMAIL` | Server only | Receives pending member alerts |

### Setup Steps
1. Create MPN Supabase project → run schema SQL → enable RLS → create Storage buckets
2. Configure Supabase Auth (email confirmation on, set site URL to SCPH domain)
3. Add MPN env vars to existing SCPH Vercel project
4. Add `cdn.supabase.co` to `remotePatterns` in `next.config.ts`
5. Create route group `src/app/(scph)/community/mpn/` with layouts and pages
6. Add MPN link to SCPH Community nav item

---

## 15. Development Roadmap

### Phase 1 — Foundation (Weeks 1–2)
Supabase setup (tables, RLS, buckets, triggers), Next.js scaffold, auth flows (register/verify/pending), middleware, admin approval flow, seed scripts for workshops/experts/committee.

### Phase 2 — Core Member Pages (Weeks 3–4)
Resources (list, filter, detail, download), publications (list, filter, detail, submit form), expert directory, profile page (view + edit + photo), events page.

### Phase 3 — Community Features (Week 5)
Virtual Café (threads, real-time replies), webinars, members list, committee directory, global search overlay.

### Phase 4 — Admin Panel (Week 6)
All 6 admin panels: overview stats, member management, resource management, publication moderation, announcement composer, analytics charts.

### Phase 5 — Polish & Launch (Week 7)
Mobile responsive QA, email template polish, accessibility audit, Lighthouse ≥ 80 on all routes, bulk member import, staging review, production deploy + DNS.

### Post-launch (v2)
Café reply email digest, Google OAuth, expert self-registration, public expert directory, member privacy controls.

---

## 16. Open Questions

Resolve before Phase 1 kicks off:

| # | Question | Decision | Options / Notes |
|---|----------|----------|-----------------|
| 1 | ~~URL structure~~ | ✅ **Resolved** | `/community/mpn` under SCPH domain |
| 2 | Magic link login | ❓ | Alongside email/password, or password only? |
| 3 | Social login | ❓ | Google OAuth to simplify journalist onboarding? |
| 4 | Workshop verification | ❓ | Manual admin confirmation vs self-reported + review? |
| 5 | Public PDF resources | ❓ | Are all resource PDFs downloadable by logged-in users, or are some truly public (no login)? |
| 6 | Announcement emails | ❓ | Real-time per event or daily/weekly digest? |
| 7 | Expert profile creation | ❓ | Admin-only or can experts self-register? |
| 8 | Existing member import | ❓ | Bulk import past workshop attendees at launch? |
| 9 | Café for pending users | ✅ **Resolved** | Pending users **cannot** post or reply in the Café. Must be approved member. |
| 10 | Google indexing | ✅ **Resolved** | Public MPN pages (experts, publications, events, members, café) **should be indexed** by Google. Add to `src/app/sitemap.ts`. |
