# Feature: Events & Webinars

## Routes

| Route | Description |
|-------|-------------|
| `/events` | Events listing — public page |
| `/webinars` | Webinar library — public |

---

## Events `/events`

### UI (from POC)

- **Access:** Public (no login required) — events are a recruitment surface for the MPN
- **Tabs:** Upcoming · Past
- **Event card:** cover image, event type badge, title, date, location, short description, "Register" / "View Details" button
- Upcoming events sorted ascending (soonest first)
- Past events sorted descending (most recent first)
- Members-only events show a lock badge for logged-out visitors

### Data Query

```ts
// Upcoming
const { data: upcoming } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'upcoming')
  .order('date', { ascending: true })

// Past
const { data: past } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'past')
  .order('date', { ascending: false })
```

> Events with `is_members_only = true` are visible in the list to logged-out visitors (to show the network is active) but the registration link redirects to `/login`.

### Event Status Management

There's no cron job — admin manually sets `status = 'past'` after an event ends (or a future automated migration can be added). This is managed in the Admin → Events panel.

---

## Webinars `/webinars`

### UI (from POC)

- **Access:** Public. The catalogue and embeds are indexable; a future
  members-only webinar must withhold its video URL until its access rule is
  explicitly designed.
- **Layout:** Filter sidebar (Theme) + webinar grid
- **Webinar card:** thumbnail, title, speaker, date, duration, theme badge
- Clicking a card opens an embedded video player (YouTube/Vimeo iframe) in a modal

### Data Query

```ts
const { data } = await supabase
  .from('webinars')
  .select('*')
  .order('date', { ascending: false })
```

### Filter by theme
```ts
if (theme) query = query.eq('theme', theme)
```

### Video Embed

Store the embed URL (not watch URL) in `webinars.video_url`:
- YouTube: `https://www.youtube.com/embed/{videoId}`
- Vimeo: `https://player.vimeo.com/video/{videoId}`

The modal renders an `<iframe>` with this URL. No external SDK required.

---

## Components

| Component | Type | Notes |
|-----------|------|-------|
| `EventsPage` | Server Component | Fetches upcoming + past events |
| `EventTabs` | Client Component | Upcoming/Past toggle |
| `EventCard` | Server Component | Stateless card |
| `WebinarsPage` | Server Component | Fetches webinar list |
| `WebinarFilterSidebar` | Client Component | Theme filter |
| `WebinarCard` | Server Component | Thumbnail card |
| `VideoModal` | Client Component | iframe embed overlay |
