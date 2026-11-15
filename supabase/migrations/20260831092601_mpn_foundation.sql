-- MPN Phase 0 foundation. Private file paths and contact details are never
-- granted to browser roles; public browsing is limited to the views below.

create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique check (number > 0),
  title text not null check (btrim(title) <> ''),
  date date not null,
  location text not null check (btrim(location) <> ''),
  participant_count integer check (participant_count is null or participant_count >= 0),
  description text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (btrim(full_name) <> ''),
  email text not null check (btrim(email) <> ''),
  organisation text,
  country text check (country is null or country ~ '^[A-Z]{2}$'),
  role text not null default 'pending'
    check (role in ('pending', 'member', 'admin', 'rejected')),
  workshop_id uuid references public.workshops(id) on delete set null,
  bio text,
  profile_photo_url text,
  linkedin_url text,
  email_visible boolean not null default false,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.immutable_text_array_to_string(
  input_values text[],
  separator text
)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select array_to_string(input_values, separator);
$$;

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (btrim(title) <> ''),
  description text,
  type text not null check (btrim(type) <> ''),
  theme text not null check (btrim(theme) <> ''),
  source text,
  published_date date,
  article_url text,
  file_url text,
  visibility text not null default 'members'
    check (visibility in ('members', 'workshop_alumni', 'admins')),
  workshop_id uuid references public.workshops(id) on delete set null,
  uploaded_by uuid not null references public.profiles(id),
  download_count integer not null default 0 check (download_count >= 0),
  tags text[],
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') ||
      ' ' || coalesce(theme, '') || ' ' || coalesce(source, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_workshop_visibility_check
    check (visibility <> 'workshop_alumni' or workshop_id is not null)
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null check (btrim(title) <> ''),
  author_id uuid not null references public.profiles(id),
  outlet text,
  published_date date,
  country text check (country is null or country ~ '^[A-Z]{2}$'),
  language text,
  type text not null check (btrim(type) <> ''),
  theme text not null check (btrim(theme) <> ''),
  description text,
  tags text[],
  article_url text,
  pdf_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  view_count integer not null default 0 check (view_count >= 0),
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') ||
      ' ' || coalesce(theme, '') || ' ' || coalesce(outlet, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publications_review_check check (
    (status = 'pending' and reviewed_by is null and reviewed_at is null)
    or (status in ('approved', 'rejected') and reviewed_by is not null and reviewed_at is not null)
  )
);

create table public.experts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (btrim(full_name) <> ''),
  role text not null check (btrim(role) <> ''),
  organisation text not null check (btrim(organisation) <> ''),
  country text not null check (country ~ '^[A-Z]{2}$'),
  expertise text[],
  bio text,
  email text,
  linkedin_url text,
  photo_url text,
  publication_count integer not null default 0 check (publication_count >= 0),
  is_active boolean not null default true,
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(role, '') ||
      ' ' || coalesce(organisation, '') || ' ' || coalesce(bio, '') || ' ' ||
      public.immutable_text_array_to_string(
        coalesce(expertise, '{}'::text[]),
        ' '
      ))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cafe_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null check (btrim(title) <> ''),
  body text not null check (btrim(body) <> ''),
  author_id uuid not null references public.profiles(id),
  category text not null check (category in (
    'Story Ideas', 'Data & Sources', 'Expert Contacts', 'Collaboration', 'Announcements'
  )),
  reply_count integer not null default 0 check (reply_count >= 0),
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cafe_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.cafe_threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  body text not null check (btrim(body) <> ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (btrim(title) <> ''),
  type text not null check (type in ('Workshop', 'Webinar', 'Conference', 'Networking')),
  status text not null check (status in ('upcoming', 'past')),
  date date not null,
  location text,
  description text,
  cover_image_url text,
  registration_url text,
  is_members_only boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.webinars (
  id uuid primary key default gen_random_uuid(),
  title text not null check (btrim(title) <> ''),
  speaker text,
  date date,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  theme text,
  video_url text,
  thumbnail_url text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (btrim(title) <> ''),
  body text not null check (btrim(body) <> ''),
  author_id uuid not null references public.profiles(id),
  audience text not null default 'all' check (btrim(audience) <> ''),
  priority text not null default 'normal' check (priority in ('normal', 'important', 'urgent')),
  status text not null default 'draft' check (status in ('draft', 'sent')),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcements_sent_check check (
    (status = 'draft' and sent_at is null) or (status = 'sent' and sent_at is not null)
  )
);

create table public.committee_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (btrim(full_name) <> ''),
  role text not null check (btrim(role) <> ''),
  organisation text,
  country text check (country is null or country ~ '^[A-Z]{2}$'),
  photo_url text,
  bio text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resource_downloads (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

create index profiles_workshop_idx on public.profiles(workshop_id);
create index resources_search_idx on public.resources using gin(search_vector);
create index resources_workshop_idx on public.resources(workshop_id);
create index resources_theme_idx on public.resources(theme);
create index resources_type_idx on public.resources(type);
create index publications_search_idx on public.publications using gin(search_vector);
create index publications_status_idx on public.publications(status);
create index publications_author_idx on public.publications(author_id);
create index experts_search_idx on public.experts using gin(search_vector);
create index experts_country_idx on public.experts(country);
create index cafe_threads_listing_idx on public.cafe_threads(is_pinned desc, updated_at desc);
create index cafe_replies_thread_idx on public.cafe_replies(thread_id, created_at);
create index events_date_idx on public.events(date);
create index announcements_status_idx on public.announcements(status, sent_at desc);
create index committee_members_active_sort_idx on public.committee_members(is_active, sort_order);
create index resource_downloads_resource_idx on public.resource_downloads(resource_id, downloaded_at desc);
create index resource_downloads_user_idx on public.resource_downloads(user_id, downloaded_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = ''
as $$
  select p.role from public.profiles as p where p.id = (select auth.uid())
$$;

create or replace function public.current_user_workshop_id()
returns uuid
language sql
security definer
stable
set search_path = ''
as $$
  select p.workshop_id from public.profiles as p where p.id = (select auth.uid())
$$;

create or replace function public.current_user_workshop_number()
returns integer
language sql
security definer
stable
set search_path = ''
as $$
  select w.number
  from public.profiles as p
  join public.workshops as w on w.id = p.workshop_id
  where p.id = (select auth.uid())
$$;

create or replace function public.increment_reply_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.cafe_threads
  set reply_count = reply_count + 1, updated_at = now()
  where id = new.thread_id;
  return new;
end;
$$;

create or replace function public.decrement_reply_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.cafe_threads
  set reply_count = greatest(reply_count - 1, 0), updated_at = now()
  where id = old.thread_id;
  return old;
end;
$$;

create or replace function public.increment_download_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.resources
  set download_count = download_count + 1, updated_at = now()
  where id = new.resource_id;
  return new;
end;
$$;

create or replace function public.create_profile_on_email_confirmation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    insert into public.profiles (id, email, full_name, organisation, country, workshop_id, role)
    values (
      new.id,
      new.email,
      coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), new.email),
      nullif(btrim(new.raw_user_meta_data ->> 'organisation'), ''),
      case
        when upper(coalesce(new.raw_user_meta_data ->> 'country', '')) ~ '^[A-Z]{2}$'
          then upper(new.raw_user_meta_data ->> 'country')
        else null
      end,
      (
        select w.id
        from public.workshops as w
        where w.id::text = new.raw_user_meta_data ->> 'workshop_id'
      ),
      'pending'
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

create trigger workshops_set_updated_at before update on public.workshops
for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger resources_set_updated_at before update on public.resources
for each row execute function public.set_updated_at();
create trigger publications_set_updated_at before update on public.publications
for each row execute function public.set_updated_at();
create trigger experts_set_updated_at before update on public.experts
for each row execute function public.set_updated_at();
create trigger cafe_threads_set_updated_at before update on public.cafe_threads
for each row execute function public.set_updated_at();
create trigger cafe_replies_set_updated_at before update on public.cafe_replies
for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();
create trigger webinars_set_updated_at before update on public.webinars
for each row execute function public.set_updated_at();
create trigger announcements_set_updated_at before update on public.announcements
for each row execute function public.set_updated_at();
create trigger committee_members_set_updated_at before update on public.committee_members
for each row execute function public.set_updated_at();
create trigger cafe_replies_increment_count after insert on public.cafe_replies
for each row execute function public.increment_reply_count();
create trigger cafe_replies_decrement_count after delete on public.cafe_replies
for each row execute function public.decrement_reply_count();
create trigger resource_downloads_increment_count after insert on public.resource_downloads
for each row execute function public.increment_download_count();
create trigger on_auth_user_email_confirmed
after update of email_confirmed_at on auth.users
for each row execute function public.create_profile_on_email_confirmation();

alter table public.workshops enable row level security;
alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.publications enable row level security;
alter table public.experts enable row level security;
alter table public.cafe_threads enable row level security;
alter table public.cafe_replies enable row level security;
alter table public.events enable row level security;
alter table public.webinars enable row level security;
alter table public.announcements enable row level security;
alter table public.committee_members enable row level security;
alter table public.resource_downloads enable row level security;

create policy profiles_select_own_or_admin on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.current_user_role() = 'admin');
create policy profiles_public_directory_read on public.profiles for select to anon, authenticated
using (role = 'member');
create policy profiles_update_own on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()) and role = public.current_user_role());
create policy profiles_admin_manage on public.profiles for all to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy workshops_public_read on public.workshops for select to anon, authenticated using (true);
create policy workshops_admin_manage on public.workshops for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy resources_public_safe_read on public.resources for select to anon, authenticated using (true);
create policy resources_admin_manage on public.resources for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy publications_public_approved_read on public.publications for select to anon, authenticated
using (status = 'approved');
create policy publications_member_read_own on public.publications for select to authenticated
using (author_id = (select auth.uid()));
create policy publications_member_insert_own on public.publications for insert to authenticated
with check (author_id = (select auth.uid()) and public.current_user_role() in ('member', 'admin'));
create policy publications_member_update_own_pending on public.publications for update to authenticated
using (author_id = (select auth.uid()) and status = 'pending')
with check (author_id = (select auth.uid()) and status = 'pending');
create policy publications_admin_manage on public.publications for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy experts_public_safe_read on public.experts for select to anon, authenticated using (is_active);
create policy experts_admin_manage on public.experts for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy cafe_threads_public_read on public.cafe_threads for select to anon, authenticated using (true);
create policy cafe_threads_member_insert on public.cafe_threads for insert to authenticated
with check (author_id = (select auth.uid()) and public.current_user_role() in ('member', 'admin'));
create policy cafe_threads_author_update on public.cafe_threads for update to authenticated
using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy cafe_threads_author_delete on public.cafe_threads for delete to authenticated
using (author_id = (select auth.uid()));
create policy cafe_threads_admin_manage on public.cafe_threads for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy cafe_replies_public_read on public.cafe_replies for select to anon, authenticated using (true);
create policy cafe_replies_member_insert on public.cafe_replies for insert to authenticated
with check (
  author_id = (select auth.uid())
  and public.current_user_role() in ('member', 'admin')
  and exists (select 1 from public.cafe_threads t where t.id = thread_id and not t.is_locked)
);
create policy cafe_replies_author_update on public.cafe_replies for update to authenticated
using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy cafe_replies_author_delete on public.cafe_replies for delete to authenticated
using (author_id = (select auth.uid()));
create policy cafe_replies_admin_manage on public.cafe_replies for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy events_public_read on public.events for select to anon, authenticated using (true);
create policy events_admin_manage on public.events for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy webinars_public_read on public.webinars for select to anon, authenticated using (true);
create policy webinars_admin_manage on public.webinars for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy committee_members_public_read on public.committee_members for select to anon, authenticated using (is_active);
create policy committee_members_admin_manage on public.committee_members for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy announcements_member_read_sent on public.announcements for select to authenticated
using (status = 'sent' and public.current_user_role() in ('member', 'admin'));
create policy announcements_admin_manage on public.announcements for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy resource_downloads_admin_read on public.resource_downloads for select to authenticated
using (public.current_user_role() = 'admin');
create policy resource_downloads_insert_own on public.resource_downloads for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.resources as r
    where r.id = resource_id
      and (
        r.visibility = 'members'
        or (r.visibility = 'admins' and public.current_user_role() = 'admin')
        or (
          r.visibility = 'workshop_alumni'
          and (
            public.current_user_role() = 'admin'
            or r.workshop_id = public.current_user_workshop_id()
          )
        )
      )
  )
);
create policy resource_downloads_admin_update on public.resource_downloads for update to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy resource_downloads_admin_delete on public.resource_downloads for delete to authenticated
using (public.current_user_role() = 'admin');

