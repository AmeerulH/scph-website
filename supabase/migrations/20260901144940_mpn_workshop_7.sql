insert into public.workshops (number, title)
values (
  7,
  'Cutting through the Haze: Transboundary Air Pollution, El Niño and Health Reporting in South and Southeast Asia'
)
on conflict (number) do update
set title = excluded.title;
