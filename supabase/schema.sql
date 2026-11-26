-- Run this whole file once in Supabase: Dashboard > SQL Editor > New query > Run

-- ───────── Profiles (one row per user; credentials live in Supabase Auth, hashed) ─────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  role text not null default 'student' check (role in ('student','owner','admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ───────── Listings ─────────
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  category text not null check (category in ('pg','tiffin','books')),
  price integer not null check (price >= 0),
  area text not null,
  description text not null default '',
  images text[] not null default '{}',
  owner_name text not null default '',
  owner_phone text not null default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  lat double precision,
  lng double precision,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index listings_status_created_idx on public.listings (status, created_at desc);

-- ───────── Reviews ─────────
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  user_name text not null default '',
  rating integer not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 3 and 500),
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

-- ───────── Row Level Security (this is what actually protects your data) ─────────
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.reviews  enable row level security;

create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "listings: public sees approved, owner sees own, admin sees all" on public.listings
  for select using (status = 'approved' or owner_id = auth.uid() or public.is_admin());
create policy "listings: signed-in users create pending listings" on public.listings
  for insert to authenticated with check (owner_id = auth.uid() and status = 'pending');
create policy "listings: admin updates (approve/reject)" on public.listings
  for update using (public.is_admin()) with check (public.is_admin());
create policy "listings: owner or admin deletes" on public.listings
  for delete using (owner_id = auth.uid() or public.is_admin());

create policy "reviews: anyone reads" on public.reviews for select using (true);
create policy "reviews: signed-in users post as themselves" on public.reviews
  for insert to authenticated with check (user_id = auth.uid());
create policy "reviews: owner or admin deletes" on public.reviews
  for delete using (user_id = auth.uid() or public.is_admin());

-- ───────── Image storage ─────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "images: public read" on storage.objects
  for select using (bucket_id = 'listing-images');
create policy "images: upload into own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "images: delete own or admin" on storage.objects
  for delete using (
    bucket_id = 'listing-images'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- ───────── Make yourself the admin (after you sign up in the app) ─────────
-- update public.profiles set role = 'admin' where email = 'YOUR_EMAIL@example.com';