create view public.profiles_directory with (security_invoker = true) as
select id, full_name, organisation, country, role, workshop_id, bio, profile_photo_url,
  linkedin_url, created_at, updated_at
from public.profiles;
create view public.experts_public with (security_invoker = true) as
select id, full_name, role, organisation, country, expertise, bio, linkedin_url, photo_url,
  publication_count, is_active, created_at, updated_at
from public.experts;
create view public.resources_public with (security_invoker = true) as
select id, title, description, type, theme, source, published_date, article_url, visibility,
  workshop_id, uploaded_by, download_count, tags, created_at, updated_at
from public.resources;
create view public.publications_public with (security_invoker = true) as
select id, title, author_id, outlet, published_date, country, language, type, theme,
  description, tags, article_url, status, reviewed_at, view_count, created_at, updated_at
from public.publications
where status = 'approved';

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select (id, number, title, date, location, participant_count, description, cover_image_url, created_at, updated_at)
  on public.workshops to anon, authenticated;
grant select (id, full_name, organisation, country, role, workshop_id, bio, profile_photo_url, linkedin_url, rejection_reason, created_at, updated_at)
  on public.profiles to anon, authenticated;
grant select (id, title, description, type, theme, source, published_date, article_url, visibility, workshop_id, uploaded_by, download_count, tags, created_at, updated_at)
  on public.resources to anon, authenticated;
