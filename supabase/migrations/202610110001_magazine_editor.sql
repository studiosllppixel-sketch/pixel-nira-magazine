-- Run only in the NEW Pixel × Nira magazine Supabase project.
create table if not exists public.magazine_pages (
 id uuid primary key default gen_random_uuid(),
 brand text not null unique check (brand in ('pixel','nira')),
 slug text not null unique,
 draft_content jsonb not null default '{"layout":"editorial","elements":[]}'::jsonb,
 published_content jsonb not null default '{"layout":"editorial","elements":[]}'::jsonb,
 status text not null default 'draft' check (status in ('draft','published')),
 updated_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 published_at timestamptz
);
alter table public.magazine_pages enable row level security;
drop policy if exists "Public can read published pages" on public.magazine_pages;
create policy "Public can read published pages" on public.magazine_pages for select to anon,authenticated using (status='published');
drop policy if exists "Admins can read all pages" on public.magazine_pages;
create policy "Admins can read all pages" on public.magazine_pages for select to authenticated using ((select auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "Admins can insert pages" on public.magazine_pages;
create policy "Admins can insert pages" on public.magazine_pages for insert to authenticated with check ((select auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "Admins can update pages" on public.magazine_pages;
create policy "Admins can update pages" on public.magazine_pages for update to authenticated using ((select auth.jwt()->'app_metadata'->>'role')='admin') with check ((select auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "Admins can delete pages" on public.magazine_pages;
create policy "Admins can delete pages" on public.magazine_pages for delete to authenticated using ((select auth.jwt()->'app_metadata'->>'role')='admin');
grant select on public.magazine_pages to anon,authenticated;
grant insert,update,delete on public.magazine_pages to authenticated;

-- Create a PRIVATE Storage bucket called editorial-media in the dashboard.
drop policy if exists "Editorial admins read media" on storage.objects;
create policy "Editorial admins read media" on storage.objects for select to authenticated using (bucket_id='editorial-media' and (select auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "Editorial admins upload media" on storage.objects;
create policy "Editorial admins upload media" on storage.objects for insert to authenticated with check (bucket_id='editorial-media' and (select auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "Editorial admins update media" on storage.objects;
create policy "Editorial admins update media" on storage.objects for update to authenticated using (bucket_id='editorial-media' and (select auth.jwt()->'app_metadata'->>'role')='admin') with check (bucket_id='editorial-media' and (select auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "Editorial admins delete media" on storage.objects;
create policy "Editorial admins delete media" on storage.objects for delete to authenticated using (bucket_id='editorial-media' and (select auth.jwt()->'app_metadata'->>'role')='admin');
