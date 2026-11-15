# API Design

## Strategy

Supabase auto-generates a PostgREST REST API for every table. The Next.js app uses:

- **`@supabase/ssr` server client** in Server Components and Server Actions for standard CRUD
- **Custom Next.js API routes (`/api/mpn/*`)** only for logic that PostgREST can't handle: file uploads, signed URLs, email sending, multi-step transactions

Public browser queries use the public-safe views defined in
[`../DECISIONS.md`](../DECISIONS.md), not `select('*')` on base tables with
private columns. Every custom route validates the authenticated user and their
database role; client-visible metadata is not a role source.

---

## Supabase Client Queries (no custom route needed)

These are called directly from Server Components or Client Components using `@supabase/ssr`.

| Operation | Query |
|-----------|-------|
| List resources with filters | `.from('resources_public').select('*').eq('theme', theme).eq('type', type).order('created_at', { ascending: false })` |
| Get resource by ID | `.from('resources_public').select('*').eq('id', id).single()` |
| List publications (approved) | `.from('publications_public').select('*').eq('status', 'approved')` |
| Get publication by ID | `.from('publications_public').select('*').eq('id', id).single()` |
| List experts with filter | `.from('experts_public').select('*').eq('is_active', true).contains('expertise', [tag])` |
| List café threads | `.from('cafe_threads').select('*, profiles(full_name, country, organisation)').order('is_pinned', { ascending: false }).order('updated_at', { ascending: false })` |
| Get thread + replies | `.from('cafe_replies').select('*, profiles(full_name, profile_photo_url, organisation)').eq('thread_id', id).order('created_at')` |
| List events | `.from('events').select('*').order('date', { ascending: true })` |
| List webinars | `.from('webinars').select('*').order('date', { ascending: false })` |
| List members | `.from('profiles_directory').select('*').eq('role', 'member')` |
| Full-text search | `.from('resources').select('id, title, type, theme').textSearch('search_vector', query, { type: 'websearch' })` |
| Real-time replies | `.channel('thread-' + id).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cafe_replies', filter: 'thread_id=eq.' + id }, handler).subscribe()` |

---

## Custom API Routes

### `POST /api/mpn/auth/register`
**Auth:** Public

Creates the auth user and sets profile metadata in one call. Supabase Auth then sends verification email automatically.

```ts
// Request
{ full_name, email, password, organisation, country, workshop_id }

// Steps:
// 1. supabase.auth.signUp({ email, password, options: { data: { full_name, organisation, country, workshop_id } } })
// 2. DB trigger creates profiles row on email confirmation

// Response
{ data: { message: 'Check your email to verify your account' }, error: null }
```

---

### `POST /api/mpn/auth/approve`
**Auth:** Admin

```ts
// Request
{ user_id: string, message?: string }

// Steps:
// 1. supabase (service role) .from('profiles').update({ role: 'member' }).eq('id', user_id)
// 2. Send welcome email via Resend

// Response
{ data: { approved: true }, error: null }
```

---

### `POST /api/mpn/auth/reject`
**Auth:** Admin

```ts
// Request
{ user_id: string, reason: string }

// Steps:
// 1. supabase (service role) .from('profiles').update({ role: 'rejected' }).eq('id', user_id)
// 2. Send rejection email via Resend with reason

// Response
{ data: { rejected: true }, error: null }
```

---

### `POST /api/mpn/resources/upload`
**Auth:** Admin

```ts
// Request: multipart/form-data
// Fields: title, description, type, theme, source, published_date, visibility, workshop_id?, tags[]
// File: pdf (optional)

// Steps:
// 1. If file present: supabase.storage.from('resources').upload(path, file)
// 2. supabase.from('resources').insert({ ...fields, file_url: storageUrl, uploaded_by: adminId })

// Response
{ data: { resource: { id, title } }, error: null }
```

---

### `GET /api/mpn/resources/[id]/download`
**Auth:** Authenticated

```ts
// Steps:
// 1. Fetch resource row — verify it exists and the authenticated user has access
// 2. supabase.storage.from('resources').createSignedUrl(file_url, 60) — 60 second expiry
// 3. supabase.from('resource_downloads').insert({ resource_id, user_id }) — triggers count++

// Response
{ data: { url: '<signed URL>' }, error: null }
```

---

### `POST /api/mpn/publications/submit`
**Auth:** Member

```ts
// Request: multipart/form-data
// Fields: title, outlet, published_date, country, language, type, theme, description, tags[], article_url?
// File: pdf (optional)

// Steps:
// 1. If file: supabase.storage.from('publications').upload(path, file)
// 2. supabase.from('publications').insert({ ...fields, author_id, status: 'pending' })
// 3. Send admin notification email

// Response
{ data: { publication: { id } }, error: null }
```

---

### `POST /api/mpn/publications/[id]/review`
**Auth:** Admin

```ts
// Request
{ action: 'approve' | 'reject', reason?: string }

// Steps:
// 1. Update publications row: status, reviewed_by, reviewed_at
// 2. Send email to author

// Response
{ data: { status: 'approved' | 'rejected' }, error: null }
```

---

### `POST /api/mpn/announcements/send`
**Auth:** Admin

```ts
// Request
{ announcement_id: string }

// Steps:
// 1. Fetch announcement row (must be status = 'draft')
// 2. Resolve audience → list of member emails
// 3. Send via Resend (batch)
// 4. Update announcement: status = 'sent', sent_at = now()

// Response
{ data: { sent_to: number }, error: null }
```

---

### `GET /api/mpn/search`
**Auth:** Public

Unified full-text search across resources, publications, and experts. Results
must use the caller's public-safe view or authenticated projection.

```ts
// Query params: q=<search term>&types=resources,publications,experts

// Steps:
// 1. Run .textSearch('search_vector', q) on each requested table in parallel
// 2. Merge and sort by relevance

// Response
{ data: { resources: [...], publications: [...], experts: [...] }, error: null }
```

---

### `POST /api/mpn/cafe/threads`
**Auth:** Member

```ts
// Request
{ title, body, category }

// Validation: body min 20 chars, category must be one of the 5 allowed values

// Response
{ data: { thread: { id } }, error: null }
```

---

### `POST /api/mpn/cafe/[id]/replies`
**Auth:** Member

```ts
// Request
{ body: string }

// Steps:
// 1. Check thread is not locked
// 2. supabase.from('cafe_replies').insert({ thread_id: id, author_id, body })
// (DB trigger handles reply_count increment)

// Response
{ data: { reply: { id, created_at } }, error: null }
```

---

### `GET /api/mpn/admin/stats`
**Auth:** Admin

```ts
// Response
{
  data: {
    total_members: number,
    pending_members: number,
    total_resources: number,
    total_publications: number,
    pending_publications: number,
    total_downloads: number,
    active_threads: number
  },
  error: null
}
```

---

### `POST /api/mpn/profile/photo`
**Auth:** Authenticated

```ts
// Request: multipart/form-data with image file

// Steps:
// 1. Validate: image only, max 5 MB
// 2. supabase.storage.from('avatars').upload('public/' + userId, file, { upsert: true })
// 3. supabase.from('profiles').update({ profile_photo_url: publicUrl }).eq('id', userId)

// Response
{ data: { photo_url: string }, error: null }
```

---

## Standard Response Envelope

All custom API routes return:

```ts
// Success
{ "data": { ... }, "error": null }

// Error
{ "data": null, "error": { "code": "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR" | "INTERNAL", "message": string } }
```

HTTP status codes: `200` success, `400` validation, `401` unauthenticated, `403` forbidden, `404` not found, `500` internal.
