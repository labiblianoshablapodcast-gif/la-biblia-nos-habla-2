-- Endurecimiento de seguridad para Eventos, Galería y Storage
-- Ejecute todo este archivo en Supabase -> SQL Editor -> Run.
-- Es idempotente: puede volver a ejecutarse y no borra contenido.
--
-- Objetivo:
-- 1. Alinear las políticas RLS con los permisos visibles en el Panel Pastoral.
-- 2. Impedir que un miembro del equipo modifique archivos de otro usuario.
-- 3. Conservar la lectura pública únicamente del contenido publicado.

begin;

create or replace function public.current_ministry_role()
returns text
language sql
stable
security definer
set search_path=public
as $$
  select coalesce(
    (select role from public.profiles where id=auth.uid()),
    'member'
  );
$$;

create or replace function public.can_manage_area(area_name text)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select case public.current_ministry_role()
    when 'pastor' then true
    when 'secretary' then area_name in (
      'events','devotionals','prayer_requests','new_believers','john_study'
    )
    when 'media' then area_name in (
      'sermons','devotionals','events','gallery','missions'
    )
    when 'treasurer' then area_name='donations'
    else false
  end;
$$;

create or replace function public.can_manage_site_media(object_name text)
returns boolean
language sql
stable
security definer
set search_path=public,storage
as $$
  select
    public.current_ministry_role()='pastor'
    or (
      (storage.foldername(object_name))[2]=auth.uid()::text
      and case (storage.foldername(object_name))[1]
        when 'events' then public.can_manage_area('events')
        when 'gallery' then public.can_manage_area('gallery')
        else false
      end
    );
$$;

revoke all on function public.current_ministry_role() from public;
revoke all on function public.can_manage_area(text) from public;
revoke all on function public.can_manage_site_media(text) from public;
-- anon necesita evaluar las políticas públicas; sin sesión estas funciones
-- siempre devuelven el rol member y no conceden administración.
grant execute on function public.current_ministry_role() to anon, authenticated;
grant execute on function public.can_manage_area(text) to anon, authenticated;
grant execute on function public.can_manage_site_media(text) to authenticated;

-- EVENTOS
alter table public.events enable row level security;

drop policy if exists "Public reads published events" on public.events;
drop policy if exists "Staff manages events" on public.events;
drop policy if exists "Authorized team manages events" on public.events;

create policy "Public reads published events"
on public.events for select
using (published=true or public.can_manage_area('events'));

create policy "Authorized team manages events"
on public.events for all
to authenticated
using (public.can_manage_area('events'))
with check (public.can_manage_area('events'));

-- GALERÍA
alter table public.gallery_items enable row level security;

drop policy if exists "Public reads published gallery" on public.gallery_items;
drop policy if exists "Staff manages gallery" on public.gallery_items;
drop policy if exists "Authorized media team manages gallery" on public.gallery_items;

create policy "Public reads published gallery"
on public.gallery_items for select
using (published=true or public.can_manage_area('gallery'));

create policy "Authorized media team manages gallery"
on public.gallery_items for all
to authenticated
using (public.can_manage_area('gallery'))
with check (public.can_manage_area('gallery'));

-- STORAGE
-- Las rutas creadas por el sitio tienen el formato:
-- events/ID-USUARIO/archivo o gallery/ID-USUARIO/archivo.
drop policy if exists "Public views site media" on storage.objects;
drop policy if exists "Staff uploads site media" on storage.objects;
drop policy if exists "Staff updates site media" on storage.objects;
drop policy if exists "Staff deletes site media" on storage.objects;
drop policy if exists "Authorized team uploads site media" on storage.objects;
drop policy if exists "Owners update site media" on storage.objects;
drop policy if exists "Owners delete site media" on storage.objects;

create policy "Public views site media"
on storage.objects for select
using (bucket_id='site-media');

create policy "Authorized team uploads site media"
on storage.objects for insert
to authenticated
with check (
  bucket_id='site-media'
  and public.can_manage_site_media(name)
);

create policy "Owners update site media"
on storage.objects for update
to authenticated
using (
  bucket_id='site-media'
  and public.can_manage_site_media(name)
)
with check (
  bucket_id='site-media'
  and public.can_manage_site_media(name)
);

create policy "Owners delete site media"
on storage.objects for delete
to authenticated
using (
  bucket_id='site-media'
  and public.can_manage_site_media(name)
);

commit;

notify pgrst, 'reload schema';

select
  'Seguridad preparada correctamente' as resultado,
  public.current_ministry_role() as rol_actual,
  public.can_manage_area('events') as puede_eventos,
  public.can_manage_area('gallery') as puede_galeria;
