# MPN Implementation Decisions

This document is the canonical Phase 0 decision record for implementation. It resolves older conflicting examples in the MPN specs. [`../HANDOFF.md`](../HANDOFF.md) remains the project-level handoff.

## Routes and deployment

- MPN is deployed within the SCPH application at `/community/mpn`; it is not a subdomain or separate application.
- MPN API routes are under `/api/mpn/`.
- Supabase environment variables are `NEXT_PUBLIC_MPN_SUPABASE_URL`, `NEXT_PUBLIC_MPN_SUPABASE_ANON_KEY`, and `MPN_SUPABASE_SERVICE_ROLE_KEY`.
- The application currently uses Next.js 16. Use the root [`proxy.ts`](../../proxy.ts) file convention, not the deprecated `middleware.ts` convention.

## Authentication and roles

- v1 supports email/password authentication only. Supabase email confirmation is required.
- Registration collects a workshop selection. Attendance is self-reported and manually verified by an administrator during approval.
- A profile is created only after `auth.users.email_confirmed_at` changes from `NULL` to a timestamp.
- `profiles.role` is the authorization source of truth. `raw_user_meta_data` is user-editable and must never authorize an operation.
- A server-side role lookup is required for protected routes and mutations. Proxy refreshes and validates the auth session, but does not replace database RLS or per-route authorization.
- `pending`, `member`, `admin`, and `rejected` are stored roles. Rejected users may authenticate but cannot access member-only actions.
- Bootstrap the first administrator with a documented, one-time server-side SQL operation after that person verifies their email.

## Access matrix

| Capability | Public | Authenticated / pending | Member | Admin |
|---|---:|---:|---:|---:|
| Browse resources, publications, experts, members, Café, events, webinars, committee | Yes | Yes | Yes | Yes |
| View contact emails where an owner has opted in | No | Yes | Yes | Yes |
| Download a permitted PDF | No | Yes | Yes | Yes |
| Access workshop-specific resources | No | Matching workshop only | Matching workshop only | Yes |
| View and edit own profile | No | Yes | Yes | Yes |
| Create Café threads and replies | No | No | Yes | Yes |
| Submit publications | No | No | Yes | Yes |
| Use administration | No | No | No | Yes |

## Data and storage protection

- RLS protects rows, not selected columns. Anonymous/public queries must target public-safe views that omit private fields:
  - `profiles_directory` omits `email`;
  - `experts_public` omits `email`;
  - `resources_public` omits `file_url`;
  - equivalent publication views omit private PDF storage paths.
- Authenticated contact detail and private storage paths are returned only by server-side, authorization-checked code.
- `resources`, `publications`, and `workshop-materials` Storage buckets are private. Download endpoints create 60-second signed URLs after authorization.
- `avatars`, `expert-photos`, and `event-covers` are public-read buckets with constrained write policies.
- APIs are a convenience layer, never the only authorization layer: RLS and Storage policies must enforce the same access model.

## Feature scope decisions

- Café is public read-only. Only approved members and administrators can post or reply.
- Webinars are publicly browsable and indexable. If a future webinar requires login, its video URL must be withheld until its dedicated access rule is evaluated.
- Public resources and publications are indexable. Search returns only fields available to the requesting tier.
- Publication view counts are changed through a server-side endpoint or RPC, never a client-writable row update.
- Initial v1 admin scope includes member approval/rejection. Full content management, analytics, and Resend workflow polish remain later phases.

## First-admin bootstrap

1. Register and confirm the intended administrator's email.
2. In the Supabase SQL editor, verify the matching `profiles` row.
3. Update only that row to `role = 'admin'`, using its immutable auth user UUID.
4. Record the operator and date in the deployment runbook; do not expose an unauthenticated “make admin” route.
