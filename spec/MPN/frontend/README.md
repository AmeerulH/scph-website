# Frontend Architecture

## Routes

See [`../auth/README.md`](../auth/README.md) for access control. Full route table:

| Route | Layout group | Access |
|-------|-------------|--------|
| `/login` | `(public)` | Public |
| `/pending` | `(public)` | Public |
| `/` | `(public)` | Public |
| `/resources/**` | `(member)` | Member |
| `/publications/**` | `(member)` | Member |
| `/experts/**` | `(member)` | Member |
| `/cafe/**` | `(member)` | Member |
| `/events` | `(member)` | Member |
| `/webinars` | `(member)` | Member |
| `/members` | `(member)` | Member |
| `/committee` | `(member)` | Member |
| `/profile` | `(member)` | Member |
| `/admin/**` | `(admin)` | Admin |

---

## Directory Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx          # Minimal layout (no nav for logged-out users)
│   │   ├── page.tsx            # Landing / About MPN
│   │   ├── login/page.tsx
│   │   └── pending/page.tsx    # "Awaiting approval" holding page
│   ├── (member)/
│   │   ├── layout.tsx          # FloatingNav + MobileMenu + footer
│   │   ├── resources/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── workshop/[id]/page.tsx
│   │   ├── publications/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── submit/page.tsx
│   │   ├── experts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── cafe/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── events/page.tsx
│   │   ├── webinars/page.tsx
│   │   ├── members/page.tsx
│   │   ├── committee/page.tsx
│   │   └── profile/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx          # Admin sidebar layout
│   │   └── admin/
│   │       ├── page.tsx        # Overview stats
│   │       ├── members/page.tsx
│   │       ├── resources/page.tsx
│   │       ├── publications/page.tsx
│   │       ├── announcements/page.tsx
│   │       └── analytics/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── approve/route.ts
│   │   │   └── reject/route.ts
│   │   ├── resources/
│   │   │   ├── upload/route.ts
│   │   │   └── [id]/download/route.ts
│   │   ├── publications/
│   │   │   ├── submit/route.ts
│   │   │   └── [id]/review/route.ts
│   │   ├── announcements/send/route.ts
│   │   ├── cafe/
│   │   │   ├── threads/route.ts
│   │   │   └── [id]/replies/route.ts
│   │   ├── search/route.ts
│   │   ├── admin/stats/route.ts
│   │   └── profile/photo/route.ts
│   ├── layout.tsx              # Root: fonts, global styles
│   └── middleware.ts
├── components/
│   ├── nav/
│   │   ├── FloatingNav.tsx     # Pill nav (position: fixed)
│   │   ├── MobileMenu.tsx      # Hamburger drawer
│   │   └── NavLink.tsx
│   ├── ui/                     # Shared primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── Avatar.tsx
│   ├── filter/
│   │   ├── FilterSidebar.tsx   # Sticky sidebar wrapper
│   │   ├── FilterBtn.tsx       # Individual filter pill
│   │   └── FilterLayout.tsx    # flex: sidebar + main content
│   ├── resources/
│   ├── publications/
│   ├── experts/
│   ├── cafe/
│   ├── events/
│   ├── members/
│   └── admin/
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client (singleton)
│   │   ├── server.ts           # Server client (createServerClient)
│   │   └── middleware.ts       # Middleware client helper
│   ├── types/
│   │   └── database.ts         # TypeScript types mirroring DB schema
│   └── utils/
│       ├── date.ts             # formatDate, timeAgo
│       ├── files.ts            # formatFileSize
│       └── filter-options.ts   # Hardcoded filter lists
└── styles/
    └── globals.css             # SCPH design tokens + base styles
```

---

## Server vs Client Components

| Component | Type | Reason |
|-----------|------|--------|
| All page components | **Server** | Data fetching at request time |
| FilterSidebar | **Client** | Manages active filter state |
| ReplyFeed (Café) | **Client** | Supabase Realtime subscription |
| MobileMenu / FloatingNav | **Client** | Toggle/open state |
| Upload forms | **Client** | File API + FormData |
| Admin tables with approve/reject | **Client** | Optimistic UI after actions |
| Toast | **Client** | Transient UI state |
| VideoModal (Webinars) | **Client** | Open/close state |
| ExpertHoverCard | **Client** | mouseenter/mousemove positioning |
| ProfileEditForm | **Client** | Form state |

Rule: start with Server Component; add `'use client'` only when the component needs hooks, browser APIs, or event listeners.

---

## Navigation

### FloatingNav

Matches POC: `position: fixed; top: calc(var(--bar-h) + 10px)`

- Shows logo + nav links on desktop
- Shows logo + hamburger on mobile
- Active link highlighted with `--blue` background pill

### MobileMenu

- `position: fixed` drawer, slides in from top below nav bar
- Closes on outside click or nav item tap
- Matches POC `.mobile-menu.open` behaviour

### Filter Sidebar

- Desktop: always visible, sticky, scrollable (`height: calc(100vh - ...)`)
- Mobile: collapsed by default, toggle button reveals it
- Matches POC `toggleFilterSidebar()` pattern

---

## Supabase Client Setup

```ts
// lib/supabase/client.ts — browser singleton
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — per-request server client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}
```
