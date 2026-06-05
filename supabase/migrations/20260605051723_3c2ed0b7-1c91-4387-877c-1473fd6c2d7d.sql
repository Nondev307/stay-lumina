
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  room_number text not null unique,
  nickname text not null,
  created_at timestamptz not null default now()
);
grant select on public.bookings to anon, authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "Public can read bookings"
  on public.bookings for select
  to anon, authenticated
  using (true);

create table public.booking_private (
  booking_id uuid primary key references public.bookings(id) on delete cascade,
  phone text not null,
  secret_hash text not null,
  created_at timestamptz not null default now()
);
grant all on public.booking_private to service_role;
alter table public.booking_private enable row level security;
-- intentionally no policies for anon/authenticated; only service_role can access

alter table public.bookings replica identity full;
alter publication supabase_realtime add table public.bookings;
