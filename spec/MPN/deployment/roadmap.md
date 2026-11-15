# Development Roadmap

5 phases across ~7 weeks. Resolved Phase 0 decisions are in
[`../DECISIONS.md`](../DECISIONS.md); remaining launch choices do not block the
foundation.

---

## Phase 1 — Foundation (Weeks 1–2)

**Goal:** Working auth, database, and admin approval flow. No member-facing pages yet.

- [ ] Supabase project setup (tables, RLS policies, storage buckets, triggers)
- [ ] Next.js project scaffold (Tailwind, Supabase client, SCPH tokens)
- [ ] `proxy.ts` — session refresh and route protection by role (Next.js 16)
- [ ] Login / Register page (Supabase Auth, email verification)
- [ ] Pending approval holding page
- [ ] DB trigger: auto-create `profiles` row on email verification
- [ ] `POST /api/mpn/auth/approve` + `POST /api/mpn/auth/reject`
- [ ] Admin members panel (pending tab only — approve/reject)
- [ ] Admin notification email (Resend) on new pending member
- [ ] Welcome / rejection emails to member
- [ ] Database seed scripts: workshops, experts, committee members

**Deliverable:** Admin can register, log in, see pending members, approve/reject them. Approved members can log in and land on an "under construction" home page.

---

## Phase 2 — Core Member Pages (Weeks 3–4)

**Goal:** Members can access resources, publications, experts, and their profile.

- [ ] FloatingNav + MobileMenu (Client Components)
- [ ] FilterLayout + FilterSidebar components
- [ ] Resources page (list + filter sidebar, Shared/Workshop tabs)
- [ ] Resource detail page + `GET /api/mpn/resources/[id]/download`
- [ ] Workshop materials detail + photo gallery
- [ ] `POST /api/mpn/resources/upload` (admin)
- [ ] Publications catalogue (list + filters)
- [ ] Publication detail page (with AuthorHoverCard)
- [ ] `POST /api/mpn/publications/submit` + submit form
- [ ] Expert directory (grid + filter sidebar)
- [ ] Expert detail page (contact buttons)
- [ ] Profile page (view + edit + photo upload)
- [ ] Events page (public, upcoming/past tabs)

**Deliverable:** Full resources, publications, experts, and profile flows working end-to-end.

---

## Phase 3 — Community Features (Week 5)

**Goal:** Virtual Café, webinars, members list, committee directory, search.

- [ ] Virtual Café thread list (category tabs)
- [ ] Thread detail page
- [ ] `ReplyFeed` Client Component + Supabase Realtime subscription
- [ ] `POST /api/mpn/cafe/threads` + `POST /api/mpn/cafe/[id]/replies`
- [ ] New thread form (modal)
- [ ] Webinar library (grid + filter + VideoModal)
- [ ] Members list (search + country filter + profile modal)
- [ ] Committee directory
- [ ] Global search (`GET /api/mpn/search` + search overlay UI)

**Deliverable:** Full community features. Members can discuss, search, and browse the network.

---

## Phase 4 — Admin Panel (Week 6)

**Goal:** Full admin dashboard complete.

- [ ] Admin layout (sidebar + mobile tab strip)
- [ ] Overview stats panel (`GET /api/mpn/admin/stats`)
- [ ] Members panel (all tabs: pending / active / rejected)
- [ ] Resources management panel (upload, edit, delete)
- [ ] Publications moderation queue + review modal
- [ ] `POST /api/mpn/publications/[id]/review`
- [ ] Publication approved/rejected emails
- [ ] Announcements composer + `POST /api/mpn/announcements/send`
- [ ] Audience resolution + Resend batch send
- [ ] Analytics panel (charts: downloads, member growth, top content)
- [ ] Admin controls in Café (pin, lock, delete thread)
- [ ] Events management (add/edit/status toggle)

**Deliverable:** Admins have full control over content, members, and communications.

---

## Phase 5 — Polish & Launch (Week 7)

**Goal:** Production-ready, tested, deployed.

- [ ] Mobile responsive QA — all pages at 375px, 768px, 1280px
- [ ] Email template HTML polish
- [ ] Accessibility audit (keyboard nav, ARIA labels, colour contrast)
- [ ] Image optimisation (`next/image` sizes, WebP, placeholder blur)
- [ ] Lighthouse scores ≥ 80 on all routes (Vercel preview)
- [ ] Error states: empty states, loading skeletons, 404/500 pages
- [ ] Bulk member import script (past workshop attendees)
- [ ] Staging review with SCPH team
- [ ] Confirm production deployment at `/community/mpn` (no MPN subdomain DNS)
- [ ] Production deploy
- [ ] Community tab link added to SCPH main site nav

**Deliverable:** Live portal at production URL with initial member cohort imported.

---

## Post-Launch (v2 ideas)

- Café reply email digest notifications
- Google OAuth login
- Expert self-registration flow
- Public expert directory (un-gated)
- Publication RSS feed
- Member directory opt-in/opt-out granular privacy controls
- Workshop-specific sub-communities
