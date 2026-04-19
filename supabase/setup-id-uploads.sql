insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'booking-ids',
  'booking-ids',
  false,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "booking id uploads"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'booking-ids'
  and lower(storage.extension(name)) = any (array['jpg', 'jpeg', 'png', 'webp'])
);

create policy "booking id cleanup"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'booking-ids');
