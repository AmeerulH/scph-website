# Feature: Expert Directory

## Routes

| Route | Description |
|-------|-------------|
| `/experts` | Expert grid with filter sidebar |
| `/experts/[id]` | Expert detail page |

---

## UI (from POC)

### Listing `/community/mpn/experts`

**Publicly visible** — no login required.

- **Layout:** filter sidebar (left) + expert grid (right)
- **Filter sidebar:** Expertise tag, Country
- **Expert card:** photo, name, role, organisation, country, top 3 expertise tags, publication count
- Cards link to detail page
- Hover card on author name references in other pages (publications, café threads)

### Expert detail `/community/mpn/experts/[id]`

**Publicly visible** — profile open to all.

- Large photo, name, role, organisation, country
- Expertise tags
- Bio paragraph
- Contact buttons:
  - **Email** — copies email to clipboard. Only shown if `email` field is set AND viewer is logged in (RLS gates the email column to authenticated users)
  - **LinkedIn** — opens linkedin_url in new tab (always visible)
- Publication count badge

---

## Data Queries

### Listing
```ts
const { data } = await supabase
  .from('experts')
  .select('id, full_name, role, organisation, country, expertise, photo_url, publication_count')
  .eq('is_active', true)
  .order('full_name')
```

### Filter by expertise tag
```ts
query = query.contains('expertise', [selectedTag])
```

### Filter by country
```ts
query = query.eq('country', country)
```

### Detail page
```ts
const { data } = await supabase
  .from('experts')
  .select('*')   // includes email (RLS ensures members only can see it)
  .eq('id', id)
  .single()
```

---

## Filter Options

**Expertise:** Populated dynamically — `SELECT DISTINCT unnest(expertise) FROM experts ORDER BY 1`  
**Country:** Populated dynamically from existing expert rows

---

## Author Hover Card

The hover card appears on expert name references in publications and café threads. It is a Client Component that fetches the expert profile on `mouseenter` and positions itself near the cursor.

```ts
// ExpertHoverCard.tsx
const [data, setData] = useState(null)
const [pos, setPos] = useState({ x: 0, y: 0 })

async function onMouseEnter(expertId: string) {
  const { data } = await supabase.from('experts')
    .select('full_name, role, organisation, country, photo_url, expertise')
    .eq('id', expertId).single()
  setData(data)
}

function onMouseMove(e: MouseEvent) {
  setPos({ x: e.clientX + 16, y: e.clientY - 8 })
}
```

The card is `position: fixed; pointer-events: none; z-index: 9999` — matches POC CSS.

---

## Contact Button Behaviour

- **Email button:** `navigator.clipboard.writeText(expert.email)` → toast "Email copied"
- **LinkedIn button:** `window.open(expert.linkedin_url, '_blank')`
- Both buttons only render if the respective field is non-null

---

## Components

| Component | Type | Notes |
|-----------|------|-------|
| `ExpertsPage` | Server Component | Fetches active experts |
| `ExpertFilterSidebar` | Client Component | Filter state |
| `ExpertCard` | Server Component | Grid card |
| `ExpertDetail` | Server Component | Full detail view |
| `ExpertHoverCard` | Client Component | Floating hover card |
| `ContactButtons` | Client Component | Email copy + LinkedIn open |
