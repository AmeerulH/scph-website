# Feature: Admin Dashboard

**Access:** `admin` role only. Enforced by middleware + RLS.

## Routes

| Route | Panel |
|-------|-------|
| `/admin` | Overview (stats) |
| `/admin/members` | Member management |
| `/admin/resources` | Resource management + upload |
| `/admin/publications` | Publication moderation queue |
| `/admin/announcements` | Announcement composer |
| `/admin/analytics` | Usage analytics |

---

## UI (from POC)

- **Layout:** Left sidebar with 6 nav items + main content panel
- On mobile: sidebar collapses to horizontal tab strip at top (`.adm-mobile-tabs`)
- Each nav item switches the active panel (`switchAdmin(panelId, btn)` pattern from POC → in Next.js this is either URL-based routing or client-side tab state)

---

## Panel: Overview (`/admin`)

Stats cards at a glance:

| Stat | Source |
|------|--------|
| Total Members | `COUNT(*) FROM profiles WHERE role = 'member'` |
| Pending Approvals | `COUNT(*) FROM profiles WHERE role = 'pending'` |
| Total Resources | `COUNT(*) FROM resources` |
| Total Publications | `COUNT(*) FROM publications WHERE status = 'approved'` |
| Pending Publications | `COUNT(*) FROM publications WHERE status = 'pending'` |
| Downloads (30 days) | `COUNT(*) FROM resource_downloads WHERE downloaded_at > now() - interval '30 days'` |
| Active Threads | `COUNT(*) FROM cafe_threads WHERE is_locked = false` |

Fetched from `GET /api/admin/stats`.

---

## Panel: Members (`/admin/members`)

- **Pending tab:** list of users with `role = 'pending'` — name, org, country, workshop, registration date
  - Approve button → `POST /api/auth/approve`
  - Reject button (with reason modal) → `POST /api/auth/reject`
- **Active tab:** all members — name, org, country, workshop, join date
  - Suspend action → sets `role = 'rejected'`
  - View profile link
- **Rejected tab:** rejected/suspended members — can reinstate
- **Search:** filter by name or organisation

```ts
// Pending members
const { data } = await supabase
  .from('profiles')
  .select('*, workshops(number, title)')
  .eq('role', 'pending')
  .order('created_at', { ascending: true })  // oldest first — longest waiting
```

---

## Panel: Resources (`/admin/resources`)

- **Table:** all resources — title, type, theme, upload date, download count, visibility
- **Upload button:** opens upload form (title, description, type, theme, source, date, visibility, workshop, tags, file)
  - Calls `POST /api/resources/upload`
- **Edit:** inline edit of metadata (no file re-upload for metadata-only changes)
- **Delete:** soft-delete or hard-delete (admin decision)
- **Filter:** by type, theme, workshop

---

## Panel: Publications (`/admin/publications`)

- **Pending tab:** publications awaiting review — title, author, outlet, date, submitted date
  - "Review" button → opens review modal with full publication details
  - Approve → `POST /api/publications/[id]/review` with `{ action: 'approve' }`
  - Reject → same endpoint with `{ action: 'reject', reason: '...' }`
- **Approved tab:** approved publications — can un-publish (set back to pending)
- **All tab:** everything with status column

```ts
// Pending publications
const { data } = await supabase
  .from('publications')
  .select('*, profiles(full_name, organisation)')
  .eq('status', 'pending')
  .order('created_at', { ascending: true })
```

---

## Panel: Announcements (`/admin/announcements`)

- **Draft list:** existing drafts — title, audience, priority, created date
- **Compose button:** opens announcement form
  - Fields: Title, Body (rich text or markdown), Audience (`all` | `workshop:{n}` | `country:{cc}`), Priority
  - Save as Draft or Send Now
- "Send" button → `POST /api/announcements/send` → emails target audience via Resend, marks as sent
- Sent announcements are read-only history

```ts
// All announcements
const { data } = await supabase
  .from('announcements')
  .select('*, profiles(full_name)')
  .order('created_at', { ascending: false })
```

---

## Panel: Analytics (`/admin/analytics`)

Simple usage analytics — no external service needed for v1.

| Metric | Query |
|--------|-------|
| Downloads over time | `resource_downloads` grouped by day |
| Most downloaded resources | `resources` ordered by `download_count DESC` |
| Most viewed publications | `publications` ordered by `view_count DESC` |
| Member growth | `profiles` `role = 'member'` grouped by `date_trunc('month', created_at)` |
| Active café threads | `cafe_threads` ordered by `reply_count DESC` |

Charts rendered with a lightweight library (Recharts or Chart.js — already available in the SCPH stack).

---

## Components

| Component | Type | Notes |
|-----------|------|-------|
| `AdminLayout` | Server Component | Sidebar + panel wrapper |
| `AdminSidebar` | Client Component | Active panel state |
| `AdminMobileTabs` | Client Component | Mobile horizontal tabs |
| `StatCard` | Server Component | KPI tile |
| `MembersTable` | Client Component | Pending/Active/Rejected tabs + actions |
| `ApproveRejectModal` | Client Component | Confirmation with reason field |
| `ResourcesTable` | Client Component | Resource list + upload form |
| `PublicationsQueue` | Client Component | Pending review list + modal |
| `AnnouncementComposer` | Client Component | Draft form + send action |
| `AnalyticsCharts` | Client Component | Charts (Recharts) |
