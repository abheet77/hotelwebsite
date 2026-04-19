create table if not exists public.room_inventory (
  room_type text primary key,
  total_units integer not null check (total_units >= 0),
  updated_at timestamp with time zone not null default now()
);

alter table public.room_inventory enable row level security;

drop policy if exists "room inventory read for anon and authenticated" on public.room_inventory;
create policy "room inventory read for anon and authenticated"
on public.room_inventory
for select
to anon, authenticated
using (true);

drop policy if exists "room inventory write for anon and authenticated" on public.room_inventory;
create policy "room inventory write for anon and authenticated"
on public.room_inventory
for all
to anon, authenticated
using (true)
with check (true);

insert into public.room_inventory (room_type, total_units)
values
  ('Market Facing', 1),
  ('Hill Facing', 1),
  ('Twin Room', 1)
on conflict (room_type) do nothing;

create table if not exists public.room_availability (
  room_type text not null,
  status_date date not null,
  is_closed boolean not null default false,
  status_note text,
  updated_at timestamp with time zone not null default now(),
  primary key (room_type, status_date)
);

alter table public.room_availability enable row level security;

drop policy if exists "room availability read for anon and authenticated" on public.room_availability;
create policy "room availability read for anon and authenticated"
on public.room_availability
for select
to anon, authenticated
using (true);

drop policy if exists "room availability write for anon and authenticated" on public.room_availability;
create policy "room availability write for anon and authenticated"
on public.room_availability
for all
to anon, authenticated
using (true)
with check (true);
