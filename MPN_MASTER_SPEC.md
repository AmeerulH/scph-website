# Media Professional Network — Master Technical Specification

**Sunway Centre for Planetary Health · Community Portal**  
Version 1.0 · August 2026  
Stack: Next.js · Supabase · Vercel · TypeScript · Tailwind CSS

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Site Structure & Routes](#3-site-structure--routes)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Database Schema](#5-database-schema-supabase--postgresql)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [API Design](#7-api-design)
8. [File Storage Strategy](#8-file-storage-strategy)
9. [Real-time Features](#9-real-time-features)
10. [Next.js Component Architecture](#10-nextjs-component-architecture)
11. [UI Design System](#11-ui-design-system)
12. [Email Notifications](#12-email-notifications)
13. [Integration with SCPH Website](#13-integration-with-scph-website)
14. [Environment Variables](#14-environment-variables)
15. [Development Roadmap](#15-development-roadmap)
16. [Open Questions & Decisions Required](#16-open-questions--decisions-required)

---

## 1. Project Overview

The Media Professional Network (MPN) is a gated community portal for journalists who have attended SCPH's Capacity Development Journalist Workshops. It provides a centralised hub for resources, publications, expert directories, peer collaboration, and network management.

MPN lives under the Community tab of the main SCPH website (sunwayplanetaryhealth.com). It is built as a separate Next.js application within the same Vercel organisation, sharing the SCPH design system but backed by its own Supabase project.

### 1.1 Goals

- Provide workshop alumni with a private, trusted space to access SCPH research and toolkits
- Enable members to publish and share their journalism and research
- Surface a searchable expert directory for source discovery
- Foster peer collaboration through a moderated Virtual Café discussion space
- Give SCPH admins full content management and member governance tools

### 1.2 Scope (v1.0)

- Member registration, email verification, and admin approval workflow
- Gated resources library (shared + workshop-specific)
- Publications catalogue with submission and moderation flow
- Expert directory with contact facilitation
- Virtual Café with threaded discussions and real-time replies
- Events and webinar library
- Admin dashboard: members, content, announcements, analytics
- Full mobile-responsive UI following the approved POC design

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
| Email | Supabase + Resend | Transactional emails (verification, approval, announcements) |
| Deployment | Vercel | Consistent with existing SCPH deployment |
| CMS (optional) | Sanity (shared) | For any marketing copy on the MPN landing/about page |

> **Note:** MPN reuses SCPH's Tailwind config, font tokens (Poppins + Inter), and brand colours. It does NOT share the Sanity project — MPN member data lives entirely in Supabase.

---

## 3. Site Structure & Routes

### 3.1 URL Structure

MPN will live at `/community/mpn/` under the SCPH domain, or as a subdomain `mpn.sunwayplanetaryhealth.com`. The subdomain approach is recommended to keep auth cookies and Supabase client isolated.

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login + registration page |
| `/` | Public | MPN landing / About page |
| `/resources` | Member | Shared + Workshop resources with sidebar filters |
| `/resources/[id]` | Member | Resource detail + PDF download |
| `/resources/workshop/[id]` | Member | Workshop materials detail + photo gallery |
| `/publications` | Member | Publications catalogue with sidebar filters |
| `/publications/[id]` | Member | Publication detail |
| `/publications/submit` | Member | Submit new publication |
| `/experts` | Member | Expert directory |
| `/experts/[id]` | Member | Expert profile |
| `/cafe` | Member | Virtual Café thread list |
| `/cafe/[id]` | Member | Thread detail + real-time replies |
| `/events` | Public | Events listing (public) |
| `/webinars` | Member | Webinar library |
| `/members` | Member | Network members list |
| `/committee` | Member | Steering committee directory |
| `/profile` | Member | Own profile management |
| `/admin` | Admin | Admin dashboard |
| `/admin/members` | Admin | Member management |
| `/admin/resources` | Admin | Resource management + upload |
| `/admin/publications` | Admin | Publication moderation |
| `/admin/announcements` | Admin | Announcements composer |
| `/admin/analytics` | Admin | Usage analytics |

---

## 4. User Roles & Permissions

| Role | Who | Access |
|------|-----|--------|
| `public` | Unauthenticated visitors | Landing page, Events listing, Login/Register |
| `pending` | Registered but not yet approved | Login confirmation page only; no portal access |
| `member` | Approved workshop alumni | All portal pages except Admin |
| `admin` | SCPH staff | Full portal + Admin dashboard |

### 4.1 Registration & Approval Flow

1. User completes registration form (name, email, password, organisation, country, workshop attended)
2. Supabase Auth sends email verification link
3. On email confirmation → profile status set to `"pending"`
4. Admin receives notification email of new pending member
5. Admin reviews in dashboard → clicks Approve or Reject
6. On approval → status set to `"member"` → user receives welcome email
7. On rejection → user receives rejection email with reason

> **Note:** Members can log in while pending but see only a "pending approval" screen. Full portal access requires admin approval.

---

## 5. Database Schema (Supabase / PostgreSQL)

All tables live in the `public` schema. Supabase `auth.users` handles credentials; a `profiles` table extends it with MPN-specific fields. Foreign keys use UUID primary keys throughout.

### 5.1 `profiles`

> Extends `auth.users` (1:1). Created automatically via database trigger on `auth.users` insert.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | References `auth.users(id)` |
| `full_name` | `text NOT NULL` | |
| `email` | `text NOT NULL` | Mirrors `auth.users.email` |
| `organisation` | `text` | Employer / outlet |
| `country` | `text` | ISO 3166-1 alpha-2 |
| `role` | `text DEFAULT 'pending'` | `pending \| member \| admin` |
| `workshop_id` | `uuid FK` | Which workshop they attended |
| `bio` | `text` | Short professional bio |
| `profile_photo_url` | `text` | Supabase Storage URL |
| `linkedin_url` | `text` | |
| `email_visible` | `boolean DEFAULT false` | Whether email shown to other members |
| `created_at` | `timestamptz DEFAULT now()` | |
| `updated_at` | `timestamptz DEFAULT now()` | |

### 5.2 `workshops`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `number` | `integer NOT NULL` | Workshop sequence number (1, 2, 3…) |
| `title` | `text NOT NULL` | e.g. Climate, Air Pollution and Health |
| `date` | `date NOT NULL` | |
| `location` | `text NOT NULL` | City, Country |
| `participant_count` | `integer` | |
| `description` | `text` | |
| `cover_image_url` | `text` | Supabase Storage |
| `created_at` | `timestamptz DEFAULT now()` | |

### 5.3 `resources`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `title` | `text NOT NULL` | |
| `description` | `text` | |
| `type` | `text NOT NULL` | `Research \| Report \| Toolkit \| Guide \| Dataset \| Book \| Video \| …` |
| `theme` | `text NOT NULL` | `Climate \| Pollution \| Planetary Health \| …` |
| `source` | `text` | Publisher / organisation |
| `published_date` | `date` | |
| `article_url` | `text` | External link |
| `file_url` | `text` | Supabase Storage path for PDF |
| `visibility` | `text DEFAULT 'members'` | `members \| workshop_alumni \| admins` |
| `workshop_id` | `uuid FK NULL` | Set if workshop-specific resource |
| `uploaded_by` | `uuid FK` | References `profiles(id)` |
| `download_count` | `integer DEFAULT 0` | |
| `tags` | `text[]` | |
| `created_at` | `timestamptz DEFAULT now()` | |

### 5.4 `publications`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `title` | `text NOT NULL` | |
| `author_id` | `uuid FK` | References `profiles(id)` |
| `outlet` | `text` | Publication name |
| `published_date` | `date` | |
| `country` | `text` | Country of publication |
| `language` | `text` | Language of publication |
| `type` | `text NOT NULL` | `Article \| Feature \| Research Paper \| Op-Ed \| Investigative \| …` |
| `theme` | `text NOT NULL` | |
| `description` | `text` | Short summary |
| `tags` | `text[]` | |
| `article_url` | `text` | External link |
| `pdf_url` | `text` | Supabase Storage PDF |
| `status` | `text DEFAULT 'pending'` | `pending \| approved \| rejected` |
| `reviewed_by` | `uuid FK NULL` | Admin who approved/rejected |
| `reviewed_at` | `timestamptz NULL` | |
| `view_count` | `integer DEFAULT 0` | |
| `created_at` | `timestamptz DEFAULT now()` | |

### 5.5 `experts`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `full_name` | `text NOT NULL` | |
| `role` | `text NOT NULL` | Job title |
| `organisation` | `text NOT NULL` | |
| `country` | `text NOT NULL` | |
| `expertise` | `text[]` | Array of expertise tags |
| `bio` | `text` | |
| `email` | `text` | Contact email (shown to members only) |
| `linkedin_url` | `text` | |
| `photo_url` | `text` | Supabase Storage |
| `publication_count` | `integer DEFAULT 0` | Cached count |
| `is_active` | `boolean DEFAULT true` | |
| `created_at` | `timestamptz DEFAULT now()` | |

### 5.6 `cafe_threads`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `title` | `text NOT NULL` | |
| `body` | `text NOT NULL` | |
| `author_id` | `uuid FK` | References `profiles(id)` |
| `category` | `text NOT NULL` | `Story Ideas \| Data & Sources \| Expert Contacts \| Collaboration \| Announcements` |
| `reply_count` | `integer DEFAULT 0` | Cached; updated by trigger |
| `is_pinned` | `boolean DEFAULT false` | |
| `is_locked` | `boolean DEFAULT false` | |
| `created_at` | `timestamptz DEFAULT now()` | |
| `updated_at` | `timestamptz DEFAULT now()` | |

### 5.7 `cafe_replies`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `thread_id` | `uuid FK` | References `cafe_threads(id) ON DELETE CASCADE` |
| `author_id` | `uuid FK` | References `profiles(id)` |
| `body` | `text NOT NULL` | |
| `created_at` | `timestamptz DEFAULT now()` | |

### 5.8 `events`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `title` | `text NOT NULL` | |
| `type` | `text NOT NULL` | `Workshop \| Webinar \| Conference \| Networking` |
| `status` | `text NOT NULL` | `upcoming \| past` |
| `date` | `date NOT NULL` | |
| `location` | `text` | City/Country or "Online" |
| `description` | `text` | |
| `cover_image_url` | `text` | |
| `registration_url` | `text` | |
| `is_members_only` | `boolean DEFAULT false` | |
| `created_at` | `timestamptz DEFAULT now()` | |

### 5.9 `webinars`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `title` | `text NOT NULL` | |
| `speaker` | `text` | |
| `date` | `date` | |
| `duration_minutes` | `integer` | |
| `theme` | `text` | |
| `video_url` | `text` | Embed URL (YouTube/Vimeo) |
| `thumbnail_url` | `text` | |
| `description` | `text` | |
| `created_at` | `timestamptz DEFAULT now()` | |

### 5.10 `announcements`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `title` | `text NOT NULL` | |
| `body` | `text NOT NULL` | |
| `author_id` | `uuid FK` | Admin who created it |
| `audience` | `text DEFAULT 'all'` | `all \| workshop:1 \| country:MY \| …` |
| `priority` | `text DEFAULT 'normal'` | `normal \| important \| urgent` |
| `status` | `text DEFAULT 'draft'` | `draft \| sent` |
| `sent_at` | `timestamptz NULL` | |
| `created_at` | `timestamptz DEFAULT now()` | |

### 5.11 `committee_members`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `full_name` | `text NOT NULL` | |
| `role` | `text NOT NULL` | Position title |
| `organisation` | `text` | |
| `country` | `text` | |
| `photo_url` | `text` | |
| `bio` | `text` | |
| `sort_order` | `integer DEFAULT 0` | |
| `is_active` | `boolean DEFAULT true` | |

### 5.12 `resource_downloads` (audit log)

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `resource_id` | `uuid FK` | |
| `user_id` | `uuid FK` | |
| `downloaded_at` | `timestamptz DEFAULT now()` | |

### 5.13 Full-text Search

PostgreSQL `tsvector` columns added to `resources`, `publications`, and `experts`. A single GIN-indexed `search_vector` column on each table enables fast full-text search without an external service.

```sql
ALTER TABLE resources
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(theme, '')
    )
  ) STORED;

CREATE INDEX resources_search_idx ON resources USING GIN(search_vector);
```

---

## 6. Authentication & Authorization

### 6.1 Supabase Auth Configuration

- **Provider:** Email/Password (primary)
- **Magic Link:** Optional — ideal for journalists who attend workshops without setting a password
- **Email confirmation:** Required before profile is created
- **Password reset:** Supabase built-in flow
- **Session:** JWT, stored in httpOnly cookie via Next.js middleware

### 6.2 Next.js Middleware

A `middleware.ts` file at the project root inspects the Supabase session on every request and enforces route-level access control:

```ts
// middleware.ts
export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()
  const role = session?.user?.user_metadata?.role ?? 'public'

  if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin')
    return NextResponse.redirect('/login')

  if (isMemberRoute(request) && !['member', 'admin'].includes(role))
    return NextResponse.redirect('/login')
}
```

### 6.3 Row Level Security (RLS)

Every table has RLS enabled. Policies enforce data access at the database level — even if application code has a bug, unauthorised queries are rejected by PostgreSQL.

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Own row; admins see all | Auth trigger only | Own row; admins update role | Admins only |
| `resources` | Members (visibility check) | Admins only | Admins only | Admins only |
| `publications` | Members (approved only) | Members (own) | Own pending; admins all | Admins only |
| `experts` | Members | Admins only | Admins only | Admins only |
| `cafe_threads` | Members | Members | Own + admins | Own + admins |
| `cafe_replies` | Members | Members | Own only | Own + admins |
| `events` | Public (upcoming); members (all) | Admins | Admins | Admins |
| `announcements` | Members (sent only) | Admins | Admins | Admins |

> RLS policies use `auth.uid()` to match the current user and `auth.jwt() ->> 'role'` to check the role claim embedded in the JWT at login.

---

## 7. API Design

Supabase auto-generates a PostgREST REST API for every table. The Next.js app uses the `@supabase/ssr` client in Server Components and API routes for direct queries — no hand-written CRUD endpoints needed for standard operations.

Custom Next.js API routes (`/api/*`) are only written for operations that require server-side logic beyond what Supabase handles natively.

### 7.1 Supabase Client Queries (no API route needed)

| Operation | Supabase call |
|-----------|--------------|
| List resources with filters | `supabase.from('resources').select('*').eq('theme', theme).eq('type', type)` |
| Get publication by ID | `supabase.from('publications').select('*, profiles(*)').eq('id', id).single()` |
| List café threads | `supabase.from('cafe_threads').select('*, profiles(full_name, country, organisation)').order('created_at', { ascending: false })` |
| Full-text search | `supabase.from('resources').select('*').textSearch('search_vector', query)` |
| Real-time replies | `supabase.channel('thread-' + id).on('postgres_changes', {...}, handler).subscribe()` |

### 7.2 Custom API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/register` | Public | Create auth user + profile row in one transaction |
| `POST` | `/api/auth/approve` | Admin | Set profile role to `member`; send welcome email |
| `POST` | `/api/auth/reject` | Admin | Set profile status to `rejected`; send email with reason |
| `POST` | `/api/resources/upload` | Admin | Upload file to Supabase Storage; create resource row |
| `GET` | `/api/resources/[id]/download` | Member | Generate signed URL for PDF; log download |
| `POST` | `/api/publications/submit` | Member | Create publication row with `status=pending`; notify admins |
| `POST` | `/api/publications/[id]/review` | Admin | Approve or reject publication; send email to author |
| `POST` | `/api/announcements/send` | Admin | Mark announcement sent; send email to target audience via Resend |
| `GET` | `/api/search` | Member | Unified full-text search across resources, publications, experts |
| `POST` | `/api/cafe/threads` | Member | Create thread (validates body length, category) |
| `POST` | `/api/cafe/[id]/replies` | Member | Add reply to thread; increment `reply_count` |
| `GET` | `/api/admin/stats` | Admin | Dashboard KPIs: members, resources, publications, downloads |
| `POST` | `/api/profile/photo` | Member | Upload profile photo to Storage; update profile row |

### 7.3 API Response Shape

All custom API routes return a consistent envelope:

```ts
// Success
{ "data": { ... }, "error": null }

// Error
{ "data": null, "error": { "code": "NOT_FOUND", "message": "Resource not found" } }
```

---

## 8. File Storage Strategy

Supabase Storage organises files into buckets. Each bucket has its own access policy.

| Bucket | Access | Contents | Max size |
|--------|--------|----------|----------|
| `resources` | Members (signed URLs) | Resource PDFs, DOCX, XLSX | 25 MB |
| `publications` | Members (signed URLs) | Publication PDFs | 25 MB |
| `workshop-materials` | Members (signed URLs) | Slides, handouts, photos | 50 MB |
| `avatars` | Public | Profile photos | 5 MB |
| `expert-photos` | Public | Expert directory photos | 5 MB |
| `event-covers` | Public | Event banner images | 10 MB |

Gated files (`resources`, `publications`, `workshop-materials`) are never served directly. The `/api/resources/[id]/download` route validates the session, checks RLS, logs the download, then returns a short-lived Supabase signed URL (valid 60 seconds).

---

## 9. Real-time Features

The Virtual Café thread detail page subscribes to new replies in real-time using Supabase Realtime channels. No polling required.

```ts
// app/cafe/[id]/page.tsx
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

The subscription is established in a Client Component. The initial reply list is server-rendered for performance. Realtime only adds new replies after the page loads.

---

## 10. Next.js Component Architecture

### 10.1 Directory Structure

```
mpn/
├── app/                          # App Router
│   ├── (public)/                 # Public routes (no auth)
│   │   ├── page.tsx              # Landing / About
│   │   └── login/page.tsx
│   ├── (member)/                 # Member-gated routes
│   │   ├── resources/
│   │   ├── publications/
│   │   ├── experts/
│   │   ├── cafe/
│   │   ├── events/
│   │   ├── webinars/
│   │   ├── members/
│   │   ├── committee/
│   │   └── profile/
│   ├── (admin)/admin/            # Admin-gated routes
│   ├── api/                      # Custom API routes
│   ├── layout.tsx                # Root layout (nav, footer)
│   └── middleware.ts
├── components/
│   ├── nav/                      # FloatingNav, MobileMenu
│   ├── ui/                       # Button, Badge, Card, Input…
│   ├── filter/                   # FilterSidebar, FilterBtn
│   ├── resources/                # ResourceCard, ResourceList
│   ├── publications/             # PublicationCard, PubList
│   ├── experts/                  # ExpertCard, ExpertGrid
│   ├── cafe/                     # ThreadRow, ReplyFeed
│   └── admin/                    # StatCard, AdminTable
├── lib/
│   ├── supabase/                 # Client, server, middleware helpers
│   ├── types/                    # TypeScript types matching DB schema
│   └── utils/                    # Date formatting, file size, etc.
└── styles/
    └── globals.css               # SCPH design tokens
```

### 10.2 Server vs Client Components

| Component type | Strategy |
|----------------|----------|
| Page components (data fetching) | Server Components — fetch from Supabase server client |
| Filter sidebar | Client Component — manages active filter state |
| Real-time replies feed | Client Component — subscribes to Supabase Realtime |
| Mobile hamburger menu | Client Component — toggle state |
| Upload forms | Client Component — File API + FormData |
| Admin tables with actions | Client Component — optimistic UI updates |
| Static content (about, events) | Server Components |

---

## 11. UI Design System

MPN follows the visual language established in the approved HTML prototype, using SCPH's brand tokens.

| Token | Value | Usage |
|-------|-------|-------|
| `--blue` | `#1B4384` | Primary CTAs, nav active states, header banners |
| `--green` | `#50B58B` | Success states, stat highlights, Workshop badge |
| `--navy` | `#0d1f3c` | Hero backgrounds, dark sections |
| `--cream` | `#faf9f7` | Page background |
| Font (headings) | Poppins 600/700 | H1–H3, nav brand, stats |
| Font (body) | Inter 400/500/600 | Body text, labels, buttons |
| Border radius (card) | `10px` | Item rows, resource cards |
| Border radius (pill) | `100px` | Nav, filter chips |
| Nav style | Floating pill, `position: fixed` | Matches GTP programmes page |
| Filter sidebar | Sticky left panel, scrollable | Resources + Publications pages |

All POC pages are converted to Next.js components following this design system. No new design decisions — the prototype is the source of truth.

---

## 12. Email Notifications

Transactional emails sent via Resend (integrated with Supabase Auth for verification emails, and via API routes for custom notifications).

| Trigger | Recipients | Template |
|---------|-----------|----------|
| User registers | New user | Email verification link |
| User verified email | Admins | New pending member alert |
| Admin approves member | New member | Welcome email + portal link |
| Admin rejects member | Applicant | Rejection with reason |
| Admin sends announcement | Target audience | Announcement body |
| Publication approved | Author | Publication live confirmation |
| New Café reply on own thread | Thread author | Reply notification (digest) |

---

## 13. Integration with SCPH Website

MPN is a separate Next.js application but shares the SCPH visual identity. The SCPH main site links to MPN from the Community navigation item.

| Item | Approach |
|------|----------|
| URL | `mpn.sunwayplanetaryhealth.com` (subdomain) or `/community/mpn` |
| Deployment | Separate Vercel project; same Vercel team |
| Design tokens | Shared Tailwind config package or copied `globals.css` |
| Fonts | Same Google Fonts CDN calls (Poppins + Inter) |
| Navigation back | MPN nav includes "← SCPH" link to return to main site |
| Analytics | Separate Vercel Analytics; dashboard in Admin panel |
| Sanity | Not shared — MPN landing copy may optionally use the existing SCPH Sanity project for marketing text only |

---

## 14. Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Public anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin key — never in browser |
| `RESEND_API_KEY` | Server only | Email sending |
| `NEXT_PUBLIC_SITE_URL` | Client + Server | Canonical URL for auth redirects |
| `ADMIN_EMAIL` | Server only | Receives new member notifications |

---

## 15. Development Roadmap

### Phase 1 — Foundation (Weeks 1–2)

- Supabase project setup (tables, RLS, Storage buckets)
- Next.js project scaffold with Tailwind + Supabase client
- Auth: registration form, email verification, pending screen
- Middleware: route protection by role
- Admin approval flow: dashboard view + approve/reject actions
- Database seed scripts for workshops, experts, committee members

### Phase 2 — Core Member Pages (Weeks 3–4)

- Resources page: list, filters, detail, PDF download
- Publications page: list, filters, detail, submission form
- Expert directory: grid, detail, contact buttons
- Profile page: view + edit own profile, photo upload
- Events page

### Phase 3 — Community Features (Week 5)

- Virtual Café: thread list, thread detail, reply form
- Real-time replies via Supabase Realtime
- Webinar library
- Members list + committee directory
- Full-text search overlay

### Phase 4 — Admin Panel (Week 6)

- Dashboard with live stats
- Member management table with approve/reject/suspend
- Resource upload + management
- Publication moderation queue
- Announcement composer + send
- Analytics panel

### Phase 5 — Polish & Launch (Week 7)

- Mobile responsive QA across all pages
- Email template design and testing
- Accessibility audit
- Performance optimisation (image loading, RSC streaming)
- Staging environment review with SCPH team
- Production deploy + DNS configuration

---

## 16. Open Questions & Decisions Required

These need answers before Phase 1 kicks off.

| # | Question | Options |
|---|----------|---------|
| 1 | URL structure | Subdomain (`mpn.sunwayplanetaryhealth.com`) vs path (`/community/mpn`) |
| 2 | Magic link login | Offer alongside email/password, or password only? |
| 3 | Social login | Google OAuth for journalists? Simplifies registration. |
| 4 | Workshop verification | Manual (admin confirms attendance) or self-reported + admin review? |
| 5 | Public-facing publications | Should approved publications be indexable by Google, or member-only? |
| 6 | Announcement email frequency | Real-time per event, or daily/weekly digest? |
| 7 | Expert profile creation | Admin-only, or can experts self-register with a separate flow? |
| 8 | Existing member import | Bulk import of past workshop attendees on launch? |
