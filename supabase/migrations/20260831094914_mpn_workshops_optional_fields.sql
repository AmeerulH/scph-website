alter table public.workshops
  alter column date drop not null,
  alter column location drop not null;

insert into public.workshops (number, title)
values
  (1, 'Climate, Air Pollution and Health'),
  (2, 'Extreme Heat and Health'),
  (3, 'Air and Plastic Pollution'),
  (4, 'Intergovernmental Processes'),
  (5, 'Misinformation and Disinformation'),
  (6, 'Heat and Health')
on conflict (number) do update
set title = excluded.title;