grant select (id, title, author_id, outlet, published_date, country, language, type, theme, description, tags, article_url, status, reviewed_at, view_count, created_at, updated_at)
  on public.publications to anon, authenticated;
grant select (id, full_name, role, organisation, country, expertise, bio, linkedin_url, photo_url, publication_count, is_active, created_at, updated_at)
  on public.experts to anon, authenticated;
grant select on public.cafe_threads, public.cafe_replies, public.events, public.webinars, public.committee_members to anon, authenticated;
grant select on public.announcements, public.resource_downloads to authenticated;
grant update (full_name, organisation, country, bio, profile_photo_url, linkedin_url, email_visible)
  on public.profiles to authenticated;
grant insert, update, delete on public.resources, public.publications, public.experts,
  public.cafe_threads, public.cafe_replies, public.workshops, public.events, public.webinars,
  public.announcements, public.committee_members, public.resource_downloads to authenticated;
grant select on public.profiles_directory, public.experts_public, public.resources_public, public.publications_public
  to anon, authenticated;
grant execute on function public.current_user_role(), public.current_user_workshop_id(),
  public.current_user_workshop_number() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('resources', 'resources', false, 26214400, array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']),
  ('publications', 'publications', false, 26214400, array['application/pdf']),
  ('workshop-materials', 'workshop-materials', false, 52428800, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('expert-photos', 'expert-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('event-covers', 'event-covers', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy avatars_public_read on storage.objects for select to anon, authenticated
using (bucket_id = 'avatars');
create policy avatars_owner_insert on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and name = 'public/' || (select auth.uid())::text);
create policy avatars_owner_update on storage.objects for update to authenticated
using (bucket_id = 'avatars' and name = 'public/' || (select auth.uid())::text)
with check (bucket_id = 'avatars' and name = 'public/' || (select auth.uid())::text);
create policy avatars_owner_delete on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and name = 'public/' || (select auth.uid())::text);

create policy expert_photos_public_read on storage.objects for select to anon, authenticated
using (bucket_id = 'expert-photos');
create policy expert_photos_admin_insert on storage.objects for insert to authenticated
with check (bucket_id = 'expert-photos' and public.current_user_role() = 'admin');
create policy expert_photos_admin_update on storage.objects for update to authenticated
using (bucket_id = 'expert-photos' and public.current_user_role() = 'admin')
with check (bucket_id = 'expert-photos' and public.current_user_role() = 'admin');
create policy expert_photos_admin_delete on storage.objects for delete to authenticated
using (bucket_id = 'expert-photos' and public.current_user_role() = 'admin');

create policy event_covers_public_read on storage.objects for select to anon, authenticated
using (bucket_id = 'event-covers');
create policy event_covers_admin_insert on storage.objects for insert to authenticated
with check (bucket_id = 'event-covers' and public.current_user_role() = 'admin');
create policy event_covers_admin_update on storage.objects for update to authenticated
using (bucket_id = 'event-covers' and public.current_user_role() = 'admin')
with check (bucket_id = 'event-covers' and public.current_user_role() = 'admin');
create policy event_covers_admin_delete on storage.objects for delete to authenticated
using (bucket_id = 'event-covers' and public.current_user_role() = 'admin');

-- Private buckets never grant anonymous access. Files are normally delivered by
-- a server-created signed URL after application authorization; the policies
-- additionally restrict any direct Storage API use to the same roles.
create policy resources_admin_manage on storage.objects for all to authenticated
using (bucket_id = 'resources' and public.current_user_role() = 'admin')
with check (bucket_id = 'resources' and public.current_user_role() = 'admin');
create policy publications_member_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'publications'
  and public.current_user_role() in ('member', 'admin')
  and name like (select auth.uid())::text || '/%'
);
create policy publications_member_delete on storage.objects for delete to authenticated
using (
  bucket_id = 'publications'
  and name like (select auth.uid())::text || '/%'
  and public.current_user_role() in ('member', 'admin')
);
create policy workshop_materials_matching_read on storage.objects for select to authenticated
using (
  bucket_id = 'workshop-materials'
  and (
    public.current_user_role() = 'admin'
    or (storage.foldername(name))[1] = 'workshop-' || public.current_user_workshop_number()::text
  )
);
create policy workshop_materials_admin_manage on storage.objects for all to authenticated
using (bucket_id = 'workshop-materials' and public.current_user_role() = 'admin')
with check (bucket_id = 'workshop-materials' and public.current_user_role() = 'admin');
