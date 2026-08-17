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

## Project Summary

- **What:** Gated community portal for SCPH Capacity Development Workshop alumni
- **Who:** Journalists → register → await admin approval → access portal
- **Stack:** Next.js 14 App Router · TypeScript · Tailwind · Supabase · Vercel
- **Lives under:** Community tab on SCPH website (`mpn.sunwayplanetaryhealth.com` or `/community/mpn`)
- **UI source of truth:** `media-portal-demo.html` (approved POC, all 8 passes complete)

## Open Questions (answer before Phase 1)

| # | Question | Options |
|---|----------|---------|
| 1 | URL structure | Subdomain vs `/community/mpn` path |
| 2 | Magic link login | Alongside email/password, or password only? |
| 3 | Social login | Google OAuth? Simplifies journalist onboarding. |
| 4 | Workshop verification | Manual admin confirmation vs self-reported + review |
| 5 | Public publications | Google-indexable or member-only? |
| 6 | Announcement emails | Real-time per event or digest? |
| 7 | Expert self-registration | Admin-only or separate expert signup flow? |
| 8 | Member import | Bulk import past workshop attendees at launch? |
