# Feature: Virtual Café

## Routes

| Route | Description |
|-------|-------------|
| `/cafe` | Thread list with category tabs |
| `/cafe/[id]` | Thread detail + real-time reply feed |

---

## UI (from POC)

### Thread list `/community/mpn/cafe`

- **Publicly visible** — no login required to browse
- **Category tabs:** All · Story Ideas · Data & Sources · Expert Contacts · Collaboration · Announcements
- **Thread row:** author avatar + name, thread title, category badge, reply count, time ago, pinned indicator
- Pinned threads appear first regardless of tab
- "New Thread" button — visible to members only; logged-out and pending users see a "Join to post" prompt instead
- Locked threads display a lock icon

### Thread detail `/community/mpn/cafe/[id]`

- **Publicly visible** — full thread body and all replies readable without login
- Thread title, category, author info, posted time
- Thread body (full text)
- Reply count
- **Reply feed** — scrollable, newest at bottom
  - Each reply: avatar, author name + org, time ago, body
- **For logged-out or pending users:** a "Join to participate" banner replaces the reply form — pending users see "Your membership is awaiting approval"
- **For approved members:** reply form at bottom — textarea + Submit button; disabled if thread is locked; calls `POST /api/mpn/cafe/[id]/replies`
- **Real-time:** new replies stream in for all visitors via Supabase Realtime (read-only for non-members)

---

## Real-time Replies

The initial reply list is server-rendered. After mount, a Supabase Realtime channel subscribes to new inserts on `cafe_replies` filtered to the current thread.

```ts
// ThreadDetail.tsx (Client Component for real-time portion)
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ReplyFeed({ threadId, initialReplies }) {
  const [replies, setReplies] = useState(initialReplies)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`thread-${threadId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'cafe_replies',
        filter: `thread_id=eq.${threadId}`
      }, async (payload) => {
        // Fetch the full reply with author profile
        const { data } = await supabase
          .from('cafe_replies')
          .select('*, profiles(full_name, profile_photo_url, organisation)')
          .eq('id', payload.new.id)
          .single()
        if (data) setReplies(prev => [...prev, data])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [threadId])

  return (/* render replies */)
}
```

---

## New Thread Form

```ts
// Fields: title, body (min 20 chars), category (select)
// POST /api/mpn/cafe/threads
// On success: redirect to /cafe/[newId]
```

---

## Reply Form

```ts
// Field: body (textarea, min 10 chars)
// POST /api/mpn/cafe/[id]/replies
// On success: reply appears via Realtime subscription (no manual state update needed)
// Show loading state while submitting; disable form during submit
```

---

## Data Queries

### Thread list
```ts
const { data } = await supabase
  .from('cafe_threads')
  .select(`
    id, title, category, reply_count, is_pinned, is_locked, created_at, updated_at,
    profiles(full_name, profile_photo_url, organisation, country)
  `)
  .order('is_pinned', { ascending: false })
  .order('updated_at', { ascending: false })
```

### Filter by category
```ts
if (category !== 'All') query = query.eq('category', category)
```

### Thread detail + initial replies
```ts
// Thread
const { data: thread } = await supabase
  .from('cafe_threads')
  .select('*, profiles(full_name, profile_photo_url, organisation, country)')
  .eq('id', id)
  .single()

// Replies (server-rendered initial load)
const { data: replies } = await supabase
  .from('cafe_replies')
  .select('*, profiles(full_name, profile_photo_url, organisation)')
  .eq('thread_id', id)
  .order('created_at', { ascending: true })
```

---

## Admin Controls

Admins can from the thread list or detail:
- Pin / unpin a thread
- Lock / unlock a thread (prevents new replies)
- Delete a thread (and all replies — CASCADE)

These are exposed in the thread detail header (for admins only) and in the Admin → Content panel.

---

## Components

| Component | Type | Notes |
|-----------|------|-------|
| `CafePage` | Server Component | Fetches thread list |
| `CategoryTabs` | Client Component | Tab state |
| `ThreadRow` | Server Component | List item |
| `ThreadDetail` | Server Component | Thread body + metadata |
| `ReplyFeed` | Client Component | Real-time subscription + reply list |
| `ReplyForm` | Client Component | Textarea + submit |
| `NewThreadModal` | Client Component | Form overlay |
| `PinnedBadge` | Server Component | Visual indicator |
