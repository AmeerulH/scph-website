# Feature: Members & Committee

## Routes

| Route | Description |
|-------|-------------|
| `/members` | Full network member list |
| `/committee` | Steering committee directory |
| `/profile` | Own profile view + edit |

---

## Members List `/community/mpn/members`

**Publicly visible** — no login required to browse the network.

### UI (from POC)

- **Search:** text input filters by name or organisation (client-side)
- **Filter:** Country dropdown
- **Member card (compact row):** avatar, name, organisation, country, workshop attended badge
- Clicking a member opens their public profile (name, org, country, bio, workshop)
- **Email address:** shown in the profile modal only if `email_visible = true` AND the viewer is logged in
- No detail page — profile info shown in a modal or slide-in panel

### Data Query

```ts
const { data } = await supabase
  .from('profiles')
  .select('id, full_name, organisation, country, profile_photo_url, workshop_id, workshops(number, title)')
  .eq('role', 'member')
  .order('full_name')
```

> Members with `email_visible = false` (default) have their email hidden — RLS policy on `profiles` excludes the `email` column for non-admin selectors unless the member opts in.

---

## Committee Directory `/committee`

### UI (from POC)

- Grid of committee member cards
- **Card:** photo, name, position title, organisation, country, short bio
- No filter sidebar — committee is small enough for a simple grid
- Sorted by `sort_order`

### Data Query

```ts
const { data } = await supabase
  .from('committee_members')
  .select('*')
  .eq('is_active', true)
  .order('sort_order')
```

---

## Profile Page `/profile`

### UI (from POC)

- **View mode:** avatar, name, role badge, organisation, country, bio, LinkedIn link, workshop attended, publications list (own)
- **Edit mode:** inline edit form for name, organisation, country, bio, linkedin_url, email_visible toggle
- Photo upload button (calls `POST /api/profile/photo`)
- "My Publications" tab: list of own publications with status badges (pending / approved / rejected)
- "My Activity" tab: recent café threads started, replies posted

### Data Queries

```ts
// Own profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*, workshops(number, title, location)')
  .eq('id', userId)
  .single()

// Own publications
const { data: publications } = await supabase
  .from('publications')
  .select('id, title, status, published_date, outlet')
  .eq('author_id', userId)
  .order('created_at', { ascending: false })
```

### Profile Edit

```ts
// PATCH via Supabase client directly (RLS allows own row update)
await supabase
  .from('profiles')
  .update({ full_name, organisation, country, bio, linkedin_url, email_visible })
  .eq('id', userId)
```

---

## Components

| Component | Type | Notes |
|-----------|------|-------|
| `MembersPage` | Server Component | Fetches member list |
| `MemberSearch` | Client Component | Client-side name/org filter |
| `MemberRow` | Server Component | Compact list row |
| `MemberProfileModal` | Client Component | Slide-in panel |
| `CommitteePage` | Server Component | Fetches committee grid |
| `CommitteeCard` | Server Component | Stateless card |
| `ProfilePage` | Server Component | Own profile data |
| `ProfileEditForm` | Client Component | Inline edit + photo upload |
| `OwnPublicationsList` | Server Component | With status badges |
