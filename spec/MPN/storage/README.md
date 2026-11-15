# File Storage

Supabase Storage. Each bucket has its own access policy. Gated files are never served via public URLs — always through short-lived signed URLs generated server-side.

---

## Buckets

| Bucket | Public? | Contents | Max file size |
|--------|---------|----------|---------------|
| `resources` | No | Resource PDFs, DOCX, XLSX | 25 MB |
| `publications` | No | Publication PDFs | 25 MB |
| `workshop-materials` | No | Slides, handouts, workshop photos | 50 MB |
| `avatars` | Yes | Member profile photos | 5 MB |
| `expert-photos` | Yes | Expert directory headshots | 5 MB |
| `event-covers` | Yes | Event and webinar banner images | 10 MB |

---

## File Paths

Use a consistent path convention within each bucket:

| Bucket | Path pattern | Example |
|--------|-------------|---------|
| `resources` | `{resource_id}/{filename}` | `abc123/who-air-quality-report.pdf` |
| `publications` | `{author_id}/{publication_id}/{filename}` | `user123/pub456/my-article.pdf` |
| `workshop-materials` | `workshop-{number}/{filename}` | `workshop-3/slides-day1.pdf` |
| `avatars` | `public/{user_id}` | `public/user123` |
| `expert-photos` | `public/{expert_id}` | `public/expert456` |
| `event-covers` | `public/{event_id}` | `public/event789` |

---

## Gated File Access

Resources, publications, and workshop materials are never served directly. Flow:

```
Authenticated user requests download
  → GET /api/mpn/resources/[id]/download
  → Server validates session (pending users may download shared resources)
  → Server checks the resource visibility and workshop access
  → Server logs download: INSERT INTO resource_downloads
  → supabase.storage.from('resources').createSignedUrl(file_url, 60)
  → Returns { data: { url: '<signed URL valid 60 seconds>' } }
  → Client opens signed URL in new tab
```

The 60-second expiry means links cannot be shared. Each download requires a fresh server round-trip.

### Storage policy requirements

- `resources`, `publications`, and `workshop-materials` remain private. No
  anonymous `SELECT` policy may make files directly accessible.
- Signed URLs are created only in server-side routes after a verified session
  and database authorization check. The service-role key is never sent to the
  browser.
- `avatars`, `expert-photos`, and `event-covers` may be public-read. Their
  write policies must be scoped respectively to the owner or administrator.
- Upsert paths require `INSERT`, `SELECT`, and `UPDATE` Storage policies.
- Validate file size and MIME type server-side before upload; client-provided
  MIME types are advisory only.

---

## Upload Flow (Admin — Resources)

```ts
// 1. Admin selects file in UI
// 2. POST /api/mpn/resources/upload (multipart/form-data)
// 3. Server uploads to Supabase Storage:
const { data, error } = await supabase.storage
  .from('resources')
  .upload(`${resourceId}/${file.name}`, file, {
    contentType: file.type,
    upsert: false,
  })

// 4. Store the storage path (not the public URL) in resources.file_url
// e.g. file_url = 'abc123/who-air-quality-report.pdf'
// The signed URL is generated on-demand — never stored
```

---

## Upload Flow (Member — Publication PDF)

Same pattern via `POST /api/mpn/publications/submit`. Members upload to the `publications` bucket under their own user ID subfolder.

---

## Profile Photos

Profile photos go to the `avatars` bucket (public). Path is `public/{user_id}` — upserted on each upload so only one photo per user exists.

```ts
await supabase.storage
  .from('avatars')
  .upload(`public/${userId}`, file, { upsert: true, contentType: file.type })

const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`public/${userId}`)

// Save publicUrl to profiles.profile_photo_url
```

---

## Allowed File Types

| Bucket | Allowed MIME types |
|--------|--------------------|
| `resources` | `application/pdf`, `application/vnd.openxmlformats-officedocument.*`, `application/vnd.ms-excel` |
| `publications` | `application/pdf` |
| `workshop-materials` | `application/pdf`, `image/jpeg`, `image/png`, `image/webp`, `video/mp4` |
| `avatars` | `image/jpeg`, `image/png`, `image/webp` |
| `expert-photos` | `image/jpeg`, `image/png`, `image/webp` |
| `event-covers` | `image/jpeg`, `image/png`, `image/webp` |

Validate MIME types server-side in the API route before calling Supabase Storage — never trust client-provided content type.
