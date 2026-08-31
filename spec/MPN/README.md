# MPN Spec Index

Media Professional Network — technical specification for the Next.js + Supabase implementation.

## Folder Map

| Folder | Contents |
|--------|----------|
| [`auth/`](auth/README.md) | User roles, registration & approval flow, middleware, RLS policies |
| [`database/`](database/README.md) | Full PostgreSQL schema (all 13 tables) + full-text search setup |
| [`api/`](api/README.md) | Supabase client queries + custom Next.js API routes |
| [`storage/`](storage/README.md) | Supabase Storage buckets, access control, signed URL strategy |
| [`features/`](features/) | Per-feature specs: resources, publications, experts, café, events, members, admin |
| [`frontend/`](frontend/README.md) | Routes, component architecture, server vs client decisions |
| [`frontend/design-system.md`](frontend/design-system.md) | Brand tokens, typography, UI conventions from POC |
| [`email/`](email/README.md) | Transactional email triggers and templates |
| [`deployment/`](deployment/README.md) | SCPH integration, environment variables |
| [`deployment/roadmap.md`](deployment/roadmap.md) | 5-phase development roadmap |
| [`DECISIONS.md`](DECISIONS.md) | Canonical Phase 0 access, security, and integration decisions |

## Project Summary

- **What:** Gated community portal for SCPH Capacity Development Workshop alumni
- **Who:** Journalists → register → await admin approval → access portal
- **Stack:** Next.js 16 App Router · TypeScript · Tailwind · Supabase · Vercel
- **Lives under:** Community tab on SCPH website (`/community/mpn`)
- **UI source of truth:** `media-portal-demo.html` (approved POC, all 8 passes complete)

## Deferred Questions

Phase 0 resolved routing, email/password authentication, manual workshop
verification, public indexable publications, and public webinars. The following
choices are deferred and do not block Phase 1:

| # | Question | Options |
|---|----------|---------|
| 1 | Social login | Google OAuth is a post-launch consideration. |
| 2 | Announcement emails | Decide real-time delivery vs digest before Phase 4. |
| 3 | Expert self-registration | Admin-only for v1; revisit after launch. |
| 4 | Member import | Decide the launch cohort/import approach before Phase 5. |
