# Feature: Publications

## Routes

| Route | Description |
|-------|-------------|
| `/publications` | Catalogue with filter sidebar |
| `/publications/[id]` | Publication detail |
| `/publications/submit` | Member submission form |

---

## UI (from POC)

### Listing page `/publications`

- **Layout:** filter sidebar (left, sticky) + publication list (right)
- **Filter sidebar:** Type, Theme, Country, Language
- **Publication card:** title, author name + org, outlet, date, type badge, country flag, language
- Each card links to detail page

### Publication detail `/publications/[id]`

- Title, author (with avatar), outlet, published date, country, language, theme, type
- Description / summary
- Tags as chips
- "Read Article" button (external link) and/or "Download PDF" button (signed URL)
- Author profile hover card (name, org, country, bio) on desktop

### Submit form `/publications/submit`

- Fields: Title, Outlet, Published Date, Country, Language, Type, Theme, Description, Tags, Article URL (optional), PDF upload (optional)
- At least one of article_url or PDF must be provided
- On submit → `POST /api/mpn/publications/submit` → success confirmation screen
- Status shows as "Pending Review" on the member's profile until approved

---

## Moderation Flow

```
Member submits
  → status = 'pending'
  → Admin sees it in /admin/publications (pending queue)

Admin reviews
  → Approve → status = 'approved', author gets email, appears in catalogue
  → Reject  → status = 'rejected', author gets email with reason
```

Members can only see their own rejected/pending publications — not others'.

---

## Data Queries

### Listing (approved only)
```ts
const { data } = await supabase
  .from('publications')
  .select(`
    id, title, outlet, published_date, country, language, type, theme, description, tags,
    profiles(id, full_name, organisation, profile_photo_url)
  `)
  .eq('status', 'approved')
  .order('published_date', { ascending: false })
```

### With filters
```ts
let query = supabase.from('publications').select('...').eq('status', 'approved')
if (type)     query = query.eq('type', type)
if (theme)    query = query.eq('theme', theme)
if (country)  query = query.eq('country', country)
if (language) query = query.eq('language', language)
```

### Detail page
```ts
const { data } = await supabase
  .from('publications')
  .select('*, profiles(*)')
  .eq('id', id)
  .eq('status', 'approved')
  .single()

// Increment view count through a server-side endpoint or RPC. Do not give
// public clients UPDATE permission on publication rows merely for this counter.
```

### Member's own publications (profile page)
```ts
const { data } = await supabase
  .from('publications')
  .select('id, title, status, created_at')
  .eq('author_id', userId)
  .order('created_at', { ascending: false })
```

---

## Filter Options

**Type:** Article · Feature · Research Paper · Op-Ed · Investigative · Photo Essay  
**Theme:** Climate · Air Pollution · Planetary Health · Water · Biodiversity · Food Systems  
**Country:** Populated dynamically from existing publications  
**Language:** Populated dynamically from existing publications

---

## Components

| Component | Type | Notes |
|-----------|------|-------|
| `PublicationsPage` | Server Component | Fetches approved publications |
| `PublicationFilterSidebar` | Client Component | Filter state management |
| `PublicationCard` | Server Component | Stateless list item |
| `PublicationDetail` | Server Component | Full detail view |
| `AuthorHoverCard` | Client Component | mouseenter/mousemove/mouseout events (from POC) |
| `SubmitPublicationForm` | Client Component | File upload + form validation |
| `PublicationStatusBadge` | Server Component | pending / approved / rejected pill |
