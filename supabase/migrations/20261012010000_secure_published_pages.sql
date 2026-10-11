-- Restrict public magazine reads to published content only.
-- Draft content remains available to authenticated admins through magazine_pages.
begin;

create or replace view public.magazine_public_pages
with (security_barrier = true, security_invoker = true)
as
select brand, slug, published_content
from public.magazine_pages
where status = 'published'
  and published_content is not null;

-- Public callers can read only the columns required by the published view.
revoke all on table public.magazine_pages from anon;
grant select (brand, slug, published_content, status)
  on table public.magazine_pages to anon;
grant select on table public.magazine_public_pages to anon, authenticated;

commit;
