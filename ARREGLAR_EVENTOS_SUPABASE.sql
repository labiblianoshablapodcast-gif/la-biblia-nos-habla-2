-- Arreglo único para fotografías de eventos
-- Ejecute este archivo una sola vez en Supabase → SQL Editor → Run.

begin;

alter table public.events
  add column if not exists image_url text;

alter table public.events
  add column if not exists image_path text;

alter table public.events enable row level security;

drop policy if exists "Public reads published events" on public.events;
create policy "Public reads published events"
on public.events for select
using (published=true or public.is_staff());

drop policy if exists "Staff manages events" on public.events;
create policy "Staff manages events"
on public.events for all
to authenticated
using (public.is_staff())
with check (public.is_staff());

grant select on public.events to anon;
grant select,insert,update,delete on public.events to authenticated;

commit;

-- Obliga a PostgREST/Supabase a reconocer las nuevas columnas inmediatamente.
notify pgrst, 'reload schema';

select
  'Eventos preparados correctamente' as resultado,
  exists(
    select 1
    from information_schema.columns
    where table_schema='public'
      and table_name='events'
      and column_name='image_url'
  ) as image_url_lista,
  exists(
    select 1
    from information_schema.columns
    where table_schema='public'
      and table_name='events'
      and column_name='image_path'
  ) as image_path_lista;
