-- MPN gallery photos are private objects. The database exposes only their
-- metadata to alumni of the matching workshop; signed URLs remain server-only.

create table public.shared_resources (
  id uuid primary key default gen_random_uuid(),
  sheet_row integer not null unique check (sheet_row > 0),
  title text not null check (btrim(title) <> ''),
  description text,
  resource_type text not null check (btrim(resource_type) <> ''),
  themes text[] not null default '{}'::text[],
  published_date date,
  external_url text,
  file_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workshop_photos (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  drive_file_id text not null unique check (btrim(drive_file_id) <> ''),
  storage_path text not null unique check (btrim(storage_path) <> ''),
  original_name text not null check (btrim(original_name) <> ''),
  content_type text not null check (btrim(content_type) <> ''),
  bytes integer not null check (bytes > 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  sort_order integer not null default 0 check (sort_order >= 0),
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shared_resources_published_date_idx
  on public.shared_resources(published_date desc nulls last);
create index shared_resources_resource_type_idx
  on public.shared_resources(resource_type);
create index workshop_photos_workshop_sort_idx
  on public.workshop_photos(workshop_id, sort_order);

create trigger shared_resources_set_updated_at before update on public.shared_resources
for each row execute function public.set_updated_at();
create trigger workshop_photos_set_updated_at before update on public.workshop_photos
for each row execute function public.set_updated_at();

alter table public.shared_resources enable row level security;
alter table public.workshop_photos enable row level security;

create policy shared_resources_public_read on public.shared_resources
for select to anon, authenticated using (true);
create policy shared_resources_admin_manage on public.shared_resources
for all to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy workshop_photos_alumni_read on public.workshop_photos
for select to authenticated
using (
  public.current_user_role() = 'admin'
  or workshop_id = public.current_user_workshop_id()
);
create policy workshop_photos_admin_manage on public.workshop_photos
for all to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create view public.shared_resources_public with (security_invoker = true) as
select id, title, description, resource_type, themes, published_date, external_url,
  file_url, created_at, updated_at
from public.shared_resources;

grant select on public.shared_resources, public.shared_resources_public
  to anon, authenticated;
grant select on public.workshop_photos to authenticated;
grant insert, update, delete on public.shared_resources, public.workshop_photos
  to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workshop-photos',
  'workshop-photos',
  false,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy workshop_photos_storage_alumni_read on storage.objects
for select to authenticated
using (
  bucket_id = 'workshop-photos'
  and (
    public.current_user_role() = 'admin'
    or (storage.foldername(name))[1] = 'workshop-'
      || public.current_user_workshop_number()::text
  )
);
create policy workshop_photos_storage_admin_manage on storage.objects
for all to authenticated
using (
  bucket_id = 'workshop-photos'
  and public.current_user_role() = 'admin'
)
with check (
  bucket_id = 'workshop-photos'
  and public.current_user_role() = 'admin'
);
