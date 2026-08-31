# Database Schema

All tables in the `public` schema. UUIDs as primary keys throughout. `auth.users` is managed by Supabase Auth — do not alter it directly.

This schema contains 12 application tables. The access model, profile trigger,
public-safe views, and RLS requirements are canonical in
[`../DECISIONS.md`](../DECISIONS.md).

## Implementation requirements

- Create `workshops` before `profiles`, because `profiles.workshop_id` references it.
- Enable RLS on every application table. Base tables containing private fields
  must not receive broad anonymous `SELECT` policies.
- Create `WITH (security_invoker = true)` public views that omit private
  columns: `profiles_directory` (email), `experts_public` (email),
  `resources_public` (file path), and a public approved-publication view
  without private PDF storage paths.
- Admin-only server code reads contact emails and private Storage paths after
  validating the authenticated viewer's access. RLS cannot redact individual
  columns from `SELECT *`.
- Use the email-confirmation update trigger documented in
  [`../auth/README.md`](../auth/README.md), not an `AFTER INSERT` trigger on
  `auth.users`.
- Add a standard `updated_at` trigger for mutable tables (`profiles` and
  `cafe_threads` at minimum).

---

## Table Overview

| Table | Purpose |
|-------|---------|
| [`profiles`](#profiles) | Extends `auth.users` with MPN-specific fields |
| [`workshops`](#workshops) | SCPH Capacity Development Workshops |
| [`resources`](#resources) | Shared + workshop-specific resource library |
| [`publications`](#publications) | Member-submitted journalism and research |
| [`experts`](#experts) | Expert directory for source discovery |
| [`cafe_threads`](#cafe_threads) | Virtual Café discussion threads |
| [`cafe_replies`](#cafe_replies) | Replies to café threads |
| [`events`](#events) | Upcoming and past events |
| [`webinars`](#webinars) | Webinar library |
| [`announcements`](#announcements) | Admin-authored network announcements |
| [`committee_members`](#committee_members) | Steering committee directory |
| [`resource_downloads`](#resource_downloads) | Download audit log |

---

## profiles

Extends `auth.users` (1:1). Created automatically via DB trigger on email verification.

```sql
CREATE TABLE profiles (
  id                uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         text NOT NULL,
  email             text NOT NULL,
  organisation      text,
  country           text,                          -- ISO 3166-1 alpha-2
  role              text NOT NULL DEFAULT 'pending'
                    CHECK (role IN ('pending', 'member', 'admin', 'rejected')),
  workshop_id       uuid REFERENCES workshops(id),
  bio               text,
  profile_photo_url text,
  linkedin_url      text,
  email_visible     boolean NOT NULL DEFAULT false, -- permits authenticated viewers to request email
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
```

---

## workshops

```sql
CREATE TABLE workshops (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number            integer NOT NULL,              -- sequence: 1, 2, 3…
  title             text NOT NULL,                 -- e.g. "Climate, Air Pollution and Health"
  date              date NOT NULL,
  location          text NOT NULL,                 -- e.g. "Kuala Lumpur, Malaysia"
  participant_count integer,
  description       text,
  cover_image_url   text,
  created_at        timestamptz NOT NULL DEFAULT now()
);
```

---

## resources

```sql
CREATE TABLE resources (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  description      text,
  type             text NOT NULL,  -- Research | Report | Toolkit | Guide | Dataset | Book | Video
  theme            text NOT NULL,  -- Climate | Air Pollution | Planetary Health | …
  source           text,           -- publisher / organisation
  published_date   date,
  article_url      text,           -- external link
  file_url         text,           -- Supabase Storage path (gated PDF)
  visibility       text NOT NULL DEFAULT 'members'
                   CHECK (visibility IN ('members', 'workshop_alumni', 'admins')),
  workshop_id      uuid REFERENCES workshops(id), -- NULL = shared resource
  uploaded_by      uuid NOT NULL REFERENCES profiles(id),
  download_count   integer NOT NULL DEFAULT 0,
  tags             text[],
  search_vector    tsvector GENERATED ALWAYS AS (
                     to_tsvector('english',
                       coalesce(title, '') || ' ' ||
                       coalesce(description, '') || ' ' ||
                       coalesce(theme, '') || ' ' ||
                       coalesce(source, '')
                     )
                   ) STORED,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX resources_search_idx ON resources USING GIN(search_vector);
CREATE INDEX resources_workshop_idx ON resources(workshop_id);
CREATE INDEX resources_theme_idx ON resources(theme);
CREATE INDEX resources_type_idx ON resources(type);
```

---

## publications

```sql
CREATE TABLE publications (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  author_id      uuid NOT NULL REFERENCES profiles(id),
  outlet         text,                    -- publication name / news outlet
  published_date date,
  country        text,                    -- country of publication
  language       text,
  type           text NOT NULL,           -- Article | Feature | Research Paper | Op-Ed | Investigative | …
  theme          text NOT NULL,
  description    text,                    -- short summary
  tags           text[],
  article_url    text,                    -- external link
  pdf_url        text,                    -- Supabase Storage
  status         text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by    uuid REFERENCES profiles(id),
  reviewed_at    timestamptz,
  view_count     integer NOT NULL DEFAULT 0,
  search_vector  tsvector GENERATED ALWAYS AS (
                   to_tsvector('english',
                     coalesce(title, '') || ' ' ||
                     coalesce(description, '') || ' ' ||
                     coalesce(theme, '') || ' ' ||
                     coalesce(outlet, '')
                   )
                 ) STORED,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX publications_search_idx ON publications USING GIN(search_vector);
CREATE INDEX publications_status_idx ON publications(status);
CREATE INDEX publications_author_idx ON publications(author_id);
```

---

## experts

```sql
CREATE TABLE experts (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name          text NOT NULL,
  role               text NOT NULL,       -- job title
  organisation       text NOT NULL,
  country            text NOT NULL,
  expertise          text[],              -- searchable tags: "Air Quality", "Climate Policy", …
  bio                text,
  email              text,                -- returned only to authenticated server-side requests
  linkedin_url       text,
  photo_url          text,
  publication_count  integer NOT NULL DEFAULT 0,   -- cached; updated by trigger
  is_active          boolean NOT NULL DEFAULT true,
  search_vector      tsvector GENERATED ALWAYS AS (
                       to_tsvector('english',
                         coalesce(full_name, '') || ' ' ||
                         coalesce(role, '') || ' ' ||
                         coalesce(organisation, '') || ' ' ||
                         coalesce(bio, '') || ' ' ||
                         array_to_string(coalesce(expertise, '{}'), ' ')
                       )
                     ) STORED,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX experts_search_idx ON experts USING GIN(search_vector);
CREATE INDEX experts_country_idx ON experts(country);
```

---

## cafe_threads

```sql
CREATE TABLE cafe_threads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  body         text NOT NULL,
  author_id    uuid NOT NULL REFERENCES profiles(id),
  category     text NOT NULL
               CHECK (category IN (
                 'Story Ideas', 'Data & Sources', 'Expert Contacts',
                 'Collaboration', 'Announcements'
               )),
  reply_count  integer NOT NULL DEFAULT 0,   -- updated by trigger on cafe_replies
  is_pinned    boolean NOT NULL DEFAULT false,
  is_locked    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
```

---

## cafe_replies

```sql
CREATE TABLE cafe_replies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid NOT NULL REFERENCES cafe_threads(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES profiles(id),
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger: increment reply_count on cafe_threads
CREATE OR REPLACE FUNCTION increment_reply_count()
RETURNS trigger AS $$
BEGIN
  UPDATE cafe_threads SET reply_count = reply_count + 1, updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_reply_insert
  AFTER INSERT ON cafe_replies
  FOR EACH ROW EXECUTE FUNCTION increment_reply_count();
```

---

## events

```sql
CREATE TABLE events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  type              text NOT NULL CHECK (type IN ('Workshop', 'Webinar', 'Conference', 'Networking')),
  status            text NOT NULL CHECK (status IN ('upcoming', 'past')),
  date              date NOT NULL,
  location          text,              -- city/country or "Online"
  description       text,
  cover_image_url   text,
  registration_url  text,
  is_members_only   boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);
```

---

## webinars

```sql
CREATE TABLE webinars (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  speaker          text,
  date             date,
  duration_minutes integer,
  theme            text,
  video_url        text,        -- YouTube/Vimeo embed URL
  thumbnail_url    text,
  description      text,
  created_at       timestamptz NOT NULL DEFAULT now()
);
```

---

## announcements

```sql
CREATE TABLE announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  body        text NOT NULL,
  author_id   uuid NOT NULL REFERENCES profiles(id),
  audience    text NOT NULL DEFAULT 'all',   -- 'all' | 'workshop:1' | 'country:MY' | …
  priority    text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
  status      text NOT NULL DEFAULT 'draft'  CHECK (status IN ('draft', 'sent')),
  sent_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

---

## committee_members

```sql
CREATE TABLE committee_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    text NOT NULL,
  role         text NOT NULL,      -- position title
  organisation text,
  country      text,
  photo_url    text,
  bio          text,
  sort_order   integer NOT NULL DEFAULT 0,
  is_active    boolean NOT NULL DEFAULT true
);
```

---

## resource_downloads

Audit log — one row per download event.

```sql
CREATE TABLE resource_downloads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id   uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles(id),
  downloaded_at timestamptz NOT NULL DEFAULT now()
);

-- After insert, increment resources.download_count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS trigger AS $$
BEGIN
  UPDATE resources SET download_count = download_count + 1 WHERE id = NEW.resource_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_download_insert
  AFTER INSERT ON resource_downloads
  FOR EACH ROW EXECUTE FUNCTION increment_download_count();
```

---

## Full-text Search

`search_vector` tsvector columns with GIN indexes exist on `resources`, `publications`, and `experts`. All three are queried via the unified `/api/mpn/search` endpoint.

```ts
// Supabase query example
const { data } = await supabase
  .from('resources')
  .select('id, title, type, theme, source')
  .textSearch('search_vector', query, { type: 'websearch' })
  .limit(20)
```
