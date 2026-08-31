# Feature: Resources Library

## Routes

| Route | Description |
|-------|-------------|
| `/resources` | Main listing with filter sidebar |
| `/resources/[id]` | Resource detail + download |
| `/resources/workshop/[id]` | Workshop materials detail + photo gallery |

---

## UI (from POC)

### Listing page `/resources`

- **Layout:** filter sidebar (left, sticky) + resource list (right)
- **Tabs:** "Shared Resources" | "Workshop Resources" — switching tabs changes the list, filter sidebar updates accordingly
- **Filter sidebar:** collapsible on mobile, always visible on desktop
  - Shared tab filters: Type, Theme
  - Workshop tab filters: Workshop number
- **Resource card:** title, type badge, theme, source, date, download count
- **Search:** global search overlay (not inline)

### Resource detail `/resources/[id]`

- Title, type, theme, description, source, published date
- Download button → calls `/api/mpn/resources/[id]/download` → opens signed URL in new tab
- If `article_url` set: "View Article" external link button
- Tags displayed as chips

### Workshop detail `/resources/workshop/[id]`

- Workshop banner (cover image), workshop number, title, date, location, participant count
- Tabs: "Materials" (downloadable files) | "Gallery" (photo grid)
- Materials tab: list of files with download buttons
- Gallery tab: photo grid, lightbox on click

---

## Data Queries

### Listing — shared resources
```ts
const { data } = await supabase
  .from('resources')
  .select('id, title, type, theme, source, published_date, download_count, tags')
  .is('workshop_id', null)
  .eq('visibility', 'members')
  .order('created_at', { ascending: false })
```

### Listing — workshop resources
```ts
const { data } = await supabase
  .from('resources')
  .select('id, title, type, theme, source, published_date, download_count, workshop_id, workshops(number, title, location)')
  .not('workshop_id', 'is', null)
  .order('created_at', { ascending: false })
```

### Filter by type + theme (client-side state, re-query or filter in memory)
```ts
let query = supabase.from('resources').select('*').is('workshop_id', null)
if (type)  query = query.eq('type', type)
if (theme) query = query.eq('theme', theme)
```

### Resource detail
```ts
const { data } = await supabase
  .from('resources')
  .select('*, profiles(full_name, organisation)')
  .eq('id', id)
  .single()
```

---

## Filter Options

**Type:** Research · Report · Toolkit · Guide · Dataset · Book · Video  
**Theme:** Climate · Air Pollution · Planetary Health · Water · Biodiversity · Food Systems

(Options can be hardcoded in a `lib/filter-options.ts` file — no CMS needed)

---

## Download Flow

1. Member clicks Download
2. Client calls `GET /api/mpn/resources/[id]/download`
3. Server generates 60s signed URL + logs download
4. Client opens signed URL in new tab (PDF viewer in browser)

---

## Components

| Component | Type | Notes |
|-----------|------|-------|
| `ResourcesPage` | Server Component | Fetches initial list |
| `ResourceFilterSidebar` | Client Component | Manages active filter state |
| `ResourceCard` | Server Component | Stateless card |
| `ResourceTabs` | Client Component | Switches between Shared/Workshop tabs |
| `ResourceDetail` | Server Component | Full detail view |
| `WorkshopDetail` | Server Component | Workshop page with gallery |
| `PhotoGallery` | Client Component | Lightbox interaction |
| `DownloadButton` | Client Component | Calls download API, shows loading state |
