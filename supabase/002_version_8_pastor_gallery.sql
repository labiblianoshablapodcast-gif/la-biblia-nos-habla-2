-- La Biblia Nos Habla 2.0 — Version 8.0
-- Run once in Supabase SQL Editor after the Version 7.1 migration.

create table if not exists public.ministry_gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt_text text not null,
  category text not null check (category in ('pastor-y-yudelka','ministerio','misiones','familia','eventos')),
  image_path text not null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.ministry_gallery_items enable row level security;

drop policy if exists "Published gallery items are public" on public.ministry_gallery_items;
create policy "Published gallery items are public" on public.ministry_gallery_items
  for select using (is_published = true);

-- Replace `authenticated` with your administrator role or add the matching admin condition
-- used by the Version 7.1 schema.
drop policy if exists "Authenticated users manage gallery" on public.ministry_gallery_items;
create policy "Authenticated users manage gallery" on public.ministry_gallery_items
  for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('ministry-gallery', 'ministry-gallery', true)
on conflict (id) do nothing;

drop policy if exists "Public can read ministry gallery" on storage.objects;
create policy "Public can read ministry gallery" on storage.objects for select
  using (bucket_id = 'ministry-gallery');

drop policy if exists "Authenticated users manage ministry gallery" on storage.objects;
create policy "Authenticated users manage ministry gallery" on storage.objects for all to authenticated
  using (bucket_id = 'ministry-gallery') with check (bucket_id = 'ministry-gallery');
