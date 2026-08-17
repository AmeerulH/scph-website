# Auth — Roles, Registration & Security

## User Roles

| Role | Who | Access |
|------|-----|--------|
| `public` | Unauthenticated visitors | Browse all public content (read-only). Cannot download PDFs, post in Café, or see contact emails. |
| `authenticated` | Logged in, any status | Download PDFs, see contact emails |
| `pending` | Registered but not yet approved | Download PDFs, see contact emails. Cannot post in Café or submit publications — must be approved first. |
| `member` | Approved workshop alumni | Full access — submit publications, own profile, workshop-specific materials |
| `admin` | SCPH staff | Full portal + Admin dashboard |

Role is stored in `profiles.role` and embedded as a JWT claim on login so middleware can check it without a DB round-trip.

> **Most content is publicly visible.** The access tiers control *interaction* and *sensitive data* (contact emails, PDF downloads, Café posting), not content discovery.

---

## Registration & Approval Flow

```
User fills register form
  → Supabase Auth creates user (email unverified)
  → Supabase sends verification email

User clicks verification link
  → Email confirmed
  → DB trigger creates profiles row with role = 'pending'
  → Admin receives notification email: "New pending member"

Admin opens dashboard → Members tab → Pending
  → Reviews profile (name, org, workshop attended)
  → Clicks Approve or Reject (+ optional reason)

On Approve:
  → profiles.role set to 'member'
  → JWT claim updated on next login
  → User receives welcome email with portal link

On Reject:
  → profiles.role set to 'rejected'
  → User receives rejection email with reason
```

**Pending behaviour:** Users with `role = 'pending'` can browse all content and download PDFs. They **cannot** post or reply in the Café, and cannot submit publications — both require full `member` approval. They see a "Your membership is awaiting approval" message where interactive controls would appear.

---

## Supabase Auth Config

- **Provider:** Email/Password (primary)
- **Magic Link:** Optional (good for journalists who attended workshops and don't want to set a password)
- **Email confirmation:** Required — profile row is only created after verification
- **Password reset:** Supabase built-in (`/auth/confirm?type=recovery`)
- **Session:** JWT stored in httpOnly cookie via `@supabase/ssr`

---

## Next.js Middleware

`middleware.ts` at the project root runs on every request:

```ts
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const MEMBER_ROUTES = ['/resources', '/publications', '/experts', '/cafe', '/events', '/webinars', '/members', '/committee', '/profile']
const ADMIN_ROUTES = ['/admin']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* get/set helpers */ } }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const role = (session?.user?.user_metadata?.role ?? 'public') as string
  const path = request.nextUrl.pathname

  if (ADMIN_ROUTES.some(r => path.startsWith(r)) && role !== 'admin')
    return NextResponse.redirect(new URL('/login', request.url))

  if (MEMBER_ROUTES.some(r => path.startsWith(r)) && !['member', 'admin'].includes(role))
    return NextResponse.redirect(new URL(role === 'pending' ? '/pending' : '/login', request.url))

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|$).*)'],
}
```

---

## DB Trigger — Auto-create Profile

Runs on `auth.users` insert after email confirmation:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    'pending'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Row Level Security (RLS)

RLS is enabled on every table. Policies enforce access at the DB level regardless of application code.

### Role helper function

```sql
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### Policy matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Public (basic fields); full row for own + admins | Trigger only | Own row; admins update `role` | Admins only |
| `resources` | Public (list/metadata); `file_url` gated to authenticated | Admins only | Admins only | Admins only |
| `publications` | Public (approved rows only) | Members (own) | Own pending rows; admins all | Admins only |
| `experts` | Public (profile); `email` gated to authenticated | Admins only | Admins only | Admins only |
| `cafe_threads` | **Public** | Members only | Own + admins | Own + admins |
| `cafe_replies` | **Public** | Members only | Own only | Own + admins |
| `events` | **Public** | Admins | Admins | Admins |
| `webinars` | **Public** | Admins | Admins | Admins |
| `committee_members` | **Public** | Admins | Admins | Admins |
| `announcements` | Members (status = 'sent') | Admins | Admins | Admins |

### Example policies

```sql
-- Members can read approved publications
CREATE POLICY "members_read_publications"
ON publications FOR SELECT
USING (
  status = 'approved'
  AND current_user_role() IN ('member', 'admin')
);

-- Members can insert own publications
CREATE POLICY "members_insert_own_publication"
ON publications FOR INSERT
WITH CHECK (
  author_id = auth.uid()
  AND current_user_role() IN ('member', 'admin')
);

-- Admins can update any publication (for moderation)
CREATE POLICY "admins_update_publications"
ON publications FOR UPDATE
USING (current_user_role() = 'admin');
```
