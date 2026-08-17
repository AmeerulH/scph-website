# Deployment & Integration

## Architecture

MPN is a **route within the existing SCPH Next.js app** — not a separate application.

| Item | Approach |
|------|----------|
| URL | `/community/mpn` on `sunwayplanetaryhealth.com` — same domain, same deployment |
| Code location | `src/app/(scph)/community/mpn/` inside the existing SCPH repo |
| Deployment | Same Vercel project as SCPH — MPN ships with every SCPH deploy |
| Design tokens | Inherited automatically from SCPH's Tailwind config and `globals.css` |
| Fonts | Already loaded in SCPH root layout — no extra config needed |
| Analytics | SCPH Vercel Analytics covers MPN routes; MPN Admin panel shows filtered MPN stats |
| Sanity | Not used for MPN member data. May optionally use SCPH Sanity for MPN landing/about copy. |
| Components | Colocated under `src/components/mpn/` — separate from SCPH components to avoid naming conflicts |
| API routes | Under `src/app/api/mpn/` — prefixed to avoid collisions with existing SCPH API routes |

---

## Environment Variables

Add these to the existing SCPH project's `.env.local` and Vercel environment settings. Prefixed with `MPN_` to avoid clashing with any existing SCPH Supabase vars.

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_MPN_SUPABASE_URL` | Client + Server | MPN Supabase project URL |
| `NEXT_PUBLIC_MPN_SUPABASE_ANON_KEY` | Client + Server | MPN public anon key |
| `MPN_SUPABASE_SERVICE_ROLE_KEY` | Server only | MPN admin key — never sent to browser |
| `RESEND_API_KEY` | Server only | Resend API key (may already exist in SCPH) |
| `MPN_ADMIN_EMAIL` | Server only | Email(s) that receive new pending member alerts |

Set in Vercel → existing SCPH project → Environment Variables. Use a separate MPN Supabase project for staging (Preview deployments).

---

## Supabase Project Setup

1. Create new Supabase project (separate from any existing SCPH Sanity/data store)
2. Run schema SQL in the SQL editor (tables, triggers, functions, indexes) — see [`../database/README.md`](../database/README.md)
3. Enable RLS on all tables — see [`../auth/README.md`](../auth/README.md)
4. Create Storage buckets with policies — see [`../storage/README.md`](../storage/README.md)
5. Configure Auth: enable email confirmations, set site URL to `https://sunwayplanetaryhealth.com`
6. Set up Resend API key

---

## Adding MPN to the Existing SCPH Vercel Project

```bash
# From the SCPH repo root — add MPN env vars to existing project
vercel env add NEXT_PUBLIC_MPN_SUPABASE_URL production
vercel env add NEXT_PUBLIC_MPN_SUPABASE_ANON_KEY production
vercel env add MPN_SUPABASE_SERVICE_ROLE_KEY production
vercel env add RESEND_API_KEY production        # skip if already set
vercel env add MPN_ADMIN_EMAIL production

# Deploy via normal SCPH deploy process — no separate step needed
```

Also add the MPN Supabase CDN to `next.config.ts` `remotePatterns`:
```ts
{ hostname: '*.supabase.co' }
```

---

## Staging Environment

Use a separate MPN Supabase project for staging. SCPH's existing Vercel Preview deployments (PR branches) will use staging env vars.

| Environment | Vercel | MPN Supabase |
|-------------|--------|-------------|
| Production | `main` branch → `sunwayplanetaryhealth.com` | Production project |
| Staging | PR branches → `*.vercel.app` previews | Staging project |

---

## Google Indexing

Public MPN pages should be indexed by Google. Add MPN routes to `src/app/sitemap.ts` (the existing SCPH sitemap file) and to `src/lib/public-indexable-paths.ts`.

Pages to index:
- `/community/mpn` (landing/about)
- `/community/mpn/resources` + `/community/mpn/resources/[id]`
- `/community/mpn/publications` + `/community/mpn/publications/[id]`
- `/community/mpn/experts` + `/community/mpn/experts/[id]`
- `/community/mpn/members`
- `/community/mpn/committee`
- `/community/mpn/cafe` + `/community/mpn/cafe/[id]`
- `/community/mpn/events`
- `/community/mpn/webinars`

Pages to **noindex** (add `<meta name="robots" content="noindex">` or exclude from sitemap):
- `/community/mpn/login`
- `/community/mpn/pending`
- `/community/mpn/profile`
- `/community/mpn/admin/**`
- `/community/mpn/publications/submit`

---

## Performance

MPN should meet the same Lighthouse Performance ≥ 80 bar as the main SCPH site (per `AGENTS.md §7`).

Key practices:
- Server Components by default (minimal client JS bundle)
- `next/image` for all images with `sizes` prop
- Fonts loaded via `next/font/google` (automatic preload)
- Supabase queries in Server Components avoid client-side waterfalls
- Real-time (Café) is scoped to Client Components that need it — not the whole app
