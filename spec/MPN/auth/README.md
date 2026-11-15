# Auth — Roles, Registration & Security

## User Roles

| Role | Who | Access |
|------|-----|--------|
| `public` | Unauthenticated visitors | Browse all public content (read-only). Cannot download PDFs, post in Café, or see contact emails. |
| `authenticated` | Logged in, any status | Download PDFs, see contact emails |
| `pending` | Registered but not yet approved | Download PDFs, see contact emails. Cannot post in Café or submit publications — must be approved first. |
| `member` | Approved workshop alumni | Full access — submit publications, own profile, workshop-specific materials |
| `admin` | SCPH staff | Full portal + Admin dashboard |

`profiles.role` is the authorization source of truth. Do not authorize from
`raw_user_meta_data` / `user_metadata`: users can edit it. Protected pages and
mutations verify the session and look up the role server-side; RLS independently
enforces the same rule. See [`../DECISIONS.md`](../DECISIONS.md).

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
- **Magic Link:** Not included in v1
- **Email confirmation:** Required — profile row is only created after verification
- **Password reset:** Supabase built-in (`/auth/confirm?type=recovery`)
- **Session:** JWT stored in httpOnly cookie via `@supabase/ssr`

---

## Next.js Proxy

The application uses Next.js 16, where the root request interception convention
is `proxy.ts`. It refreshes sessions using `@supabase/ssr` and
`supabase.auth.getClaims()` with cookie `getAll` / `setAll` support. It does not
make authorization decisions from JWT user metadata.

The Proxy matcher is limited to `/community/mpn/:path*`. It must leave all
public browse pages accessible for SEO and usability. It redirects only:

- unauthenticated visitors away from `/profile`, `/publications/submit`, and
  `/admin/**`;
- pending or rejected users away from `/publications/submit`;
- every non-admin away from `/admin/**`.

Café reads remain public; creation/reply endpoints require `member` or `admin`.
All `/api/mpn/**` routes repeat their session and role check server-side.

---

## DB Trigger — Auto-create Profile

The trigger runs when an account's email becomes verified—not when the auth user
is first inserted. It must be idempotent because profile creation can be retried.
It copies only validated registration metadata, defaults to `pending`, and fixes
its `search_path`.

```sql
CREATE OR REPLACE FUNCTION public.create_profile_on_email_confirmation()
RETURNS trigger AS $$
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.profiles (
      id, email, full_name, organisation, country, workshop_id, role
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''), NEW.email),
      NULLIF(NEW.raw_user_meta_data ->> 'organisation', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'country', ''),
      (
        SELECT id
        FROM public.workshops
        WHERE id::text = NEW.raw_user_meta_data ->> 'workshop_id'
      ),
      'pending'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_on_email_confirmation();
```

The workshop lookup deliberately yields `NULL` for malformed or unavailable
metadata so an email confirmation cannot fail because of a client-provided
workshop selection.

---

## Row Level Security (RLS)

RLS is enabled on every table. Policies enforce access at the DB level regardless of application code.

### Role helper function

```sql
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = '';
```

The function is used only inside database policies. Do not expose it through a
public API, and grant execution only to the database roles that require it:

```sql
REVOKE EXECUTE ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;
```

### Policy matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Public-safe directory view; own row + admins on base table | Trigger only | Own row, with role protected; admins manage role | Admins only |
| `resources` | Public-safe metadata view; authenticated server code accesses storage path | Admins only | Admins only | Admins only |
| `publications` | Public (approved rows only) | Members (own) | Own pending rows; admins all | Admins only |
| `experts` | Public-safe view; authenticated server code accesses contact email | Admins only | Admins only | Admins only |
| `cafe_threads` | **Public** | Members only | Own + admins | Own + admins |
| `cafe_replies` | **Public** | Members only | Own only | Own + admins |
| `events` | **Public** | Admins | Admins | Admins |
| `webinars` | **Public** | Admins | Admins | Admins |
| `committee_members` | **Public** | Admins | Admins | Admins |
| `announcements` | Members (status = 'sent') | Admins | Admins | Admins |
| `resource_downloads` | Admins only | Authenticated user logging their own download | Admins only | Admins only |

RLS is row-level; it cannot hide individual columns. Public queries use
security-invoker views that omit private columns. Signed URLs are created
server-side after access verification.

### Example policies

```sql
-- Anyone can read approved public publication metadata.
CREATE POLICY "public_read_approved_publications"
ON publications FOR SELECT
USING (status = 'approved');

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
